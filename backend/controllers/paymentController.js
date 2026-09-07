import { initializePayment, verifyPayment } from "../utils/paystack.js";
import Payment from "../models/Payment.js";

export const initPayment = async (req, res) => {
  try {
    const { studentId, amount, email, feeType, term, session } = req.body;

    const reference = `SCH_${Date.now()}`;
    const metadata = { studentId, feeType, term, session };

    const paystackData = await initializePayment(email, amount, {
      ...metadata,
      reference,
    });

    // Save pending payment
    await Payment.create({
      student: studentId,
      reference,
      amount,
      feeType,
      term,
      session,
      status: "pending",
      metadata,
    });

    res.json({ success: true, data: paystackData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPaymentCtrl = async (req, res) => {
  try {
    const { reference } = req.params;
    const paystackData = await verifyPayment(reference);

    if (paystackData.status === "success") {
      await Payment.findOneAndUpdate(
        { reference },
        { status: "paid", paidAt: new Date(), metadata: paystackData.metadata },
        { new: true },
      );
    }

    res.json({ success: true, data: paystackData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
