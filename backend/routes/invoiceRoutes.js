import express from "express";
import asyncHandler from "express-async-handler";
import {
  getInvoices,
  createInvoice,
  initiatePayment,
  getMyInvoices,
  verifyInvoice,
  paystackWebhook,
  deleteInvoice,
} from "../controllers/invoiceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  invoiceRules,
  idParamValidation,
  validate,
} from "../utils/validator.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many payment attempts. Try again in 15 minutes.",
  },
});

/*
  @route   POST /api/invoices/webhook
  @desc    Paystack webhook - must be raw body, no protect
  @access  Public
*/
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(paystackWebhook),
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  idParamValidation,
  validate,
  asyncHandler(deleteInvoice),
);

/*
  @route   GET /api/invoices
  @desc    Get all invoices - Admin only
  @access  Private/Admin
*/
router.get("/", protect, adminOnly, asyncHandler(getInvoices));

/*
  @route   POST /api/invoices
  @desc    Create new invoice - Admin only
  @access  Private/Admin
*/
router.post(
  "/",
  protect,
  adminOnly,
  invoiceRules,
  validate,
  asyncHandler(createInvoice),
);

/*
  @route   POST /api/invoices/:id/pay
  @desc    Initialize payment for invoice - Student/Admin
  @access  Private
*/
router.post(
  "/:id/pay",
  protect,
  paymentLimiter,
  idParamValidation,
  validate,
  asyncHandler(initiatePayment),
);

/*
  @route   GET /api/invoices/verify/:reference
  @desc    Verify payment with paystack reference
  @access  Private
*/
router.get("/verify/:reference", protect, asyncHandler(verifyInvoice));

/*
  @route   GET /api/invoices/me
  @desc    Get logged in student's invoices
  @access  Private/Student
*/
router.get("/me", protect, asyncHandler(getMyInvoices));

export default router;
