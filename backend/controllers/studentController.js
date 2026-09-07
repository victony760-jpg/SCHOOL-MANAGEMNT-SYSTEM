import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Class from "../models/Class.js";
import { generateStudentId } from "../services/studentIdGenerator.js";
import {
  uploadToSupabase,
  deleteFile,
  extractPathFromUrl,
} from "../middleware/upload.js";
import sendEmail from "../utils/sendEmail.js";
import { success } from "../utils/response.js"; // <- standardized response

// Helper for pagination + search
const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  return { page, limit, skip, search };
};

export const createStudent = async (req, res, next) => {
  let createdUser = null;
  let uploadedFilePath = null;
  try {
    const {
      fullName,
      dob,
      gender,
      classAssigned,
      parentName,
      parentEmail,
      parentPhone,
      feeStatus,
    } = req.body;

    if (
      !fullName ||
      !dob ||
      !parentName ||
      !parentEmail ||
      !parentPhone ||
      !classAssigned
    ) {
      const err = new Error(
        "fullName, dob, parentName, parentEmail, parentPhone, classAssigned are required",
      );
      err.statusCode = 400;
      throw err;
    }

    const classData = await Class.findById(classAssigned);
    if (!classData) {
      const err = new Error("Invalid class ID");
      err.statusCode = 400;
      throw err;
    }

    const normalizedName = fullName.trim();
    const normalizedDob = new Date(dob);
    if (isNaN(normalizedDob.getTime())) {
      const err = new Error("Invalid dob format. Use YYYY-MM-DD");
      err.statusCode = 400;
      throw err;
    }

    const existingStudent = await StudentProfile.findOne({
      fullName: normalizedName,
      dateOfBirth: normalizedDob,
      classAssigned: classData._id,
    });
    if (existingStudent) {
      const err = new Error(
        "A student with the same full name, date of birth, and class already exists.",
      );
      err.statusCode = 409;
      throw err;
    }

    const studentID = await generateStudentId();

    const studentUserEmail = `${studentID.toLowerCase()}@school.internal`;
    const defaultPassword = "default1234";

    createdUser = await User.create({
      name: normalizedName,
      email: studentUserEmail,
      password: defaultPassword,
      role: "student",
      studentID: studentID,
      isActive: true,
    });

    let photoUpload = null;
    if (req.file) {
      photoUpload = await uploadToSupabase(req.file, "school-students/photos");
      uploadedFilePath = photoUpload.path; // for rollback
    }

    const newProfile = await StudentProfile.create({
      user: createdUser._id,
      studentID: studentID,
      fullName: normalizedName,
      dateOfBirth: normalizedDob,
      gender,
      classAssigned: classData._id,
      parentName,
      parentEmail,
      parentPhone,
      photoUrl: photoUpload?.url || null,
      storagePath: photoUpload?.path || null,
      feeStatus: feeStatus || "Pending",
      admissionStatus: "pending",
    });

    createdUser.studentProfile = newProfile._id;
    await createdUser.save();

    return success(
      res,
      newProfile,
      "Student application submitted successfully. Awaiting admin approval.",
      201,
    );
  } catch (error) {
    // Rollback: delete uploaded file and user if something failed
    if (uploadedFilePath) await deleteFile(uploadedFilePath);
    if (createdUser) await User.findByIdAndDelete(createdUser._id);
    throw error;
  }
};

export const getStudents = async (req, res, next) => {
  const { page, limit, skip, search } = getPagination(req);

  const query = search ? { fullName: { $regex: search, $options: "i" } } : {};
  if (req.query.classId && mongoose.isValidObjectId(req.query.classId)) {
    query.classAssigned = req.query.classId;
  } else if (req.query.className) {
    const requestedClass = String(req.query.className).trim();
    let classId = null;

    if (mongoose.isValidObjectId(requestedClass)) {
      classId = requestedClass;
    } else {
      const classParts = requestedClass.replace(/\s+/g, " ").split(" ");
      const arm = classParts.pop()?.toUpperCase();
      const name = classParts.join(" ");
      const classRecord = await Class.findOne({
        name: new RegExp(
          `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i",
        ),
        arm,
      }).select("_id");
      classId = classRecord?._id || null;
    }

    query.classAssigned = classId || null;
  }
  if (req.query.admissionStatus)
    query.admissionStatus = req.query.admissionStatus;
  if (req.query.isActive !== undefined && req.query.isActive !== "") {
    query.user = {
      $in: await User.find({
        isActive: req.query.isActive === "true",
      }).distinct("_id"),
    };
  }

  const students = await StudentProfile.find(query)
    .populate("user", "name email studentID isActive")
    .populate("classAssigned", "name arm fullClassName section")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await StudentProfile.countDocuments(query);

  return success(res, {
    students,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
};

export const getMyProfile = async (req, res, next) => {
  const profile = await StudentProfile.findOne({ user: req.user.id })
    .populate("user", "name email studentID")
    .populate("classAssigned", "name arm fullClassName section subjects");
  if (!profile) {
    const err = new Error("Student profile not found.");
    err.statusCode = 404;
    throw err;
  }
  return success(res, profile);
};

export const getStudentById = async (req, res, next) => {
  const profile = await StudentProfile.findById(req.params.id)
    .populate("user", "name email studentID")
    .populate("classAssigned", "name arm fullClassName section subjects");
  if (!profile) {
    const err = new Error("Student not found.");
    err.statusCode = 404;
    throw err;
  }
  return success(res, profile);
};

export const approveStudent = async (req, res) => {
  const student = await StudentProfile.findById(req.params.id)
    .populate("user")
    .populate("classAssigned");

  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }

  if (student.admissionStatus === "approved") {
    const err = new Error("Student already approved");
    err.statusCode = 400;
    throw err;
  }

  if (!student.user) {
    const err = new Error("Student login account not found");
    err.statusCode = 400;
    throw err;
  }

  const tempPassword = crypto.randomBytes(4).toString("hex");
  const user = await User.findById(student.user._id).select("+password");
  if (!user) {
    const err = new Error("Student login account not found");
    err.statusCode = 400;
    throw err;
  }

  const previousPassword = user.password;
  try {
    user.password = tempPassword;
    await user.save();

    await sendEmail({
      to: student.parentEmail,
      subject: `Admission Approved - ${student.studentID} - Victony School`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Congratulations ${student.parentName}!</h2>
          <p>Admission for <b>${student.fullName}</b> into <b>${student.classAssigned?.fullClassName || "the school"}</b> has been approved.</p>
          <hr />
          <p><b>Student ID:</b> ${student.studentID}</p>
          <p><b>Login Email:</b> ${user.email}</p>
          <p><b>Temporary Password:</b> ${tempPassword}</p>
          <hr />
          <p>Please login and change your password immediately.</p>
          <a href="http://localhost:5173/login" style="background:blue;color:white;padding:10px 20px;text-decoration:none;">Login Here</a>
        </div>
      `,
    });

    student.admissionStatus = "approved";
    await student.save();
  } catch (err) {
    await User.updateOne(
      { _id: user._id },
      { $set: { password: previousPassword } },
    );
    throw err;
  }

  return success(
    res,
    null,
    "Student approved and login details sent to parent email",
  );
};

export const updateStudent = async (req, res, next) => {
  const updateData = { ...req.body };
  const existingProfile = await StudentProfile.findById(req.params.id);
  if (!existingProfile) {
    const err = new Error("Student not found.");
    err.statusCode = 404;
    throw err;
  }

  if (req.file) {
    const newPhoto = await uploadToSupabase(req.file, "school-students/photos");
    // Delete old photo
    const oldPath =
      existingProfile.storagePath ||
      extractPathFromUrl(existingProfile.photoUrl);
    if (oldPath) await deleteFile(oldPath);

    updateData.photoUrl = newPhoto.url;
    updateData.storagePath = newPhoto.path;
  }

  const updatedProfile = await StudentProfile.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
  return success(res, updatedProfile, "Student updated successfully");
};

export const updateMyPhoto = async (req, res, next) => {
  if (!req.file) {
    const err = new Error("Photo file is required");
    err.statusCode = 400;
    throw err;
  }
  const student = await StudentProfile.findOne({ user: req.user._id });
  if (!student) {
    const err = new Error("Student profile not found.");
    err.statusCode = 404;
    throw err;
  }

  const photoUpload = await uploadToSupabase(
    req.file,
    "school-students/photos",
  );
  const oldPath = student.storagePath || extractPathFromUrl(student.photoUrl);
  if (oldPath) await deleteFile(oldPath);

  student.photoUrl = photoUpload.url;
  student.storagePath = photoUpload.path;
  await student.save();

  return success(res, { photoUrl: photoUpload.url }, "Photo updated");
};

export const rejectStudent = async (req, res) => {
  const student = await StudentProfile.findById(req.params.id);
  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }

  student.admissionStatus = "rejected";
  await student.save();
  return success(res, null, "Student application rejected");
};

export const toggleStudentActive = async (req, res) => {
  const student = await StudentProfile.findById(req.params.id).select("user");
  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }

  const user = await User.findById(student.user);
  if (!user) {
    const err = new Error("Student login account not found");
    err.statusCode = 404;
    throw err;
  }

  user.isActive = !user.isActive;
  await user.save();
  return success(
    res,
    { isActive: user.isActive },
    `Student account ${user.isActive ? "activated" : "deactivated"}`,
  );
};

export const deleteStudent = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      const err = new Error("Student profile not found.");
      err.statusCode = 404;
      throw err;
    }

    const filePath =
      profile.storagePath || extractPathFromUrl(profile.photoUrl);
    if (filePath) await deleteFile(filePath);

    if (profile.user) {
      await User.findByIdAndDelete(profile.user, { session });
    }
    await StudentProfile.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    return success(res, null, "Student and files deleted successfully.");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
