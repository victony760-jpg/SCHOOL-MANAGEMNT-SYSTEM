export const calculateGrade = (caScore, examScore) => {
  const total = caScore + examScore;
  let grade = "F";
  let remark = "Fail";

  if (total >= 70) {
    grade = "A";
    remark = "Excellent";
  } else if (total >= 60) {
    grade = "B";
    remark = "Very Good";
  } else if (total >= 50) {
    grade = "C";
    remark = "Good";
  } else if (total >= 45) {
    grade = "D";
    remark = "Pass";
  } else if (total >= 40) {
    grade = "E";
    remark = "Poor";
  }

  return { total, grade, remark };
};
