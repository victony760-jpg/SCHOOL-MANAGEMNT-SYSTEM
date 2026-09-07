import StudentProfile from "../models/StudentProfile.js";

export const generateStudentId = async (retries = 3) => {
  const year = new Date().getFullYear();
  const prefix = `VIC${year}`;

  for (let i = 0; i < retries; i++) {
    const lastStudent = await StudentProfile.findOne(
      { studentID: { $regex: `^${prefix}` } },
      {},
      { sort: { studentID: -1 } },
    );

    let nextNumber = 1;
    if (lastStudent) {
      const lastNum = parseInt(lastStudent.studentID.replace(prefix, ""));
      nextNumber = lastNum + 1;
    }

    const paddedNum = String(nextNumber).padStart(3, "0");
    const newId = `${prefix}${paddedNum}`;

    // Double check to avoid race condition
    const exists = await StudentProfile.findOne({ studentID: newId });
    if (!exists) return newId;
  }

  throw new Error("Failed to generate unique Student ID");
};
