import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      index: true,
    },
    className: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    term: { type: String, required: true, index: true },
    status: { type: String, enum: ["Present", "Absent"], required: true },
    remark: { type: String, default: "", trim: true },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });
export default mongoose.model("Attendance", attendanceSchema);
