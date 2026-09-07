import express from "express";
import {
  getDashboardStats,
  getRecentActivity,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleCheck.js";

const router = express.Router();
router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/recent-activity", protect, adminOnly, getRecentActivity);
export default router;
