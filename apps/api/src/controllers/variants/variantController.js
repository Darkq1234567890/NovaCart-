const Variant = require("../../models/Variant/Variant");
const Product = require("../../models/Product/Product");
const Vendor = require("../../models/Vendor/Vendor");

// CREATE VARIANT
const createVariant = async (req, res) => {
try {
const {
product,
name,
sku,
attributes,
price,
compareAtPrice,
stock,
lowStockThreshold,
image
} = req.body;

if (!product || !name || !sku) {
  return res.status(400).json({
    success: false,
    message: "Product, name and SKU are required"
  });
}

const existingProduct = await Product.findById(product);

if (!existingProduct) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

if (!existingProduct.isActive) {
  return res.status(400).json({
    success: false,
    message: "Cannot create a variant for an inactive product"
  });
}

if (req.user.role === "vendor") {
  const vendorProfile = await Vendor.findOne({
    user: req.user._id
  });

  if (!vendorProfile) {
    return res.status(404).json({
      success: false,
      message: "Vendor profile not found"
    });
  }

  if (vendorProfile.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your vendor account is not active"
    });
  }

  if (
    !existingProduct.vendor ||
    existingProduct.vendor.toString() !==
      vendorProfile._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You do not have permission to create a variant for this product"
    });
  }
}

const normalizedSKU = sku.toUpperCase().trim();

const existingVariant = await Variant.findOne({
  sku: normalizedSKU
});

if (existingVariant) {
  return res.status(409).json({
    success: false,
    message: "A variant with this SKU already exists"
  });
}

const variant = await Variant.create({
  product: existingProduct._id,
  name: name.trim(),
  sku: normalizedSKU,
  attributes: attributes || {},
  price: price ?? null,
  compareAtPrice: compareAtPrice ?? null,
  stock: stock ?? 0,
  lowStockThreshold: lowStockThreshold ?? 5,
  image: image?.trim() || ""
});

const populatedVariant = await Variant.findById(
  variant._id
)
  .populate("product", "name slug sku")
  .lean();

res.status(201).json({
  success: true,
  message: "Variant created successfully",
  variant: populatedVariant
});

} catch (error) {
console.error("Create variant error:", error);

res.status(500).json({
  success: false,
  message: "Unable to create variant"
});

}
};

// GET VARIANTS FOR A PRODUCT
const getProductVariants = async (req, res) => {
try {
const { productId } = req.params;

const product = await Product.findOne({
  _id: productId,
  isActive: true
});

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

const variants = await Variant.find({
  product: productId,
  isActive: true
})
  .populate("product", "name slug sku")
  .sort({ createdAt: 1 })
  .lean();

res.status(200).json({
  success: true,
  variants,
  total: variants.length
});

} catch (error) {
console.error("Get product variants error:", error);

res.status(500).json({
  success: false,
  message: "Unable to fetch product variants"
});

}
};

// GET SINGLE VARIANT
const getVariantById = async (req, res) => {
try {
const variant = await Variant.findOne({
_id: req.params.id,
isActive: true
})
.populate("product", "name slug sku")
.lean();

if (!variant) {
  return res.status(404).json({
    success: false,
    message: "Variant not found"
  });
}

res.status(200).json({
  success: true,
  variant
});

} catch (error) {
console.error("Get variant error:", error);

res.status(500).json({
  success: false,
  message: "Unable to fetch variant"
});

}
};

// UPDATE VARIANT
const updateVariant = async (req, res) => {
try {
const existingVariant = await Variant.findById(
req.params.id
);

if (!existingVariant) {
  return res.status(404).json({
    success: false,
    message: "Variant not found"
  });
}

const product = await Product.findById(
  existingVariant.product
);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

if (req.user.role === "vendor") {
  const vendorProfile = await Vendor.findOne({
    user: req.user._id
  });

  if (!vendorProfile) {
    return res.status(404).json({
      success: false,
      message: "Vendor profile not found"
    });
  }

  if (vendorProfile.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your vendor account is not active"
    });
  }

  if (
    !product.vendor ||
    product.vendor.toString() !==
      vendorProfile._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You do not have permission to update this variant"
    });
  }
}

const allowedFields = [
  "name",
  "sku",
  "attributes",
  "price",
  "compareAtPrice",
  "stock",
  "lowStockThreshold",
  "image",
  "isActive"
];

const updates = {};

for (const field of allowedFields) {
  if (req.body[field] !== undefined) {
    updates[field] = req.body[field];
  }
}

if (updates.name !== undefined) {
  updates.name = updates.name.trim();
}

if (updates.sku !== undefined) {
  updates.sku = updates.sku.toUpperCase().trim();

  const duplicateVariant = await Variant.findOne({
    _id: { $ne: req.params.id },
    sku: updates.sku
  });

  if (duplicateVariant) {
    return res.status(409).json({
      success: false,
      message: "Another variant already uses this SKU"
    });
  }
}

if (updates.image !== undefined) {
  updates.image = updates.image.trim();
}

const variant = await Variant.findByIdAndUpdate(
  req.params.id,
  updates,
  {
    new: true,
    runValidators: true
  }
)
  .populate("product", "name slug sku")
  .lean();

res.status(200).json({
  success: true,
  message: "Variant updated successfully",
  variant
});

} catch (error) {
console.error("Update variant error:", error);

res.status(500).json({
  success: false,
  message: "Unable to update variant"
});

}
};

// DELETE VARIANT
const deleteVariant = async (req, res) => {
try {
const existingVariant = await Variant.findById(
req.params.id
);

if (!existingVariant) {
  return res.status(404).json({
    success: false,
    message: "Variant not found"
  });
}

const product = await Product.findById(
  existingVariant.product
);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

if (req.user.role === "vendor") {
  const vendorProfile = await Vendor.findOne({
    user: req.user._id
  });

  if (!vendorProfile) {
    return res.status(404).json({
      success: false,
      message: "Vendor profile not found"
    });
  }

  if (vendorProfile.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your vendor account is not active"
    });
  }

  if (
    !product.vendor ||
    product.vendor.toString() !==
      vendorProfile._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You do not have permission to remove this variant"
    });
  }
}

existingVariant.isActive = false;

await existingVariant.save();

res.status(200).json({
  success: true,
  message: "Variant removed successfully"
});

} catch (error) {
console.error("Delete variant error:", error);

res.status(500).json({
  success: false,
  message: "Unable to remove variant"
});

}
};

module.exports = {
createVariant,
getProductVariants,
getVariantById,
updateVariant,
deleteVariant
};