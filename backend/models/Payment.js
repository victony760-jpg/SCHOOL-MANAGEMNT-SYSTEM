import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true }, // in naira
    feeType: { type: String, required: true },
    term: String,
    session: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paidAt: Date,
    metadata: Object,
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
