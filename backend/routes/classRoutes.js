import express from "express";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/", getClasses);

router.post("/", protect, restrictTo("admin"), createClass);

router
  .route("/:id")
  .get(protect, getClassById)
  .patch(protect, restrictTo("admin"), updateClass)
  .delete(protect, restrictTo("admin"), deleteClass);

export default router;
