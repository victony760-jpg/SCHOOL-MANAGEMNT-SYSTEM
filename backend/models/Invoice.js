import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true }, // in naira
    dueDate: { type: Date, required: true },
    academicSession: { type: String, required: true }, // ADDED FOR FRONTEND
    amountPaid: { type: Number, default: 0 }, // ADDED FOR FRONTEND
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },
    paystackReference: { type: String },
    paymentUrl: { type: String },
    paidAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Invoice", invoiceSchema);
