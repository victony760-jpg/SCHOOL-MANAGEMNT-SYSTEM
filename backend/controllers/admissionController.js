import Submission from "../models/submission.js";
import Class from "../models/Class.js";
import { uploadToSupabase, createSignedFileUrl } from "../middleware/upload.js";
import { success, error } from "../utils/response.js";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import { generateStudentId } from "../services/studentIdGenerator.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";

export const submitAdmission = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      parentName,
      dob,
      gender,
      classApplying,
      previousSchool,
      message,
    } = req.body;

    if (!fullName || !email || !parentName || !dob || !classApplying) {
      return error(res, "Missing required fields", 400);
    }

    if (!mongoose.isValidObjectId(classApplying)) {
      return error(res, "Invalid class selected", 400);
    }

    const classExists = await Class.findById(classApplying);
    if (!classExists) return error(res, "Class not found", 400);

    const duplicateApplication = await Submission.findOne({
      type: "admission",
      email: email.trim().toLowerCase(),
      dob: new Date(dob),
      classApplying,
      status: { $in: ["Pending", "Approved"] },
    });
    if (duplicateApplication) {
      return error(
        res,
        "An admission application for this student is already on file.",
        409,
      );
    }

    const applicantPhoto = req.files?.applicantPhoto?.[0];
    const documentFile = req.files?.documents?.[0];
    if (!applicantPhoto) {
      return error(res, "Applicant photo upload is required", 400);
    }

    const [photoUpload, documentUpload] = await Promise.all([
      applicantPhoto
        ? uploadToSupabase(applicantPhoto, "school-admissions/photos")
        : null,
      documentFile
        ? uploadToSupabase(documentFile, "school-admissions/documents")
        : null,
    ]);

    const submission = await Submission.create({
      type: "admission",
      fullName,
      email,
      phone,
      parentName,
      dob,
      gender,
      classApplying,
      previousSchool,
      message,
      status: "Pending",
      applicantPhoto: photoUpload?.url || null,
      applicantPhotoPath: photoUpload?.path || null,
      documents: documentUpload?.url || null,
      documentsPath: documentUpload?.path || null,
    });
    return success(
      res,
      submission,
      "Admission form submitted successfully",
      201,
    );
  } catch (err) {
    return error(res, err.message);
  }
};

export const getAdmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ type: "admission" })
      .populate("classApplying", "fullClassName name")
      .sort({ createdAt: -1 });
    const admissions = await Promise.all(
      submissions.map(async (submission) => {
        const data = submission.toObject();
        try {
          data.applicantPhoto = data.applicantPhoto
            ? await createSignedFileUrl(
                data.applicantPhoto,
                3600,
                data.applicantPhotoPath,
              )
            : null;
        } catch (fileError) {
          console.error("Admission photo URL failed:", fileError.message);
        }
        try {
          data.documents = data.documents
            ? await createSignedFileUrl(
                data.documents,
                3600,
                data.documentsPath,
              )
            : null;
        } catch (fileError) {
          console.error("Admission document URL failed:", fileError.message);
        }
        return data;
      }),
    );
    return success(res, admissions);
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body; // Approved | Rejected | Pending
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return error(res, "Invalid status", 400);
    }

    const submission = await Submission.findById(req.params.id).populate(
      "classApplying",
    );

    if (!submission) return error(res, "Application not found", 404);

    let emailSent = true;
    let emailMessage = null;

    if (status === "Approved") {
      const existingProfile = await StudentProfile.findOne({
        $or: [
          { parentEmail: submission.email },
          { fullName: submission.fullName, dob: submission.dob },
        ],
      });
      let studentID;
      let temporaryPassword;
      let user;
      if (existingProfile) {
        user = await User.findById(existingProfile.user);
        studentID = existingProfile.studentID;
      } else {
        studentID = await generateStudentId();
        user = null;
      }

      temporaryPassword = crypto.randomBytes(5).toString("hex");
      if (!user) {
        const studentEmail = `${studentID.toLowerCase()}@school.internal`;
        let user;
        let profile;
        try {
          user = await User.create({
            name: submission.fullName,
            email: studentEmail,
            password: temporaryPassword,
            role: "student",
            studentID,
            isActive: true,
          });
          profile = await StudentProfile.create({
            user: user._id,
            studentID,
            fullName: submission.fullName,
            dateOfBirth: submission.dob,
            gender: submission.gender,
            classAssigned: submission.classApplying._id,
            parentName: submission.parentName,
            parentEmail: submission.email,
            parentPhone: submission.phone || "Not provided",
            photoUrl: submission.applicantPhoto || null,
            storagePath: submission.applicantPhotoPath || null,
            admissionStatus: "approved",
          });
          user.studentProfile = profile._id;
          await user.save();
        } catch (creationError) {
          if (profile?._id) await StudentProfile.findByIdAndDelete(profile._id);
          if (user?._id) await User.findByIdAndDelete(user._id);
          throw creationError;
        }
        user = await User.findById(profile.user);
      } else {
        user.password = temporaryPassword;
        user.mustChangePassword = true;
        await user.save();
      }

      try {
        await sendEmail({
          to: submission.email,
          subject: "Admission Approved - Victony International Academy",
          html: `<p>Congratulations ${submission.fullName}.</p><p>Your student ID is <b>${studentID}</b>.</p><p>Your temporary password is <b>${temporaryPassword}</b>.</p><p>Use the student ID to log in, then change your password.</p>`,
        });
      } catch (emailError) {
        emailSent = false;
        emailMessage =
          emailError.statusCode === 503
            ? "RESEND_API_KEY is missing on the backend"
            : "Resend rejected the sender or recipient. Verify RESEND_FROM_EMAIL and the verified Resend domain.";
        console.error("Admission email failed:", emailError.message);
      }
    }

    submission.status = status;
    await submission.save();
    await submission.populate("classApplying", "fullClassName");
    return success(
      res,
      { submission, emailSent, emailMessage },
      emailSent
        ? `Status updated to ${status}`
        : `Status updated to ${status}, but the email could not be sent`,
    );
  } catch (err) {
    return error(res, err.message);
  }
};

export const deleteAdmission = async (req, res) => {
  try {
    const submission = await Submission.findOneAndDelete({
      _id: req.params.id,
      type: "admission",
    });
    if (!submission) return error(res, "Application not found", 404);
    return success(res, null, "Application deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
