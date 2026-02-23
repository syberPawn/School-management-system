const express = require("express");
const router = express.Router();

const {
  create,
  update,
  deactivate,
  getProfile,
} = require("../controllers/studentIdentity.controller");

/*
  =====================================
  Student Identity Routes
  =====================================
*/

router.post("/", create);

router.patch("/:id", update);

router.patch("/:id/deactivate", deactivate);

router.get("/:id/profile", getProfile);

module.exports = router;
