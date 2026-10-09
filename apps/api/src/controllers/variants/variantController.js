
const Variant = require("../../models/Variant/Variant");
const Product = require("../../models/Product/Product");
const Vendor = require("../../models/Vendor/Vendor");

const normalizeSKU = (sku) => sku.toUpperCase().trim();

const isValidNonNegativeNumber = (value) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0;

const handleVariantError = (error, res, action) => {
  console.error(`${action} variant error:`, error);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A variant with this SKU already exists"
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid variant data"
    });
  }

  return res.status(500).json({
    success: false,
    message: `Unable to ${action} variant`
  });
};

const getVendorProfileForUser = async (userId) => {
  const vendorProfile = await Vendor.findOne({
    user: userId
  });

  if (!vendorProfile) {
    return {
      error: {
        status: 404,
        message: "Vendor profile not found"
      }
    };
  }

  if (vendorProfile.status !== "active") {
    return {
      error: {
        status: 403,
        message: "Your vendor account is not active"
      }
    };
  }

  return { vendorProfile };
};

const checkProductPermission = async (req, product) => {
  if (
    req.user.role !== "vendor" &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    return {
      status: 403,
      message: "You do not have permission to manage variants"
    };
  }

  if (req.user.role !== "vendor") {
    return null;
  }

  const result = await getVendorProfileForUser(req.user._id);

  if (result.error) {
    return result.error;
  }

  if (
    !product.vendor ||
    product.vendor.toString() !==
      result.vendorProfile._id.toString()
  ) {
    return {
      status: 403,
      message: "You do not have permission to manage variants for this product"
    };
  }

  return null;
};

const validateVariantNumbers = (data) => {
  const numericFields = [
    "price",
    "compareAtPrice",
    "stock",
    "lowStockThreshold"
  ];

  for (const field of numericFields) {
    if (data[field] === undefined || data[field] === null) {
      continue;
    }

    if (!isValidNonNegativeNumber(data[field])) {
      return `${field} must be a non-negative number`;
    }
  }

  if (
    data.price !== undefined &&
    data.price !== null &&
    data.compareAtPrice !== undefined &&
    data.compareAtPrice !== null &&
    data.compareAtPrice < data.price
  ) {
    return "compareAtPrice cannot be lower than price";
  }

  return null;
};

// CREATE VARIANT
const createVariant = async (req, res) => {
  try {
    const {
      product: productId,
      name,
      sku,
      attributes,
      price,
      compareAtPrice,
      stock,
      lowStockThreshold,
      image
    } = req.body;

    if (
      typeof productId !== "string" ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof sku !== "string" ||
      !sku.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Product, name and SKU are required"
      });
    }

    const numberError = validateVariantNumbers({
      price,
      compareAtPrice,
      stock,
      lowStockThreshold
    });

    if (numberError) {
      return res.status(400).json({
        success: false,
        message: numberError
      });
    }

    if (
      attributes !== undefined &&
      (
        attributes === null ||
        typeof attributes !== "object" ||
        Array.isArray(attributes)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Attributes must be an object"
      });
    }

    if (image !== undefined && typeof image !== "string") {
      return res.status(400).json({
        success: false,
        message: "Image must be a string"
      });
    }

    const existingProduct = await Product.findById(productId);

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

    const permissionError = await checkProductPermission(
      req,
      existingProduct
    );

    if (permissionError) {
      return res.status(permissionError.status).json({
        success: false,
        message: permissionError.message
      });
    }

    const normalizedSKU = normalizeSKU(sku);

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

    const populatedVariant = await Variant.findById(variant._id)
      .populate("product", "name slug sku")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Variant created successfully",
      variant: populatedVariant
    });
  } catch (error) {
    return handleVariantError(error, res, "create");
  }
};

// GET VARIANTS FOR A PRODUCT
const getProductVariants = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      isActive: true
    }).lean();

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

    return res.status(200).json({
      success: true,
      variants,
      total: variants.length
    });
  } catch (error) {
    return handleVariantError(error, res, "fetch");
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

    if (!variant || !variant.product) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    return res.status(200).json({
      success: true,
      variant
    });
  } catch (error) {
    return handleVariantError(error, res, "fetch");
  }
};

// UPDATE VARIANT
const updateVariant = async (req, res) => {
  try {
    const existingVariant = await Variant.findById(req.params.id);

    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    const product = await Product.findById(existingVariant.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const permissionError = await checkProductPermission(req, product);

    if (permissionError) {
      return res.status(permissionError.status).json({
        success: false,
        message: permissionError.message
      });
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
      if (typeof updates.name !== "string" || !updates.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name must be a non-empty string"
        });
      }

      updates.name = updates.name.trim();
    }

    if (updates.sku !== undefined) {
      if (typeof updates.sku !== "string" || !updates.sku.trim()) {
        return res.status(400).json({
          success: false,
          message: "SKU must be a non-empty string"
        });
      }

      updates.sku = normalizeSKU(updates.sku);

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

    const numberError = validateVariantNumbers(updates);

    if (numberError) {
      return res.status(400).json({
        success: false,
        message: numberError
      });
    }

    if (updates.attributes !== undefined) {
      if (
        updates.attributes === null ||
        typeof updates.attributes !== "object" ||
        Array.isArray(updates.attributes)
      ) {
        return res.status(400).json({
          success: false,
          message: "Attributes must be an object"
        });
      }
    }

    if (updates.image !== undefined) {
      if (typeof updates.image !== "string") {
        return res.status(400).json({
          success: false,
          message: "Image must be a string"
        });
      }

      updates.image = updates.image.trim();
    }

    if (
      updates.isActive !== undefined &&
      typeof updates.isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false"
      });
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

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Variant updated successfully",
      variant
    });
  } catch (error) {
    return handleVariantError(error, res, "update");
  }
};

// DELETE VARIANT
const deleteVariant = async (req, res) => {
  try {
    const existingVariant = await Variant.findById(req.params.id);

    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    const product = await Product.findById(existingVariant.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const permissionError = await checkProductPermission(req, product);

    if (permissionError) {
      return res.status(permissionError.status).json({
        success: false,
        message: permissionError.message
      });
    }

    if (!existingVariant.isActive) {
      return res.status(400).json({
        success: false,
        message: "Variant is already inactive"
      });
    }

    existingVariant.isActive = false;
    await existingVariant.save();

    return res.status(200).json({
      success: true,
      message: "Variant removed successfully"
    });
  } catch (error) {
    return handleVariantError(error, res, "remove");
  }
};

// RESTORE VARIANT
const restoreVariant = async (req, res) => {
  try {
    const existingVariant = await Variant.findById(req.params.id);

    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    const product = await Product.findById(existingVariant.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot restore a variant for an inactive product"
      });
    }

    const permissionError = await checkProductPermission(req, product);

    if (permissionError) {
      return res.status(permissionError.status).json({
        success: false,
        message: permissionError.message
      });
    }

    if (existingVariant.isActive) {
      return res.status(400).json({
        success: false,
        message: "Variant is already active"
      });
    }

    existingVariant.isActive = true;
    await existingVariant.save();

    const restoredVariant = await Variant.findById(existingVariant._id)
      .populate("product", "name slug sku")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Variant restored successfully",
      variant: restoredVariant
    });
  } catch (error) {
    return handleVariantError(error, res, "restore");
  }
};

module.exports = {
  createVariant,
  getProductVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
  restoreVariant
};
