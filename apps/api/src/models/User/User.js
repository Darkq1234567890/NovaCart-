const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ""
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    otpHash: {
      type: String,
      required: true,
      select: false
    },

    otpExpiresAt: {
      type: Date,
      required: true
    },

    resendAvailableAt: {
      type: Date,
      required: true
    },

    attempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Automatically remove expired pending registrations.
pendingRegistrationSchema.index(
  { otpExpiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);