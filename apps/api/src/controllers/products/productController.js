const Product = require("../../models/Product/Product");
const Category = require("../../models/Category/Category");
const Vendor = require("../../models/Vendor/Vendor");

// CREATE PRODUCT
const createProduct = async (req, res) => {
try {
const {
name,
slug,
description,
shortDescription,
category,
vendor,
brand,
sku,
images,
price,
compareAtPrice,
costPrice,
currency,
stock,
lowStockThreshold,
isDropshipped,
supplier,
supplierSKU,
shippingInfo,
specifications,
isFeatured
} = req.body;

if (
  !name ||
  !slug ||
  !description ||
  !category ||
  !sku ||
  price === undefined
) {
  return res.status(400).json({
    success: false,
    message:
      "Name, slug, description, category, SKU and price are required"
  });
}

const categoryExists = await Category.findById(category);

if (!categoryExists) {
  return res.status(400).json({
    success: false,
    message: "Category not found"
  });
}

const normalizedSlug = slug.toLowerCase().trim();
const normalizedSKU = sku.toUpperCase().trim();

const existingProduct = await Product.findOne({
  $or: [
    { slug: normalizedSlug },
    { sku: normalizedSKU }
  ]
});

if (existingProduct) {
  return res.status(409).json({
    success: false,
    message: "A product with this slug or SKU already exists"
  });
}

let productVendor = null;

// Vendors automatically use their own vendor profile.
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

  productVendor = vendorProfile._id;
}

// Admin/Super Admin may assign a product to a vendor.
if (
  req.user.role === "admin" ||
  req.user.role === "super_admin"
) {
  if (vendor) {
    const vendorExists = await Vendor.findById(vendor);

    if (!vendorExists) {
      return res.status(400).json({
        success: false,
        message: "Vendor not found"
      });
    }

    productVendor = vendorExists._id;
  }
}

const product = await Product.create({
  name: name.trim(),
  slug: normalizedSlug,
  description: description.trim(),
  shortDescription: shortDescription?.trim() || "",
  category,
  vendor: productVendor,
  brand: brand?.trim() || "",
  sku: normalizedSKU,
  images: images || [],
  price,
  compareAtPrice: compareAtPrice ?? null,
  costPrice: costPrice ?? null,
  currency: currency || "INR",
  stock: stock ?? 0,
  lowStockThreshold: lowStockThreshold ?? 5,
  isDropshipped: isDropshipped ?? false,
  supplier: supplier || null,
  supplierSKU: supplierSKU?.trim() || "",
  shippingInfo: shippingInfo || {},
  specifications: specifications || {},
  isFeatured: isFeatured ?? false
});

const safeProduct = product.toObject();

delete safeProduct.costPrice;

res.status(201).json({
  success: true,
  message: "Product created successfully",
  product: safeProduct
});

} catch (error) {
console.error("Create product error:", error);

res.status(500).json({
  success: false,
  message: "Unable to create product"
});

}
};

// GET ALL PUBLIC PRODUCTS
const getProducts = async (req, res) => {
try {
const {
search,
category,
vendor,
minPrice,
maxPrice,
featured,
page = 1,
limit = 20
} = req.query;

const filter = {
  isActive: true
};

if (search) {
  filter.$text = {
    $search: search
  };
}

if (category) {
  filter.category = category;
}

if (vendor) {
  filter.vendor = vendor;
}

if (minPrice !== undefined || maxPrice !== undefined) {
  filter.price = {};

  if (minPrice !== undefined) {
    filter.price.$gte = Number(minPrice);
  }

  if (maxPrice !== undefined) {
    filter.price.$lte = Number(maxPrice);
  }
}

if (featured === "true") {
  filter.isFeatured = true;
}

const pageNumber = Math.max(Number(page), 1);

const limitNumber = Math.min(
  Math.max(Number(limit), 1),
  100
);

const skip = (pageNumber - 1) * limitNumber;

const [products, total] = await Promise.all([
  Product.find(filter)
    .populate("category", "name slug")
    .populate(
      "vendor",
      "storeName storeSlug status isVerified"
    )
    .select("-costPrice")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean(),

  Product.countDocuments(filter)
]);

res.status(200).json({
  success: true,
  products,
  pagination: {
    page: pageNumber,
    limit: limitNumber,
    total,
    totalPages: Math.ceil(total / limitNumber)
  }
});

} catch (error) {
console.error("Get products error:", error);

res.status(500).json({
  success: false,
  message: "Unable to fetch products"
});

}
};

// GET MY VENDOR PRODUCTS
const getMyVendorProducts = async (req, res) => {
try {
const {
search,
category,
minPrice,
maxPrice,
featured,
active,
page = 1,
limit = 20
} = req.query;

const vendorProfile = await Vendor.findOne({
  user: req.user._id
}).lean();

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

const filter = {
  vendor: vendorProfile._id
};

// By default, vendor dashboard shows active products.
// active=false can be used to view inactive products.
if (active === "false") {
  filter.isActive = false;
} else {
  filter.isActive = true;
}

if (search) {
  filter.$text = {
    $search: search
  };
}

if (category) {
  filter.category = category;
}

if (minPrice !== undefined || maxPrice !== undefined) {
  filter.price = {};

  if (minPrice !== undefined) {
    filter.price.$gte = Number(minPrice);
  }

  if (maxPrice !== undefined) {
    filter.price.$lte = Number(maxPrice);
  }
}

if (featured === "true") {
  filter.isFeatured = true;
}

const pageNumber = Math.max(Number(page), 1);

const limitNumber = Math.min(
  Math.max(Number(limit), 1),
  100
);

const skip = (pageNumber - 1) * limitNumber;

const [products, total] = await Promise.all([
  Product.find(filter)
    .populate("category", "name slug")
    .populate(
      "vendor",
      "storeName storeSlug status isVerified"
    )
    .select("-costPrice")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean(),

  Product.countDocuments(filter)
]);

res.status(200).json({
  success: true,
  products,
  pagination: {
    page: pageNumber,
    limit: limitNumber,
    total,
    totalPages: Math.ceil(total / limitNumber)
  }
});

} catch (error) {
console.error(
"Get my vendor products error:",
error
);

res.status(500).json({
  success: false,
  message: "Unable to fetch your products"
});

}
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
try {
const product = await Product.findOne({
_id: req.params.id,
isActive: true
})
.populate("category", "name slug")
.populate(
"vendor",
"storeName storeSlug status isVerified"
)
.select("-costPrice")
.lean();

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

res.status(200).json({
  success: true,
  product
});

} catch (error) {
console.error("Get product error:", error);

res.status(500).json({
  success: false,
  message: "Unable to fetch product"
});

}
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
try {
const existingProduct = await Product.findById(
req.params.id
);

if (!existingProduct) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

// Vendor ownership check
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
        "You do not have permission to update this product"
    });
  }
}

const allowedFields = [
  "name",
  "slug",
  "description",
  "shortDescription",
  "category",
  "brand",
  "sku",
  "images",
  "price",
  "compareAtPrice",
  "costPrice",
  "currency",
  "stock",
  "lowStockThreshold",
  "isDropshipped",
  "supplier",
  "supplierSKU",
  "shippingInfo",
  "specifications",
  "isFeatured",
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

if (updates.slug !== undefined) {
  updates.slug = updates.slug.toLowerCase().trim();
}

if (updates.sku !== undefined) {
  updates.sku = updates.sku.toUpperCase().trim();
}

if (updates.description !== undefined) {
  updates.description = updates.description.trim();
}

if (updates.shortDescription !== undefined) {
  updates.shortDescription =
    updates.shortDescription.trim();
}

if (updates.brand !== undefined) {
  updates.brand = updates.brand.trim();
}

if (updates.supplierSKU !== undefined) {
  updates.supplierSKU = updates.supplierSKU.trim();
}

if (updates.category !== undefined) {
  const categoryExists = await Category.findById(
    updates.category
  );

  if (!categoryExists) {
    return res.status(400).json({
      success: false,
      message: "Category not found"
    });
  }
}

if (
  updates.slug !== undefined ||
  updates.sku !== undefined
) {
  const duplicateFilter = {
    _id: { $ne: req.params.id },
    $or: []
  };

  if (updates.slug !== undefined) {
    duplicateFilter.$or.push({
      slug: updates.slug
    });
  }

  if (updates.sku !== undefined) {
    duplicateFilter.$or.push({
      sku: updates.sku
    });
  }

  const duplicateProduct = await Product.findOne(
    duplicateFilter
  );

  if (duplicateProduct) {
    return res.status(409).json({
      success: false,
      message:
        "Another product already uses this slug or SKU"
    });
  }
}

const product = await Product.findByIdAndUpdate(
  req.params.id,
  updates,
  {
    new: true,
    runValidators: true
  }
)
  .populate(
    "vendor",
    "storeName storeSlug status isVerified"
  )
  .select("-costPrice")
  .lean();

res.status(200).json({
  success: true,
  message: "Product updated successfully",
  product
});

} catch (error) {
console.error("Update product error:", error);

res.status(500).json({
  success: false,
  message: "Unable to update product"
});

}
};

// SOFT DELETE PRODUCT
const deleteProduct = async (req, res) => {
try {
const existingProduct = await Product.findById(
req.params.id
);

if (!existingProduct) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

// Vendor ownership check
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
        "You do not have permission to remove this product"
    });
  }
}

const product = await Product.findByIdAndUpdate(
  req.params.id,
  {
    isActive: false
  },
  {
    new: true
  }
);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found"
  });
}

res.status(200).json({
  success: true,
  message: "Product removed successfully"
});

} catch (error) {
console.error("Delete product error:", error);

res.status(500).json({
  success: false,
  message: "Unable to remove product"
});

}
};

module.exports = {
createProduct,
getProducts,
getMyVendorProducts,
getProductById,
updateProduct,
deleteProduct
};