const Enrollment = require("../models/enrollment.model");
const Student = require("../models/student.model");

const AcademicYear = require("../../academicStructure/models/academicYear.model");
const Section = require("../../academicStructure/models/section.model");

/*
  =====================================
  Enrollment Domain Errors
  =====================================
*/

class EnrollmentNotFoundError extends Error {}
class DuplicateEnrollmentError extends Error {}
class AcademicYearNotFoundError extends Error {}
class SectionNotFoundError extends Error {}
class StudentNotFoundError extends Error {}
class AcademicYearInactiveError extends Error {}
class SectionYearMismatchError extends Error {}
class OverlappingActiveEnrollmentError extends Error {}
class EnrollmentStatusRestrictionError extends Error {}
class AccessDeniedError extends Error {}
class FeatureNotImplementedError extends Error {}
/*
  =====================================
  StudentEnrollmentService
  =====================================
*/

/*
  FR-SM-04
  Create Enrollment
*/
const Grade = require("../../academicStructure/models/grade.model");

/*
  FR-SM-04
  Create Enrollment
*/
const createEnrollment = async (data) => {
  const { studentId, academicYearId, sectionId } = data;

  // 1️⃣ Validate student exists
  const student = await Student.findById(studentId);
  if (!student) {
    throw new StudentNotFoundError("Student not found");
  }

  // 2️⃣ Validate academic year exists
  const academicYear = await AcademicYear.findById(academicYearId);
  if (!academicYear) {
    throw new AcademicYearNotFoundError("Academic year not found");
  }

  // 3️⃣ Academic year must be ACTIVE and within date range (DS-SM-07)
  const now = new Date();

  const isWithinDateRange =
    now >= academicYear.startDate && now <= academicYear.endDate;

  if (academicYear.status !== "ACTIVE" || !isWithinDateRange) {
    throw new AcademicYearInactiveError(
      "Enrollment allowed only for active academic year within valid date range",
    );
  }

  // 4️⃣ Validate section exists
  const section = await Section.findById(sectionId);
  if (!section) {
    throw new SectionNotFoundError("Section not found");
  }

  // 5️⃣ Validate grade exists
  const grade = await Grade.findById(section.gradeId);
  if (!grade) {
    throw new SectionYearMismatchError("Section is linked to invalid grade");
  }

  // 6️⃣ Grade must belong to provided academic year
  if (grade.academicYearId.toString() !== academicYearId) {
    throw new SectionYearMismatchError(
      "Section does not belong to provided academic year",
    );
  }

  // 7️⃣ Enforce Single ACTIVE Enrollment Constraint (BR-SM-12)

  const activeEnrollments = await Enrollment.find({
    studentId,
    enrollmentStatus: "ACTIVE",
  });

  for (const existingEnrollment of activeEnrollments) {
    const existingYear = await AcademicYear.findById(
      existingEnrollment.academicYearId,
    );

    if (!existingYear) continue;

    const overlap =
      academicYear.startDate <= existingYear.endDate &&
      existingYear.startDate <= academicYear.endDate;

    if (overlap) {
      throw new OverlappingActiveEnrollmentError(
        "Student already has ACTIVE enrollment in overlapping academic year",
      );
    }
  }
  try {
    const enrollment = await Enrollment.create({
      studentId,
      academicYearId,
      sectionId,
      enrollmentStatus: "ACTIVE",
    });

    return enrollment;
  } catch (error) {
    if (error.code === 11000) {
      throw new DuplicateEnrollmentError(
        "Student already enrolled in this academic year",
      );
    }

    throw error;
  }
};
/*
  FR-SM-05
  Update Enrollment Class
*/
const updateEnrollmentClass = async (enrollmentId, newSectionId) => {
  // 1️⃣ Validate enrollment exists
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new EnrollmentNotFoundError("Enrollment not found");
  }

  // 2️⃣ Enrollment status must be ACTIVE (BR-SM-17)
  if (enrollment.enrollmentStatus !== "ACTIVE") {
    throw new EnrollmentStatusRestrictionError(
      "Class reassignment allowed only when enrollment status is ACTIVE",
    );
  }

  // 3️⃣ Validate new section exists
  const section = await Section.findById(newSectionId);
  if (!section) {
    throw new SectionNotFoundError("Section not found");
  }

  // 4️⃣ Validate grade exists
  const grade = await Grade.findById(section.gradeId);
  if (!grade) {
    throw new SectionYearMismatchError("Section is linked to invalid grade");
  }

  // 5️⃣ Section must belong to same academic year
  if (
    grade.academicYearId.toString() !== enrollment.academicYearId.toString()
  ) {
    throw new SectionYearMismatchError(
      "Section does not belong to enrollment academic year",
    );
  }

  // 6️⃣ Update section only
  enrollment.sectionId = newSectionId;

  await enrollment.save();

  return enrollment;
};

/*
  FR-SM-08
  Update Enrollment Status
*/
const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
  // 1️⃣ Validate enrollment exists
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new EnrollmentNotFoundError("Enrollment not found");
  }

  // 2️⃣ If same status → return unchanged (idempotent)
  if (enrollment.enrollmentStatus === newStatus) {
    return enrollment;
  }

  // 3️⃣ Validate academic year exists
  const academicYear = await AcademicYear.findById(enrollment.academicYearId);

  if (!academicYear) {
    throw new AcademicYearNotFoundError("Academic year not found");
  }

  // 4️⃣ Academic year must be ACTIVE and within date range (BR-SM-18)
  const now = new Date();

  const isWithinDateRange =
    now >= academicYear.startDate && now <= academicYear.endDate;

  if (academicYear.status !== "ACTIVE" || !isWithinDateRange) {
    throw new AcademicYearInactiveError(
      "Enrollment status modification allowed only during active academic year",
    );
  }

  const currentStatus = enrollment.enrollmentStatus;

  /*
    5️⃣ Validate Transition Matrix (BR-SM-11)
  */

  const allowedTransitions = {
    ACTIVE: ["PROMOTED", "REPEATING", "WITHDRAWN", "COMPLETED"],
    REPEATING: ["PROMOTED", "WITHDRAWN"],
    PROMOTED: [],
    COMPLETED: [],
    WITHDRAWN: [],
  };

  const allowedNextStatuses = allowedTransitions[currentStatus] || [];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new EnrollmentStatusRestrictionError(
      `Invalid status transition from ${currentStatus} to ${newStatus}`,
    );
  }

  /*
    6️⃣ If newStatus == ACTIVE → enforce BR-SM-12 overlap check
  */

  if (newStatus === "ACTIVE") {
    const activeEnrollments = await Enrollment.find({
      studentId: enrollment.studentId,
      enrollmentStatus: "ACTIVE",
      _id: { $ne: enrollment._id },
    });

    for (const existingEnrollment of activeEnrollments) {
      const existingYear = await AcademicYear.findById(
        existingEnrollment.academicYearId,
      );

      if (!existingYear) continue;

      const overlap =
        academicYear.startDate <= existingYear.endDate &&
        existingYear.startDate <= academicYear.endDate;

      if (overlap) {
        throw new OverlappingActiveEnrollmentError(
          "Student already has ACTIVE enrollment in overlapping academic year",
        );
      }
    }
  }

  // 7️⃣ Update status
  enrollment.enrollmentStatus = newStatus;

  await enrollment.save();

  return enrollment;
};

/*
  FR-SM-06
  List Students (ADMIN only for now)
*/
const listStudents = async (filters, requester) => {
  const { academicYearId, sectionId, name, admissionNumber } = filters;

  // 1️⃣ Role enforcement (DS-SM-08 - temporary safe implementation)

  if (requester.role === "STUDENT") {
    throw new AccessDeniedError(
      "Students are not allowed to list other students",
    );
  }

  if (requester.role === "TEACHER") {
    throw new FeatureNotImplementedError(
      "Teacher access enforcement pending Teacher Management module",
    );
  }

  // ADMIN allowed without restriction

  // 2️⃣ Academic year must exist
  const academicYear = await AcademicYear.findById(academicYearId);

  if (!academicYear) {
    throw new AcademicYearNotFoundError("Academic year not found");
  }

  // 3️⃣ Build enrollment query
  const enrollmentQuery = { academicYearId };

  if (sectionId) {
    enrollmentQuery.sectionId = sectionId;
  }

  const enrollments = await Enrollment.find(enrollmentQuery);

  if (!enrollments.length) {
    return [];
  }

  // 4️⃣ Extract studentIds
  const studentIds = enrollments.map((enrollment) => enrollment.studentId);

  // 5️⃣ Build student query
  const studentQuery = { _id: { $in: studentIds } };

  if (name) {
    studentQuery.fullName = { $regex: name, $options: "i" };
  }

  if (admissionNumber) {
    studentQuery.admissionNumber = admissionNumber;
  }

  const students = await Student.find(studentQuery);

  // 6️⃣ Map results
  const results = enrollments
    .map((enrollment) => {
      const student = students.find(
        (s) => s._id.toString() === enrollment.studentId.toString(),
      );

      if (!student) return null;

      return {
        studentId: student._id,
        fullName: student.fullName,
        admissionNumber: student.admissionNumber,
        sectionId: enrollment.sectionId,
        enrollmentStatus: enrollment.enrollmentStatus,
        identityStatus: student.identityStatus,
      };
    })
    .filter(Boolean);

  return results;
};


module.exports = {
  createEnrollment,
  updateEnrollmentClass,
  updateEnrollmentStatus,
  listStudents,

  AccessDeniedError,
  FeatureNotImplementedError,
  EnrollmentNotFoundError,
  DuplicateEnrollmentError,
  AcademicYearNotFoundError,
  SectionNotFoundError,
  StudentNotFoundError,
  AcademicYearInactiveError,
  SectionYearMismatchError,
  OverlappingActiveEnrollmentError,
  EnrollmentStatusRestrictionError,
};
