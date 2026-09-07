import express from "express";
import asyncHandler from "express-async-handler";
import {
  createStudent,
  getStudents,
  getMyProfile,
  getStudentById,
  approveStudent,
  rejectStudent, // NEW
  toggleStudentActive, // NEW
  updateStudent,
  deleteStudent,
  updateMyPhoto,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleCheck.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router();
router.use(protect);

router.get("/me", restrictTo("student", "admin"), asyncHandler(getMyProfile));
router.patch(
  "/me/photo",
  restrictTo("student"),
  uploadImage.single("photo"),
  asyncHandler(updateMyPhoto),
);

router
  .route("/")
  .get(restrictTo("admin"), asyncHandler(getStudents))
  .post(
    restrictTo("admin"),
    uploadImage.single("photo"),
    asyncHandler(createStudent),
  );

router
  .route("/:id")
  .get(restrictTo("admin"), asyncHandler(getStudentById))
  .patch(
    restrictTo("admin"),
    uploadImage.single("photo"),
    asyncHandler(updateStudent),
  )
  .delete(restrictTo("admin"), asyncHandler(deleteStudent));

router.patch("/:id/approve", restrictTo("admin"), asyncHandler(approveStudent));
router.patch("/:id/reject", restrictTo("admin"), asyncHandler(rejectStudent)); // NEW
router.patch(
  "/:id/toggle-active",
  restrictTo("admin"),
  asyncHandler(toggleStudentActive),
); // NEW

export default router;
