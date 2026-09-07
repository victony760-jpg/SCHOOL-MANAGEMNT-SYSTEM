import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    name: { type: String, default: null }, // original filename
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
      default: null,
    },
    studentID: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      default: null,
    },
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    classAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    parentName: { type: String, required: true, trim: true },
    parentEmail: { type: String, required: true, lowercase: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },

    // PHOTO
    photoUrl: { type: String, default: null },
    storagePath: { type: String, default: null },

    // NEW: FILES
    medicalFiles: [fileSchema], // hospital results
    resultFiles: [fileSchema], // term results

    feeStatus: {
      type: String,
      enum: ["Paid", "Owing", "Pending"],
      default: "Pending",
    },
    admissionStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    applicationDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

studentProfileSchema.index(
  { fullName: 1, dateOfBirth: 1, classAssigned: 1 },
  { unique: true, sparse: true, name: "unique_student" },
);

// Auto remove __v on JSON
studentProfileSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("StudentProfile", studentProfileSchema);
