import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audience: {
      type: String,
      enum: ["all", "student", "admin"],
      default: "all",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Announcement", announcementSchema);
