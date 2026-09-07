import Attendance from "../models/Attendance.js";
import { success, error } from "../utils/response.js";

const normalizeClassName = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value;

export const getAttendance = async (req, res) => {
  try {
    const { className, date, page = 1, limit = 50 } = req.query;
    const query = {};
    if (className)
      query.className = new RegExp(
        `^${normalizeClassName(className).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      );

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const total = await Attendance.countDocuments(query);
    const attendance = await Attendance.find(query)
      .populate("student", "fullName studentID")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
      .sort({ date: -1 });

    return success(res, {
      attendance,
      total,
      page: +page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return error(res, err.message);
  }
};

export const bulkMarkAttendance = async (req, res) => {
  try {
    const { className, date, term, records } = req.body;
    const normalizedClassName = normalizeClassName(className);

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const ops = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, date: targetDate },
        update: {
          $set: {
            className: normalizedClassName,
            date: targetDate,
            term,
            status: r.status,
            remark: r.remark || "",
            recordedBy: req.user.id,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    return success(res, null, "Attendance saved");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    if (!req.user.studentProfile) {
      return error(res, "No student profile associated with this account", 400);
    }
    const { term, page = 1, limit = 50 } = req.query;
    const query = { student: req.user.studentProfile };
    if (term) query.term = term;

    const total = await Attendance.countDocuments(query);
    const attendance = await Attendance.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
      .sort({ date: -1 });

    return success(res, {
      attendance,
      total,
      page: +page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return error(res, err.message);
  }
};
