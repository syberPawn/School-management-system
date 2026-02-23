/*
  Student Identity Validation Layer
  Handles payload structure validation only.
  Business rules enforced in Service layer.
*/

const allowedCreateFields = [
  "userId",
  "fullName",
  "dateOfBirth",
  "gender",
  "admissionNumber",
];

const allowedUpdateFields = ["fullName", "gender"];

class ValidationError extends Error {}
/*
  Utility: Check for unexpected fields
*/
function rejectUnexpectedFields(payload, allowedFields) {
  const payloadKeys = Object.keys(payload);

  const unexpectedFields = payloadKeys.filter(
    (key) => !allowedFields.includes(key),
  );

  if (unexpectedFields.length > 0) {
    throw new ValidationError(
      `Unexpected fields: ${unexpectedFields.join(", ")}`,
    );
  }
}

/*
  Validate Create Student Identity
*/
function validateCreateStudent(payload) {
  rejectUnexpectedFields(payload, allowedCreateFields);

  const { userId, fullName, dateOfBirth, gender, admissionNumber } = payload;

  if (!userId) throw new ValidationError("userId is required");
  if (!fullName) throw new ValidationError("fullName is required");
  if (!dateOfBirth) throw new ValidationError("dateOfBirth is required");
  if (!gender) throw new ValidationError("gender is required");
  if (!admissionNumber)
    throw new ValidationError("admissionNumber is required");

  const allowedGenders = ["MALE", "FEMALE", "OTHER"];
  if (!allowedGenders.includes(gender)) {
    throw new ValidationError("Invalid gender value");
  }
}

/*
  Validate Update Student Identity
*/
function validateUpdateStudent(payload) {
  rejectUnexpectedFields(payload, allowedUpdateFields);

  if (Object.keys(payload).length === 0) {
    throw new ValidationError("No valid fields provided for update");
  }
}

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
  ValidationError,
};
