import Submission from "../models/submission.js";
import { success, error } from "../utils/response.js";

export const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;
    const submission = await Submission.create({
      type: "contact",
      fullName,
      email,
      phone,
      message,
    });
    return success(res, submission, "Message sent successfully", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getContacts = async (req, res) => {
  try {
    const submissions = await Submission.find({ type: "contact" }).sort({
      createdAt: -1,
    });
    return success(res, submissions);
  } catch (err) {
    return error(res, err.message);
  }
};
