const Product = require("../../models/Product/Product");
const Category = require("../../models/Category/Category");

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

    if (!name || !slug || !description || !category || !sku || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, slug, description, category, SKU and price are required"
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found"
      });
    }

    const existingProduct = await Product.findOne({
      $or: [
        { slug: slug.toLowerCase().trim() },
        { sku: sku.toUpperCase().trim() }
      ]
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this slug or SKU already exists"
      });
    }

    const product = await Product.create({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim() || "",
      category,
      vendor: vendor || null,
      brand: brand?.trim() || "",
      sku: sku.toUpperCase().trim(),
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

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create product"
    });
  }
};

// GET ALL PRODUCTS
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
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("vendor", "name")
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

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    })
      .populate("category", "name slug")
      .populate("vendor", "name")
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
    const allowedFields = [
      "name",
      "slug",
      "description",
      "shortDescription",
      "category",
      "vendor",
      "brand",
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

    if (updates.brand !== undefined) {
      updates.brand = updates.brand.trim();
    }

    if (updates.supplierSKU !== undefined) {
      updates.supplierSKU = updates.supplierSKU.trim();
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
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
  getProductById,
  updateProduct,
  deleteProduct
};