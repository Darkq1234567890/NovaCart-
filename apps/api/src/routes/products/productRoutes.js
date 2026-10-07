const express = require("express");

const {
createProduct,
getProducts,
getMyVendorProducts,
getProductById,
updateProduct,
deleteProduct
} = require("../../controllers/products/productController");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/roles/roleMiddleware");

const router = express.Router();

// Get all active products - public
router.get(
"/",
getProducts
);

// Get logged-in vendor's own products
router.get(
"/vendor/me",
protect,
authorizeRoles("vendor"),
getMyVendorProducts
);

// Get a single active product - public
router.get(
"/:id",
getProductById
);

// Create a product
router.post(
"/",
protect,
authorizeRoles("admin", "super_admin", "vendor"),
createProduct
);

// Update a product
router.put(
"/:id",
protect,
authorizeRoles("admin", "super_admin", "vendor"),
updateProduct
);

// Soft-delete a product
router.delete(
"/:id",
protect,
authorizeRoles("admin", "super_admin", "vendor"),
deleteProduct
);

module.exports = router;