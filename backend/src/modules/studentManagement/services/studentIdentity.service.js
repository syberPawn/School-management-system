const Student = require("../models/student.model");
const Enrollment = require("../models/enrollment.model");

/*
  =====================================
  Student Identity Domain Errors
  =====================================
*/

class StudentNotFoundError extends Error {}
class DuplicateAdmissionNumberError extends Error {}
class UnauthorizedProfileAccessError extends Error {}

/*
  =====================================
  StudentIdentityService
  =====================================
*/

/*
  FR-SM-01
  Create Student Identity
*/
const createStudentIdentity = async (data) => {
  const { userId, fullName, dateOfBirth, gender, admissionNumber } = data;

  // 1️⃣ Required validation
  if (!userId || !fullName || !dateOfBirth || !gender || !admissionNumber) {
    throw new Error("Missing required student identity fields");
  }

  try {
    // 2️⃣ Create student (identityStatus defaults to ACTIVE)
    const student = await Student.create({
      userId,
      fullName,
      dateOfBirth,
      gender,
      admissionNumber,
      identityStatus: "ACTIVE",
    });

    return student;
  } catch (error) {
    // 3️⃣ Handle duplicate admission number (BR-SM-02)
    if (error.code === 11000) {
      throw new DuplicateAdmissionNumberError(
        "Admission number must be unique",
      );
    }

    throw error;
  }
};

/*
  FR-SM-02
  Update Student Identity
*/
const updateStudentIdentity = async (studentId, data) => {
  // 1️⃣ Validate student exists
  const student = await Student.findById(studentId);

  if (!student) {
    throw new StudentNotFoundError("Student not found");
  }

  // 2️⃣ Update allowed fields only (validation layer restricts payload)
  if (data.fullName !== undefined) {
    student.fullName = data.fullName;
  }

  if (data.gender !== undefined) {
    student.gender = data.gender;
  }

  await student.save();

  return student;
};

/*
  FR-SM-03
  Deactivate Student Identity (Soft)
*/
const deactivateStudentIdentity = async (studentId) => {
  // 1️⃣ Validate student exists
  const student = await Student.findById(studentId);

  if (!student) {
    throw new StudentNotFoundError("Student not found");
  }

  // 2️⃣ If already INACTIVE → return silently
  if (student.identityStatus === "INACTIVE") {
    return student;
  }

  // 3️⃣ Soft deactivate only (BR-SM-14)
  student.identityStatus = "INACTIVE";

  await student.save();

  return student;
};

/*
  FR-SM-07
  Get Student Profile
  NOTE:
  Access enforcement will later require enrollment lookup.
  For now, identity retrieval only.
*/
/*
  FR-SM-07
  Get Student Profile
*/
const getStudentProfile = async (requester, studentId) => {
  // 1️⃣ Validate student exists
  const student = await Student.findById(studentId);

  if (!student) {
    throw new StudentNotFoundError("Student not found");
  }

  // 2️⃣ Role-based access enforcement (DS-SM-08)

  if (requester.role === "STUDENT") {
    if (student.userId.toString() !== requester.userId.toString()) {
      throw new UnauthorizedProfileAccessError(
        "Students can only view their own profile",
      );
    }
  }

  if (requester.role === "TEACHER") {
    throw new UnauthorizedProfileAccessError(
      "Teacher access enforcement pending Teacher Management module",
    );
  }

  // ADMIN allowed without restriction

  // 3️⃣ Fetch current ACTIVE enrollment (optional)
  const activeEnrollment = await Enrollment.findOne({
    studentId: student._id,
    enrollmentStatus: "ACTIVE",
  });

  return {
    identity: {
      _id: student._id,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      admissionNumber: student.admissionNumber,
      identityStatus: student.identityStatus,
    },
    activeEnrollment: activeEnrollment
      ? {
          _id: activeEnrollment._id,
          academicYearId: activeEnrollment.academicYearId,
          sectionId: activeEnrollment.sectionId,
          enrollmentStatus: activeEnrollment.enrollmentStatus,
        }
      : null,
  };
};

module.exports = {
  createStudentIdentity,
  updateStudentIdentity,
  deactivateStudentIdentity,
  getStudentProfile,

  StudentNotFoundError,
  DuplicateAdmissionNumberError,
  UnauthorizedProfileAccessError,
};
