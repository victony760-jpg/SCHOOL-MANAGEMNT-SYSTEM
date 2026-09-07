import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleCheck.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAnnouncements)
  .post(restrictTo("admin"), createAnnouncement);

router
  .route("/:id")
  .patch(restrictTo("admin"), updateAnnouncement)
  .delete(restrictTo("admin"), deleteAnnouncement);

export default router;
