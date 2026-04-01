const Joi = require("joi");

/*
  ==============================
  CREATE NOTICE
  FR-NOT-01
  ==============================
*/

const createNoticeSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  attachmentReference: Joi.string().trim().optional().allow(null),
}).unknown(false);

/*
  ==============================
  ADMIN NOTICE LISTING FILTERS
  FR-NOT-04
  ==============================
*/

const getNoticesForAdminSchema = Joi.object({
  academicYearId: Joi.string().optional(),
  status: Joi.string().valid("Active", "Inactive").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
}).unknown(false);

/*
  ==============================
  CHANGE NOTICE STATUS
  FR-NOT-03
  ==============================
*/

const changeNoticeStatusSchema = Joi.object({
  status: Joi.string().valid("Active", "Inactive").required(),
}).unknown(false);

module.exports = {
  createNoticeSchema,
  getNoticesForAdminSchema,
  changeNoticeStatusSchema,
};
