const express = require("express");
const router = express.Router();

const {
  create,
  updateClass,
  updateStatus,
  list,
 
} = require("../controllers/studentEnrollment.controller");

/*
  =====================================
  Enrollment Routes
  =====================================
*/

router.post("/", create);
router.patch("/:id/class", updateClass);
router.patch("/:id/status", updateStatus);
router.get("/", list);


module.exports = router;
