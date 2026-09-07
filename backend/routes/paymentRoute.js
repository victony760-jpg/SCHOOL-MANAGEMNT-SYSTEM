import express from "express";
import {
  initPayment,
  verifyPaymentCtrl,
} from "../controllers/paymentController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/initialize", protect, initPayment); // student or admin can pay
router.get("/verify/:reference", verifyPaymentCtrl); // public, paystack calls this

export default router;
