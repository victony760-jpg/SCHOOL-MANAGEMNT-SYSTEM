import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const normalizeIdentifier = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

// @desc Login with email or studentID
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const identifier = normalizeIdentifier(
      req.body.identifier ?? req.body.login,
    );
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Please provide your email/student ID and password",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { studentID: identifier.toUpperCase() },
      ],
    })
      .select("+password")
      .populate("studentProfile");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    if (user.role === "student" && !user.studentProfile) {
      const profile = await StudentProfile.findOne({ user: user._id });
      if (!profile) {
        return res.status(403).json({
          message: "Student profile not found. Contact an administrator.",
        });
      }

      user.studentProfile = profile._id;
      await user.save();
      user.studentProfile = profile;
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentID: user.studentID,
        role: user.role,
        studentProfile: user.studentProfile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

// @desc Get current user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).populate(
      "studentProfile",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentID: user.studentID,
      studentProfile: user.studentProfile,
      isActive: user.isActive,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
