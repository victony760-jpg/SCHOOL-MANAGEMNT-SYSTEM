import express from "express";
import rateLimit from "express-rate-limit";
import {
  submitAdmission,
  getAdmissions,
  updateAdmissionStatus,
  deleteAdmission,
} from "../controllers/admissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleCheck.js";
import { admissionValidation, validate } from "../utils/validator.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router();

const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many submissions. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/",
  publicFormLimiter,
  uploadImage.fields([
    { name: "applicantPhoto", maxCount: 1 },
    { name: "documents", maxCount: 1 },
  ]),
  admissionValidation,
  validate,
  submitAdmission,
); // Public + Validation
router.get("/", protect, adminOnly, getAdmissions); // Admin
router.patch("/:id/status", protect, adminOnly, updateAdmissionStatus); // Admin
router.delete("/:id", protect, adminOnly, deleteAdmission);

export default router;
