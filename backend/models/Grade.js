import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      index: true,
    },
    subject: { type: String, required: true, index: true },
    className: { type: String, required: true, index: true },
    term: { type: String, required: true, index: true },
    session: { type: String, required: true, index: true },
    caScore: { type: Number, min: 0, max: 40, required: true },
    examScore: { type: Number, min: 0, max: 60, required: true },
    total: { type: Number, required: true },
    grade: { type: String, required: true },
    remark: { type: String, required: true },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

gradeSchema.index(
  { student: 1, subject: 1, term: 1, session: 1 },
  { unique: true },
);
export default mongoose.model("Grade", gradeSchema);
