const express = require("express");
const router = express.Router();

const {
  create,
  update,
  deactivate,
  getById,
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

router.get("/:id", getById);
router.get("/:id/profile", getProfile);

module.exports = router;
