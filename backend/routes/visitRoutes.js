import express from "express";
import rateLimit from "express-rate-limit";
import { submitVisit, getVisits } from "../controllers/visitController.js";
import { updateSubmissionStatus } from "../controllers/submissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleCheck.js";

const router = express.Router();
const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many requests" },
});

router.post("/", publicFormLimiter, submitVisit); // Public
router.get("/", protect, adminOnly, getVisits); // Admin
router.patch("/:id/status", protect, adminOnly, updateSubmissionStatus); // Admin
export default router;
