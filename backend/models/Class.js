import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g., "JSS 1", "SSS 1"
    arm: { type: String, default: "A", uppercase: true, trim: true },
    section: {
      type: String,
      enum: ["Junior", "Senior", "Primary"],
      trim: true,
    },
    subjects: [{ type: String, trim: true }],
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    academicSession: { type: String, default: "2025/2026", trim: true },
    tuitionFee: { type: Number, default: 0, min: 0 },
    admissionFee: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

classSchema.virtual("fullClassName").get(function () {
  return `${this.name} ${this.arm}`.replace(/\s+/g, " ").trim();
});

classSchema.index({ name: 1, arm: 1, academicSession: 1 }, { unique: true });

export default mongoose.model("Class", classSchema);
