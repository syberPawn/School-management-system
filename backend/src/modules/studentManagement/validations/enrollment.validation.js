/*
  Enrollment Validation Layer
  Handles request structure validation only.
  Business rules enforced in Service layer.
*/

class EnrollmentValidationError extends Error {}

const allowedCreateFields = ["studentId", "academicYearId", "sectionId"];

const allowedClassUpdateFields = ["sectionId"];

const allowedStatusUpdateFields = ["enrollmentStatus"];

/*
  Utility
*/
function rejectUnexpectedFields(payload, allowedFields) {
  const payloadKeys = Object.keys(payload);

  const unexpectedFields = payloadKeys.filter(
    (key) => !allowedFields.includes(key),
  );

  if (unexpectedFields.length > 0) {
    throw new EnrollmentValidationError(
      `Unexpected fields: ${unexpectedFields.join(", ")}`,
    );
  }
}

/*
  Validate Create Enrollment
*/
function validateCreateEnrollment(payload) {
  rejectUnexpectedFields(payload, allowedCreateFields);

  const { studentId, academicYearId, sectionId } = payload;

  if (!studentId) throw new EnrollmentValidationError("studentId is required");

  if (!academicYearId)
    throw new EnrollmentValidationError("academicYearId is required");

  if (!sectionId) throw new EnrollmentValidationError("sectionId is required");
}

/*
  Validate Class Update
*/
function validateEnrollmentClassUpdate(payload) {
  rejectUnexpectedFields(payload, allowedClassUpdateFields);

  if (!payload.sectionId) {
    throw new EnrollmentValidationError("sectionId is required");
  }
}

/*
  Validate Status Update
*/
function validateEnrollmentStatusUpdate(payload) {
  rejectUnexpectedFields(payload, allowedStatusUpdateFields);

  const { enrollmentStatus } = payload;

  if (!enrollmentStatus) {
    throw new EnrollmentValidationError("enrollmentStatus is required");
  }

  const allowedStatuses = [
    "ACTIVE",
    "PROMOTED",
    "REPEATING",
    "WITHDRAWN",
    "COMPLETED",
  ];

  if (!allowedStatuses.includes(enrollmentStatus)) {
    throw new EnrollmentValidationError("Invalid enrollmentStatus value");
  }
}
/*
  Validate List Students Filters
*/
function validateListStudentsFilters(query) {
  const allowedFields = [
    "academicYearId",
    "sectionId",
    "name",
    "admissionNumber",
  ];

  const queryKeys = Object.keys(query);

  const unexpectedFields = queryKeys.filter(
    (key) => !allowedFields.includes(key),
  );

  if (unexpectedFields.length > 0) {
    throw new EnrollmentValidationError(
      `Unexpected query parameters: ${unexpectedFields.join(", ")}`,
    );
  }

  if (!query.academicYearId) {
    throw new EnrollmentValidationError("academicYearId is mandatory");
  }
}

module.exports = {
  validateCreateEnrollment,
  validateEnrollmentClassUpdate,
  validateEnrollmentStatusUpdate,
  validateListStudentsFilters,
  EnrollmentValidationError,
};
