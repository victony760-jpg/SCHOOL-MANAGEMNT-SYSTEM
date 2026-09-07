import jwt from "jsonwebtoken";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact admin",
      });
    }

    req.user = user;

    // CRITICAL: Block pending students
    if (user.role === "student") {
      const profile = await StudentProfile.findOne({ user: user._id });
      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: "Student profile not found" });
      }
      if (profile.admissionStatus !== "approved") {
        return res.status(403).json({
          success: false,
          message: "Admission not yet approved. Contact school admin",
        });
      }
      req.user.studentProfile = profile._id; // attach for controllers
    }

    return next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token expired"
          : "Not authorized, token failed",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};
