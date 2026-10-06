const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100
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
      minlength: 6,
      select: false
    },

    phone: {
      type: String,
      trim: true,
      index: true
    },

    role: {
      type: String,
      enum: [
        "customer",
        "vendor",
        "staff",
        "admin",
        "super_admin"
      ],
      default: "customer",
      index: true
    },

    status: {
      type: String,
      enum: ["active", "suspended", "blocked"],
      default: "active",
      index: true
    },

    avatar: {
      type: String,
      default: ""
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    isPhoneVerified: {
      type: Boolean,
      default: false
    },

    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);