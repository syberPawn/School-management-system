const {
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
} = require("../services/studentEnrollment.service");

const {
  validateCreateEnrollment,
  validateEnrollmentClassUpdate,
  validateEnrollmentStatusUpdate,
  validateListStudentsFilters,
  EnrollmentValidationError,
} = require("../validations/enrollment.validation");

const {
  verifyAuthenticated,
  verifyRole,
  AuthorizationError,
} = require("../../user/services/authorization.service");

const {
  AuthenticationFailedError,
  AccountDeactivatedError,
  SessionExpiredError,
} = require("../../user/services/auth.service");

/*
  =====================================
  POST /enrollments
  =====================================
*/

const create = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN"]);

    validateCreateEnrollment(req.body);

    const result = await createEnrollment(req.body);

    return res.status(201).json(result);
  } catch (error) {
    // Authentication errors
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    // Authorization error
    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    // Validation errors
    if (error instanceof EnrollmentValidationError) {
      return res.status(400).json({ message: error.message });
    }

    // Not found errors
    if (
      error instanceof AcademicYearNotFoundError ||
      error instanceof SectionNotFoundError ||
      error instanceof StudentNotFoundError
    ) {
      return res.status(404).json({ message: error.message });
    }

    // Conflict errors
    if (error instanceof DuplicateEnrollmentError) {
      return res.status(409).json({ message: error.message });
    }

    // Business rule violations
    if (
      error instanceof AcademicYearInactiveError ||
      error instanceof SectionYearMismatchError ||
      error instanceof OverlappingActiveEnrollmentError
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/*
  =====================================
  PATCH /enrollments/:id/class
  =====================================
*/

const updateClass = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN"]);

    validateEnrollmentClassUpdate(req.body);

    const result = await updateEnrollmentClass(
      req.params.id,
      req.body.sectionId,
    );

    return res.status(200).json(result);
  } catch (error) {
    // Authentication errors
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    // Authorization error
    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    // Validation errors
    if (error instanceof EnrollmentValidationError) {
      return res.status(400).json({ message: error.message });
    }

    // Not found
    if (
      error instanceof EnrollmentNotFoundError ||
      error instanceof SectionNotFoundError
    ) {
      return res.status(404).json({ message: error.message });
    }

    // Business rule violations
    if (error instanceof SectionYearMismatchError) {
      return res.status(400).json({ message: error.message });
    }

    // ACTIVE status violation
    if (error instanceof EnrollmentStatusRestrictionError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/*
  =====================================
  PATCH /enrollments/:id/status
  =====================================
*/

const updateStatus = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN"]);

    validateEnrollmentStatusUpdate(req.body);

    const result = await updateEnrollmentStatus(
      req.params.id,
      req.body.enrollmentStatus,
    );

    return res.status(200).json(result);
  } catch (error) {
    // Authentication errors
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    // Authorization error
    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    // Validation errors
    if (error instanceof EnrollmentValidationError) {
      return res.status(400).json({ message: error.message });
    }

    // Not found
    if (
      error instanceof EnrollmentNotFoundError ||
      error instanceof AcademicYearNotFoundError
    ) {
      return res.status(404).json({ message: error.message });
    }

    // Business rule violations
    if (
      error instanceof AcademicYearInactiveError ||
      error instanceof OverlappingActiveEnrollmentError ||
      error instanceof EnrollmentStatusRestrictionError
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/*
  =====================================
  GET /enrollments
  =====================================
*/

const list = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN", "TEACHER", "STUDENT"]);

    validateListStudentsFilters(req.query);

    const result = await listStudents(req.query, req.user);

    return res.status(200).json(result);
  } catch (error) {
    // Authentication errors
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    // Authorization error
    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    // Validation error
    if (error instanceof EnrollmentValidationError) {
      return res.status(400).json({ message: error.message });
    }

    // Not found
    if (error instanceof AcademicYearNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    // Access control
    if (
      error instanceof AccessDeniedError ||
      error instanceof FeatureNotImplementedError
    ) {
      return res.status(403).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  create,
  updateClass,
  updateStatus,
  list,
};
