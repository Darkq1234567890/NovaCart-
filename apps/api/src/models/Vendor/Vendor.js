const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    storeSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },

    logo: {
      type: String,
      trim: true,
      default: ""
    },

    banner: {
      type: String,
      trim: true,
      default: ""
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: ""
    },

    businessName: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ""
    },

    businessType: {
      type: String,
      enum: [
        "individual",
        "sole_proprietorship",
        "partnership",
        "private_limited",
        "llp",
        "other"
      ],
      default: "individual"
    },

    gstNumber: {
      type: String,
      uppercase: true,
      trim: true,
      default: ""
    },

    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      default: ""
    },

    address: {
      addressLine1: {
        type: String,
        trim: true,
        default: ""
      },

      addressLine2: {
        type: String,
        trim: true,
        default: ""
      },

      city: {
        type: String,
        trim: true,
        default: ""
      },

      state: {
        type: String,
        trim: true,
        default: ""
      },

      postalCode: {
        type: String,
        trim: true,
        default: ""
      },

      country: {
        type: String,
        trim: true,
        default: "India"
      }
    },

    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
        default: ""
      },

      accountNumber: {
        type: String,
        trim: true,
        default: "",
        select: false
      },

      ifscCode: {
        type: String,
        uppercase: true,
        trim: true,
        default: ""
      },

      bankName: {
        type: String,
        trim: true,
        default: ""
      }
    },

    commissionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 10
    },

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "suspended",
        "rejected"
      ],
      default: "pending",
      index: true
    },

    kycStatus: {
      type: String,
      enum: [
        "pending",
        "submitted",
        "verified",
        "rejected"
      ],
      default: "pending",
      index: true
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },

    totalSales: {
      type: Number,
      min: 0,
      default: 0
    },

    totalOrders: {
      type: Number,
      min: 0,
      default: 0
    },

    totalProducts: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vendor", vendorSchema);