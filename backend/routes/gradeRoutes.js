import express from "express";
import {
  getGrades,
  bulkAddGrades,
  getMyGrades,
  getMyReportCard,
} from "../controllers/gradeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleCheck.js";

const router = express.Router();
router.get("/", protect, adminOnly, getGrades);
router.post("/bulk", protect, adminOnly, bulkAddGrades);
router.get("/me", protect, getMyGrades);
router.get("/me/report-card", protect, getMyReportCard);
export default router;
