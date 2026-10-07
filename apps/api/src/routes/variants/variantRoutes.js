const express = require("express");

const {
createVariant,
getProductVariants,
getVariantById,
updateVariant,
deleteVariant,
restoreVariant
} = require("../../controllers/variants/variantController");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/roles/roleMiddleware");

const router = express.Router();

// Get all active variants for a product - public
router.get(
"/product/:productId",
getProductVariants
);

// Get a single active variant - public
router.get(
"/:id",
getVariantById
);

// Create a variant
router.post(
"/",
protect,
authorizeRoles("admin", "super_admin", "vendor"),
createVariant
);

// Update a variant
router.put(
"/:id",
protect,
authorizeRoles("admin", "super_admin", "vendor"),
updateVariant
);

// Soft-delete a variant
router.delete(
"/:id",
protect,
authorizeRoles("admin", "super_admin", "vendor"),
deleteVariant
);

// Restore a variant
router.patch(
"/:id/restore",
protect,
authorizeRoles("admin", "super_admin", "vendor"),
restoreVariant
);

module.exports = router;