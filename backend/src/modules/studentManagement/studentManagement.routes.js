const express = require("express");
const router = express.Router();

/*
  =====================================
  Student Management Route Aggregator
  =====================================
*/

const studentIdentityRoutes = require("./routes/studentIdentity.routes");
const studentEnrollmentRoutes = require("./routes/studentEnrollment.routes");


// Mount sub-routes
router.use("/students", studentIdentityRoutes);
router.use("/enrollments", studentEnrollmentRoutes);

module.exports = router;
