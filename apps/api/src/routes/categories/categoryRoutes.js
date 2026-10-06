const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../../controllers/categories/categoryController");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/roles/roleMiddleware");

const router = express.Router();

// Get all active categories
router.get("/", getCategories);

// Get a single category
router.get("/:id", getCategoryById);

// Create category
router.post(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  createCategory
);

// Update category
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  updateCategory
);

// Delete category
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  deleteCategory
);

module.exports = router;