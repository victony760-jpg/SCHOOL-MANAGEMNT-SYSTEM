import Invoice from "../models/Invoice.js";
import StudentProfile from "../models/StudentProfile.js";
import { initializePayment, verifyPayment } from "../services/paystack.js";
import crypto from "crypto";
import { success, error } from "../utils/response.js";

const generateInvoiceNumber = () =>
  `INV${Date.now()}${Math.floor(Math.random() * 1000)}`;

export const getInvoices = async (req, res) => {
  try {
    const { status, className, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;

    let studentQuery = {};
    if (className) studentQuery.classAssigned = className;

    const total = await Invoice.countDocuments(query);
    let invoices = await Invoice.find(query)
      .populate({
        path: "student",
        select: "fullName studentID classAssigned",
        populate: {
          path: "classAssigned",
          select: "name arm fullClassName section",
        },
        match: studentQuery,
      })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean()
      .sort({ createdAt: -1 });

    if (className) invoices = invoices.filter((i) => i.student);
    return success(res, {
      invoices,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return error(res, err.message);
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return error(res, "Invoice not found", 404);
    return success(res, null, "Invoice deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { studentId, description, amount, dueDate, academicSession } =
      req.body;
    const invoice = await Invoice.create({
      student: studentId,
      description,
      amount,
      dueDate,
      academicSession,
      invoiceNumber: generateInvoiceNumber(),
      createdBy: req.user.id,
      status: "Pending",
    });
    return success(res, invoice, "Invoice created", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const initiatePayment = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("student");
    if (!invoice) return error(res, "Invoice not found", 404);
    if (!invoice.student) return error(res, "Invoice student not found", 400);
    if (invoice.status === "Paid")
      return error(res, "Invoice already paid", 400);

    // Ownership Check: students can only pay their own
    if (
      req.user.role === "student" &&
      String(invoice.student._id) !== String(req.user.studentProfile)
    ) {
      return error(
        res,
        "Forbidden: You cannot pay another student's invoice",
        403,
      );
    }

    const parentEmail = invoice.student.parentEmail || req.user.email;
    if (!parentEmail)
      return error(res, "No email associated with this invoice", 400);

    const outstandingAmount = Math.max(
      Number(invoice.amount) - Number(invoice.amountPaid || 0),
      0,
    );
    if (outstandingAmount <= 0)
      return error(res, "Invoice has no outstanding balance", 400);

    // amount in kobo
    const payment = await initializePayment(
      parentEmail,
      outstandingAmount * 100,
      {
        invoiceId: invoice._id,
      },
    );

    invoice.paymentUrl = payment.authorization_url;
    invoice.paystackReference = payment.reference;
    await invoice.save();

    // CRITICAL: Return paymentUrl to match frontend
    return success(res, { paymentUrl: payment.authorization_url });
  } catch (err) {
    return error(res, err.message);
  }
};

export const verifyInvoice = async (req, res) => {
  try {
    const { reference } = req.params;
    const invoice = await Invoice.findOne({
      paystackReference: reference,
    }).populate("student");
    if (!invoice) return error(res, "Invoice not found", 404);

    // Ownership Check
    if (!invoice.student) return error(res, "Invoice student not found", 400);
    if (
      req.user.role === "student" &&
      String(invoice.student._id) !== String(req.user.studentProfile)
    ) {
      return error(res, "Forbidden", 403);
    }

    // Idempotency: don't double-update
    if (invoice.status === "Paid")
      return success(res, invoice, "Invoice already paid");

    const verification = await verifyPayment(reference);
    if (verification.status === "success") {
      const updated = await Invoice.findOneAndUpdate(
        { _id: invoice._id, status: { $ne: "Paid" } },
        {
          $set: {
            status: "Paid",
            amountPaid: invoice.amount,
            paidAt: verification.paid_at
              ? new Date(verification.paid_at)
              : new Date(),
          },
        },
        { new: true },
      );
      const paidInvoice = updated || invoice;
      await StudentProfile.findByIdAndUpdate(paidInvoice.student, {
        feeStatus: "Paid",
      });
      return success(res, paidInvoice, "Invoice marked as paid");
    }
    return error(res, "Payment not successful", 400);
  } catch (err) {
    return error(res, err.message);
  }
};

export const paystackWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body)
      .digest("hex");
    if (hash !== signature) return res.status(400).send("Invalid signature");

    const event = JSON.parse(req.body.toString());
    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const invoice = await Invoice.findOne({ paystackReference: reference });
      if (invoice && invoice.status !== "Paid") {
        const verification = await verifyPayment(reference);
        if (verification.status === "success") {
          const updated = await Invoice.findOneAndUpdate(
            { _id: invoice._id, status: { $ne: "Paid" } },
            {
              $set: {
                status: "Paid",
                amountPaid: invoice.amount,
                paidAt: verification.paid_at
                  ? new Date(verification.paid_at)
                  : new Date(),
              },
            },
            { new: true },
          );
          if (updated)
            await StudentProfile.findByIdAndUpdate(updated.student, {
              feeStatus: "Paid",
            });
        }
      }
    }
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Webhook error");
  }
};
export const getMyInvoices = async (req, res) => {
  try {
    if (!req.user.studentProfile)
      return error(res, "No student profile associated with this account", 400);
    const invoices = await Invoice.find({ student: req.user.studentProfile })
      .populate({
        path: "student",
        select: "fullName studentID classAssigned",
        populate: {
          path: "classAssigned",
          select: "name arm fullClassName section",
        },
      })
      .lean()
      .sort({ createdAt: -1 });
    return success(res, invoices);
  } catch (err) {
    return error(res, err.message);
  }
};
