const mongoose = require("mongoose");

const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
      immutable: true,
      index: true,
    },

    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "AcademicYear",
      immutable: true,
      index: true,
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Section",
      index: true,
    },

    enrollmentStatus: {
      type: String,
      required: true,
      enum: ["ACTIVE", "PROMOTED", "REPEATING", "WITHDRAWN", "COMPLETED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
  =====================================
  Compound Unique Constraint
  One enrollment per student per academic year
  (BR-SM-04)
  =====================================
*/
enrollmentSchema.index({ studentId: 1, academicYearId: 1 }, { unique: true });

/*
  Performance Indexes
*/
// enrollmentSchema.index({ academicYearId: 1 });
// enrollmentSchema.index({ sectionId: 1 });
// enrollmentSchema.index({ academicYearId: 1, sectionId: 1 });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
