import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Invoice from "../models/Invoice.js";
import Attendance from "../models/Attendance.js";
import Submission from "../models/submission.js";
import { success, error } from "../utils/response.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const totalStaff = await User.countDocuments({ role: { $ne: "student" } });
    const newSubmissions = await Submission.countDocuments({ status: "New" });

    const pendingInvoices = await Invoice.countDocuments({ status: "Pending" });
    const paidInvoices = await Invoice.countDocuments({ status: "Paid" });

    const revenueStats = await Invoice.aggregate([
      { $group: { _id: "$status", totalAmount: { $sum: "$amount" } } },
    ]);
    const revenueMap = revenueStats.reduce((acc, item) => {
      acc[item._id] = item.totalAmount;
      return acc;
    }, {});

    // Calculate attendance rate
    const totalRecords = await Attendance.countDocuments();
    const presentRecords = await Attendance.countDocuments({
      status: "Present",
    });
    const attendanceRate =
      totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(1) : 0;

    return success(res, {
      totalStudents,
      totalStaff,
      pendingInvoices,
      paidInvoices,
      revenueThisMonth: revenueMap["Paid"] || 0, // FIXED KEY
      pendingFees: revenueMap["Pending"] || 0, // FIXED KEY
      attendanceRate: Number(attendanceRate), // NEW
      newSubmissions,
    });
  } catch (err) {
    return error(res, err.message);
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    // TODO: Later merge Invoice, Student, Grade logs here
    const activities = [];
    return success(res, activities);
  } catch (err) {
    return error(res, err.message);
  }
};
