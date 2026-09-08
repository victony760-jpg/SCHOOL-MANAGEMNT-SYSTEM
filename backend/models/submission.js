import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["admission", "contact", "visit"],
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    phone: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: [
        "New",
        "Read",
        "Contacted",
        "Closed",
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "New",
    },

    // Admission specific
    studentName: { type: String },
    classApplying: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    parentName: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    previousSchool: { type: String },
    applicantPhoto: { type: String },
    applicantPhotoPath: { type: String },
    documents: { type: String },
    documentsPath: { type: String },

    // Visit specific
    visitDate: { type: Date },
    purpose: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Submission", submissionSchema);
