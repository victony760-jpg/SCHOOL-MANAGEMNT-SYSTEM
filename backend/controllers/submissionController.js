import Submission from "../models/submission.js";
import { success, error } from "../utils/response.js";

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New", "Read", "Contacted", "Closed"].includes(status)) {
      return error(
        res,
        "Invalid status. Must be: New, Read, Contacted, Closed",
        400,
      );
    }

    const submission = await Submission.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!submission) return error(res, "Submission not found", 404);
    return success(res, submission, "Status updated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
