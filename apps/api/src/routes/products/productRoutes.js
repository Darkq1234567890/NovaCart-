const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../../controllers/products/productController");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/roles/roleMiddleware");
const router = express.Router();

// Get all active products
router.get("/", getProducts);

// Get a single product
router.get("/:id", getProductById);

// Create a product
router.post("/", protect, createProduct);

// Update a product
router.put("/:id", protect, updateProduct);

// Soft-delete a product
router.delete("/:id", protect, deleteProduct);

module.exports = router;