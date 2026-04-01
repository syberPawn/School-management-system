const Enrollment = require("../../studentManagement/models/enrollments.model");
const Student = require("../../studentManagement/models/students.model");
const Section = require("../../academicStructure/models/section.model");
const AcademicYear = require("../../academicStructure/models/academicYear.model");

const ExamInstance = require("../models/examInstance.model");
const ExamSubjectScope = require("../models/examSubjectScope.model");
const ExamMark = require("../models/examMark.model");
const Subject = require("../../academicStructure/models/subject.model");

/*
  ==============================
  REPORT CARD DOMAIN ERRORS
  ==============================
*/

class EnrollmentNotFoundError extends Error {}
class ExamInstanceNotFoundError extends Error {}
class AcademicYearMismatchError extends Error {}

/*
  ==============================
  GENERATE REPORT CARD
  ==============================
*/

const generateReportCard = async ({ userId, examInstanceId }) => {
  /*
  STEP 1 — Resolve Student → Enrollment
*/

  // 1️⃣ Resolve student profile
  const student = await Student.findOne({ userId });

  if (!student) {
    throw new EnrollmentNotFoundError("Student profile not found");
  }

  // 2️⃣ Resolve exam instance
  const examInstance = await ExamInstance.findById(examInstanceId);

  if (!examInstance) {
    throw new ExamInstanceNotFoundError("Exam instance not found");
  }

  // 3️⃣ Resolve active enrollment for that academic year
  const enrollment = await Enrollment.findOne({
    studentId: student._id,
    academicYearId: examInstance.academicYearId,
    enrollmentStatus: "ACTIVE",
  });

  if (!enrollment) {
    throw new EnrollmentNotFoundError("Enrollment not found");
  }

  /*
    STEP 2 — Fetch Snapshot Subject Set
  */

  // Resolve section → grade
  const section = await Section.findById(enrollment.sectionId);

  if (!section) {
    throw new Error("Section not found for enrollment");
  }

  const snapshotSubjects = await ExamSubjectScope.find({
    examInstanceId,
    gradeId: section.gradeId,
  });

  const subjectCount = snapshotSubjects.length;

  /*
    STEP 3 — Fetch Marks
  */

  const marks = await ExamMark.find({
    enrollmentId: enrollment._id,
    examInstanceId,
  });

  /*
    STEP 4 — Compute Deterministic Totals
  */

  const totalMarks = marks.reduce((sum, entry) => sum + entry.marks, 0);

  const percentage =
    subjectCount === 0 ? 0 : (totalMarks / (subjectCount * 100)) * 100;

  /*
    STEP 5 — Resolve Related Details
  */

  const academicYear = await AcademicYear.findById(examInstance.academicYearId);
  const subjects = [];

  for (const entry of marks) {
    const subject = await Subject.findById(entry.subjectId);

    const subjectName = subject?.name || "Unknown";

    subjects.push({
      subjectName,
      marksObtained: entry.marks,
      maxMarks: 100,
    });
  }

  return {
    student,
    academicYear,
    section,
    examInstance,
    subjects,
    totalMarks,
    percentage,
  };
};

module.exports = {
  generateReportCard,

  EnrollmentNotFoundError,
  ExamInstanceNotFoundError,
  AcademicYearMismatchError,
};