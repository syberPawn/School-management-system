const Grade = require("../models/grade.model");
const AcademicYear = require("../models/academicYear.model");

const {
  StructuralDependencyError,
  validateGradeHasNoActiveSections,
  validateGradeHasNoActiveMappings,
  validateSectionHasNoActiveEnrollments,
} = require("./validators/structuralDependency.validator");

/*
  =====================================
  Grade Domain Errors
  =====================================
*/

class GradeNotFoundError extends Error {}
class AcademicYearNotFoundError extends Error {}
class DuplicateGradeError extends Error {}

/*
  =====================================
  GradeService
  =====================================
*/

const createGrade = async (data, adminId) => {
  const { name, academicYearId } = data;

  // 1️⃣ Required field validation
  if (!name || !academicYearId) {
    throw new Error("Missing required grade fields");
  }

  // 2️⃣ Validate academic year exists
  const academicYear = await AcademicYear.findById(academicYearId);

  if (!academicYear) {
    throw new AcademicYearNotFoundError("Academic year not found");
  }

  try {
    // 3️⃣ Create grade
    const grade = await Grade.create({
      name,
      academicYearId,
      status: "ACTIVE",
      createdBy: adminId,
      updatedBy: adminId,
    });

    return grade;
  } catch (error) {
    // 4️⃣ Handle duplicate key error (Mongo error code 11000)
    if (error.code === 11000) {
      throw new DuplicateGradeError(
        "Grade name must be unique within the academic year",
      );
    }

    throw error;
  }
};

const deactivateGrade = async (gradeId) => {
  // 1️⃣ Validate grade exists
  const grade = await Grade.findById(gradeId);

  if (!grade) {
    throw new GradeNotFoundError("Grade not found");
  }

  // 2️⃣ If already INACTIVE → return silently
  if (grade.status === "INACTIVE") {
    return grade;
  }

  // 3️⃣ Validate no ACTIVE sections
  await validateGradeHasNoActiveSections(gradeId);

  // 4️⃣ Validate no ACTIVE mappings
  await validateGradeHasNoActiveMappings(gradeId);

  // 5️⃣ Soft deactivate
  grade.status = "INACTIVE";

  await grade.save();

  return grade;
};

const listGradesByAcademicYear = async (academicYearId) => {
  const year = await AcademicYear.findById(academicYearId);

  if (!year) {
    throw new AcademicYearNotFoundError("Academic year not found");
  }

  return Grade.find({ academicYearId }).sort({ name: 1 });
};

module.exports = {
  createGrade,
  deactivateGrade,
  listGradesByAcademicYear,

  StructuralDependencyError,
  validateSectionHasNoActiveEnrollments,
  GradeNotFoundError,
  AcademicYearNotFoundError,
  DuplicateGradeError,
};
