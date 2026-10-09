const express = require("express");

const {
  register,
  login,
  resetVendorPassword
} = require("../../controllers/auth/authController");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/roles/roleMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Temporary password reset for vendors by Super Admin only
router.patch(
  "/admin/reset-vendor-password",
  protect,
  authorizeRoles("super_admin"),
  resetVendorPassword
);

module.exports = router;