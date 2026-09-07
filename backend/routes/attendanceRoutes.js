import express from "express";
import {
  getAttendance,
  bulkMarkAttendance,
  getMyAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleCheck.js";
import { bulkAttendanceRules, validate } from "../utils/validator.js";

const router = express.Router();
router.get("/", protect, adminOnly, getAttendance);
router.post(
  "/bulk",
  protect,
  adminOnly,
  bulkAttendanceRules,
  validate,
  bulkMarkAttendance,
);
router.get("/me", protect, getMyAttendance);
export default router;
