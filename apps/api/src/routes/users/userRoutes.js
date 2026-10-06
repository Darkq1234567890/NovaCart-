const express = require("express");

const { protect } = require("../../middleware/auth/authMiddleware");

const {
  getMyProfile,
  updateMyProfile
} = require("../../controllers/users/userController");

const router = express.Router();

// Get logged-in user's profile
router.get("/me", protect, getMyProfile);

// Update logged-in user's profile
router.put("/me", protect, updateMyProfile);

module.exports = router;