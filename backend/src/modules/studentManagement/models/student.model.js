const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      immutable: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
      immutable: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    admissionNumber: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
      trim: true,
      index: true,
    },

    identityStatus: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
  Performance Indexes
*/
// studentSchema.index({ fullName: 1 });
// studentSchema.index({ identityStatus: 1 });

module.exports = mongoose.model("Student", studentSchema);
