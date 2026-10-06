const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getUsers
} = require("../../controllers/users/userController");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/roles/roleMiddleware");

const router = express.Router();

// Get logged-in user's profile
router.get(
  "/me",
  protect,
  getMyProfile
);

// Update logged-in user's profile
router.put(
  "/me",
  protect,
  updateMyProfile
);

// Change logged-in user's password
router.put(
  "/me/password",
  protect,
  changePassword
);

// Get all users - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  getUsers
);

module.exports = router;