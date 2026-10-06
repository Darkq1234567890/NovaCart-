const Vendor = require("../../models/Vendor/Vendor");
const User = require("../../models/User/User");

// CREATE VENDOR
const createVendor = async (req, res) => {
  try {
    const {
      user,
      storeName,
      storeSlug,
      description,
      logo,
      banner,
      phone,
      email,
      businessName,
      businessType,
      gstNumber,
      panNumber,
      address,
      commissionRate
    } = req.body;

    if (!user || !storeName || !storeSlug) {
      return res.status(400).json({
        success: false,
        message: "User, store name and store slug are required"
      });
    }

    const userExists = await User.findById(user);

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    if (userExists.role !== "vendor") {
      return res.status(400).json({
        success: false,
        message: "The selected user must have the vendor role"
      });
    }

    const normalizedSlug = storeSlug.toLowerCase().trim();

    const existingVendor = await Vendor.findOne({
      $or: [
        { user },
        { storeSlug: normalizedSlug }
      ]
    });

    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message:
          "A vendor profile already exists for this user or store slug"
      });
    }

    const vendor = await Vendor.create({
      user,
      storeName: storeName.trim(),
      storeSlug: normalizedSlug,
      description: description?.trim() || "",
      logo: logo?.trim() || "",
      banner: banner?.trim() || "",
      phone: phone?.trim() || "",
      email: email?.toLowerCase().trim() || "",
      businessName: businessName?.trim() || "",
      businessType: businessType || "individual",
      gstNumber: gstNumber?.toUpperCase().trim() || "",
      panNumber: panNumber?.toUpperCase().trim() || "",
      address: address || {},
      commissionRate:
        commissionRate !== undefined
          ? commissionRate
          : 10
    });

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor
    });
  } catch (error) {
    console.error("Create vendor error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create vendor"
    });
  }
};

// GET ALL VENDORS
const getVendors = async (req, res) => {
  try {
    const {
      status,
      kycStatus,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (kycStatus) {
      filter.kycStatus = kycStatus;
    }

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.min(
      Math.max(Number(limit), 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const [vendors, total] = await Promise.all([
      Vendor.find(filter)
        .populate("user", "name email phone role status")
        .select("-bankDetails.accountNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Vendor.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      vendors,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error("Get vendors error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch vendors"
    });
  }
};

// GET SINGLE VENDOR
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate(
        "user",
        "name email phone role status"
      )
      .select("-bankDetails.accountNumber")
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    res.status(200).json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error("Get vendor error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch vendor"
    });
  }
};

// GET MY VENDOR PROFILE
const getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      user: req.user._id
    })
      .populate(
        "user",
        "name email phone role status"
      )
      .select("-bankDetails.accountNumber")
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error(
      "Get my vendor profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch your vendor profile"
    });
  }
};

// UPDATE VENDOR
const updateVendor = async (req, res) => {
  try {
    const allowedFields = [
      "storeName",
      "storeSlug",
      "description",
      "logo",
      "banner",
      "phone",
      "email",
      "businessName",
      "businessType",
      "gstNumber",
      "panNumber",
      "address",
      "bankDetails",
      "commissionRate",
      "status",
      "kycStatus",
      "isVerified"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.storeName !== undefined) {
      updates.storeName = updates.storeName.trim();
    }

    if (updates.storeSlug !== undefined) {
      updates.storeSlug =
        updates.storeSlug.toLowerCase().trim();
    }

    if (updates.description !== undefined) {
      updates.description =
        updates.description.trim();
    }

    if (updates.logo !== undefined) {
      updates.logo = updates.logo.trim();
    }

    if (updates.banner !== undefined) {
      updates.banner = updates.banner.trim();
    }

    if (updates.phone !== undefined) {
      updates.phone = updates.phone.trim();
    }

    if (updates.email !== undefined) {
      updates.email =
        updates.email.toLowerCase().trim();
    }

    if (updates.businessName !== undefined) {
      updates.businessName =
        updates.businessName.trim();
    }

    if (updates.gstNumber !== undefined) {
      updates.gstNumber =
        updates.gstNumber.toUpperCase().trim();
    }

    if (updates.panNumber !== undefined) {
      updates.panNumber =
        updates.panNumber.toUpperCase().trim();
    }

    if (updates.storeSlug !== undefined) {
      const duplicateVendor = await Vendor.findOne({
        _id: { $ne: req.params.id },
        storeSlug: updates.storeSlug
      });

      if (duplicateVendor) {
        return res.status(409).json({
          success: false,
          message:
            "Another vendor already uses this store slug"
        });
      }
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    )
      .populate(
        "user",
        "name email phone role status"
      )
      .select("-bankDetails.accountNumber")
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      vendor
    });
  } catch (error) {
    console.error("Update vendor error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update vendor"
    });
  }
};

// UPDATE VENDOR STATUS
const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "active",
      "suspended",
      "rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor status"
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        status
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate(
        "user",
        "name email phone role status"
      )
      .select("-bankDetails.accountNumber")
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor status updated successfully",
      vendor
    });
  } catch (error) {
    console.error(
      "Update vendor status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update vendor status"
    });
  }
};

// PROMOTE USER TO VENDOR
const promoteUserToVendor = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "vendor") {
      return res.status(409).json({
        success: false,
        message: "User is already a vendor"
      });
    }

    if (
      user.role === "super_admin" ||
      user.role === "admin"
    ) {
      return res.status(400).json({
        success: false,
        message: "Admin users cannot be converted to vendors"
      });
    }

    user.role = "vendor";

    await user.save();

    res.status(200).json({
      success: true,
      message: "User promoted to vendor successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error(
      "Promote user to vendor error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to promote user to vendor"
    });
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  getMyVendorProfile,
  updateVendor,
  updateVendorStatus,
  promoteUserToVendor
};