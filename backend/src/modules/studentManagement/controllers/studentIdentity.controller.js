const {
  createStudentIdentity,
  updateStudentIdentity,
  deactivateStudentIdentity,
  getStudentProfile,

  StudentNotFoundError,
  DuplicateAdmissionNumberError,
  UnauthorizedProfileAccessError,
} = require("../services/studentIdentity.service");
const {
  validateCreateStudent,
  validateUpdateStudent,
  ValidationError,
} = require("../validations/student.validation");
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
  POST /students
  =====================================
*/

const create = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN"]);

    validateCreateStudent(req.body);
    const result = await createStudentIdentity(req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    if (error instanceof DuplicateAdmissionNumberError) {
      return res.status(409).json({ message: error.message });
    }

    if (error instanceof StudentNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/*
  =====================================
  PATCH /students/:id
  =====================================
*/

const update = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN"]);

    validateUpdateStudent(req.body);
    const result = await updateStudentIdentity(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    if (error instanceof StudentNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/*
  =====================================
  PATCH /students/:id/deactivate
  =====================================
*/

const deactivate = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN"]);

    const result = await deactivateStudentIdentity(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    if (error instanceof StudentNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/*
 /*
  =====================================
  GET /students/:id/profile
  =====================================
*/

const getProfile = async (req, res) => {
  try {
    await verifyAuthenticated(req);
    verifyRole(req, ["ADMIN", "TEACHER", "STUDENT"]);

    const result = await getStudentProfile(req.user, req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof AuthenticationFailedError ||
      error instanceof AccountDeactivatedError ||
      error instanceof SessionExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }

    if (error instanceof AuthorizationError) {
      return res.status(403).json({ message: error.message });
    }

    if (error instanceof StudentNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof UnauthorizedProfileAccessError) {
      return res.status(403).json({ message: error.message });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  create,
  update,
  deactivate,
  getProfile,
};
