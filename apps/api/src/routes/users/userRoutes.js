const express = require("express");

const { protect } = require("../../middleware/auth/authMiddleware");

const {
  getMyProfile,
  updateMyProfile,
  changePassword
} = require("../../controllers/users/userController");

const router = express.Router();

// Get logged-in user's profile
router.get("/me", protect, getMyProfile);

// Update logged-in user's profile
router.put("/me", protect, updateMyProfile);

// Change logged-in user's password
router.put("/change-password", protect, changePassword);

module.exports = router;