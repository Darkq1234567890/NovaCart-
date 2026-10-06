const express = require("express");

const {
  createVendor,
  getVendors,
  getVendorById,
  getMyVendorProfile,
  updateVendor,
  updateVendorStatus,
  promoteUserToVendor
} = require("../../controllers/vendors/vendorController");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/roles/roleMiddleware");

const router = express.Router();

// Get all vendors
router.get(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  getVendors
);

// Get logged-in vendor's own profile
router.get(
  "/me",
  protect,
  authorizeRoles("vendor"),
  getMyVendorProfile
);

// Get single vendor
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  getVendorById
);

// Create vendor
router.post(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  createVendor
);

// Update vendor
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  updateVendor
);

// Update vendor status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "super_admin"),
  updateVendorStatus
);

// Promote an existing user to vendor
router.patch(
  "/users/promote",
  protect,
  authorizeRoles("admin", "super_admin"),
  promoteUserToVendor
);

module.exports = router;