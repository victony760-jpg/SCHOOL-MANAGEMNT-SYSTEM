import { body, param, validationResult } from "express-validator";
import { error } from "./response.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 400);
  }
  next();
};

export const admissionValidation = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("classApplying").notEmpty().withMessage("Class applying is required"),
];

export const contactValidation = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("message").notEmpty().withMessage("Message is required"),
];

export const bulkAttendanceRules = [
  body("className").notEmpty().withMessage("Class name is required"),
  body("date").isISO8601().withMessage("Valid attendance date required"),
  body("term").notEmpty().withMessage("Term is required"),
  body("records")
    .isArray({ min: 1 })
    .withMessage("At least one attendance record is required"),
  body("records.*.studentId")
    .notEmpty()
    .withMessage("Student ID is required for each record"),
  body("records.*.status")
    .isIn(["Present", "Absent", "Late", "Excused"])
    .withMessage("Invalid attendance status"),
];

export const invoiceRules = [
  body("studentId").isMongoId().withMessage("Valid student ID required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than zero"),
  body("dueDate").isISO8601().withMessage("Valid due date required"),
  body("academicSession")
    .notEmpty()
    .withMessage("Academic session is required"),
];

export const idParamValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];
