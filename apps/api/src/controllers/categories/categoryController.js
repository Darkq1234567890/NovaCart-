const Category = require("../../models/Category/Category");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      parentCategory,
      sortOrder
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required"
      });
    }

    const normalizedSlug = slug.toLowerCase().trim();

    const existingCategory = await Category.findOne({
      $or: [
        { name: name.trim() },
        { slug: normalizedSlug }
      ]
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: normalizedSlug,
      description: description?.trim() || "",
      image: image?.trim() || "",
      parentCategory: parentCategory || null,
      sortOrder: sortOrder ?? 0
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create category"
    });
  }
};

// GET ALL ACTIVE CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true
    })
      .populate("parentCategory", "name slug")
      .sort({
        sortOrder: 1,
        name: 1
      })
      .lean();

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch categories"
    });
  }
};

// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isActive: true
    })
      .populate("parentCategory", "name slug")
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch category"
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "slug",
      "description",
      "image",
      "parentCategory",
      "sortOrder",
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

    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }

    if (updates.image !== undefined) {
      updates.image = updates.image.trim();
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update category"
    });
  }
};

// SOFT DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false
      },
      {
        new: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category removed successfully"
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove category"
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};