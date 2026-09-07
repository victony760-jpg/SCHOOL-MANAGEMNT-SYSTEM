import Submission from "../models/submission.js";
import { success, error } from "../utils/response.js";

export const submitVisit = async (req, res) => {
  try {
    const { fullName, email, phone, visitDate, purpose, message } = req.body;
    const submission = await Submission.create({
      type: "visit",
      fullName,
      email,
      phone,
      visitDate,
      purpose,
      message,
    });
    return success(res, submission, "Visit request submitted", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getVisits = async (req, res) => {
  try {
    const submissions = await Submission.find({ type: "visit" }).sort({
      createdAt: -1,
    });
    return success(res, submissions);
  } catch (err) {
    return error(res, err.message);
  }
};
