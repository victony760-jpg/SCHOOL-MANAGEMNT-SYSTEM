import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import StudentProfile from "./models/StudentProfile.js";
import Class from "./models/Class.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log("🧹 Clearing data...");
    await User.deleteMany();
    await StudentProfile.deleteMany();
    await Class.deleteMany();

    console.log("🌱 Seeding...");

    // 1. Create Class first
    const sss1Science = await Class.create({
      name: "SSS 1",
      arm: "Science",
      section: "Senior",
      subjects: ["Mathematics", "English", "Physics", "Chemistry", "Biology"],
      academicSession: "2025/2026",
    });

    // 2. Admin - no studentID
    const admin = await User.create({
      name: "Admin User",
      email: "admin@victony.edu.ng",
      password: "password123",
      role: "admin",
    });

    // 3. Student 1
    const studentUser1 = await User.create({
      name: "Chidi Okoro",
      email: "chidi@victony.edu.ng",
      studentID: "VIC2025001", // <-- login with this
      password: "password123",
      role: "student",
    });

    const profile1 = await StudentProfile.create({
      user: studentUser1._id,
      fullName: "Chidi Okoro",
      classAssigned: sss1Science._id,
      parentName: "Mr Okoro",
      parentEmail: "okoro@email.com",
      parentPhone: "08012345678",
    });

    studentUser1.studentProfile = profile1._id;
    await studentUser1.save();

    console.log("✅ Seeded Successfully!");
    console.log("Admin Login: admin@victony.edu.ng / password123");
    console.log("Student Login: VIC2025001 / password123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
