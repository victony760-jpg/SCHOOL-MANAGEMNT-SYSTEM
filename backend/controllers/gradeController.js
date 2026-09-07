import Grade from "../models/Grade.js";
import StudentProfile from "../models/StudentProfile.js";
import { calculateGrade } from "../services/gradeCalculator.js";
import { success, error } from "../utils/response.js";

const normalizeClassName = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value;

export const getGrades = async (req, res) => {
  try {
    const { className, subject, page = 1, limit = 50 } = req.query;
    const query = {};
    if (className)
      query.className = new RegExp(
        `^${normalizeClassName(className).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      );
    if (subject) query.subject = subject;

    const total = await Grade.countDocuments(query);
    const grades = await Grade.find(query)
      .populate("student", "fullName studentID")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return success(res, {
      grades,
      total,
      page: +page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return error(res, err.message);
  }
};

export const bulkAddGrades = async (req, res) => {
  try {
    const { className, subject, term, session, records } = req.body;
    const normalizedClassName = normalizeClassName(className);

    const ops = records.map((r) => {
      const { total, grade, remark } = calculateGrade(r.caScore, r.examScore);
      return {
        updateOne: {
          filter: { student: r.studentId, subject, term, session },
          update: {
            $set: {
              className: normalizedClassName,
              subject,
              term,
              session,
              caScore: r.caScore,
              examScore: r.examScore,
              total,
              grade,
              remark,
              enteredBy: req.user.id,
            },
          },
          upsert: true,
        },
      };
    });

    await Grade.bulkWrite(ops);
    return success(res, null, "Grades saved");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMyGrades = async (req, res) => {
  try {
    const grades = await Grade.find({
      student: req.user.studentProfile,
    }).lean();
    return success(res, grades);
  } catch (err) {
    return error(res, err.message);
  }
};

// UPDATED: Returns full report card with average + position
export const getMyReportCard = async (req, res) => {
  try {
    const { term, session } = req.query;
    const studentId = req.user.studentProfile;

    if (!term || !session) {
      return error(res, "Term and session are required", 400);
    }

    // 1. Get student info
    const student = await StudentProfile.findById(studentId).populate(
      "classAssigned",
      "fullClassName name",
    );
    if (!student) return error(res, "Student profile not found", 404);

    // 2. Get this student's grades for term
    const myGrades = await Grade.find({
      student: studentId,
      term,
      session,
    }).lean();

    if (myGrades.length === 0) {
      return success(res, null, "No grades found for this term");
    }

    // 3. Calculate average
    const totalScore = myGrades.reduce((sum, g) => sum + g.total, 0);
    const average = parseFloat((totalScore / myGrades.length).toFixed(1));

    // 4. Calculate position: compare with classmates in same class, term, session
    const className = normalizeClassName(
      student.classAssigned?.fullClassName || student.classAssigned?.name,
    );
    const classGrades = await Grade.aggregate([
      {
        $match: {
          className: new RegExp(
            `^${className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          ),
          term,
          session,
        },
      },
      { $group: { _id: "$student", avg: { $avg: "$total" } } },
      { $sort: { avg: -1 } },
    ]);

    const positionIndex = classGrades.findIndex(
      (g) => g._id.toString() === studentId.toString(),
    );
    const position =
      positionIndex >= 0
        ? `${positionIndex + 1} out of ${classGrades.length}`
        : "-";

    // 5. Format subjects
    const subjects = myGrades.map((g) => ({
      name: g.subject,
      ca: g.caScore,
      exam: g.examScore,
      total: g.total,
      grade: g.grade,
      remark: g.remark,
    }));

    // 6. Principal remark logic
    let principalRemark = "You can do better. More effort needed.";
    if (average >= 75) principalRemark = "Excellent performance. Keep it up!";
    else if (average >= 60)
      principalRemark = "Good work. Strive for excellence.";

    const reportData = {
      student: {
        fullName: student.fullName,
        studentID: student.studentID,
      },
      term: `${term} ${session}`,
      class: className,
      subjects,
      average,
      position,
      principalRemark,
    };

    return success(res, reportData);
  } catch (err) {
    return error(res, err.message);
  }
};
