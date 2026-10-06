const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
      index: true
    },

    brand: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ""
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },

    images: [
      {
        type: String,
        trim: true
      }
    ],

    price: {
      type: Number,
      required: true,
      min: 0
    },

    compareAtPrice: {
      type: Number,
      min: 0,
      default: null
    },

    costPrice: {
      type: Number,
      min: 0,
      default: null,
      select: false
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    lowStockThreshold: {
      type: Number,
      min: 0,
      default: 5
    },

    isDropshipped: {
      type: Boolean,
      default: false,
      index: true
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null
    },

    supplierSKU: {
      type: String,
      trim: true,
      default: ""
    },

    shippingInfo: {
      estimatedDays: {
        type: Number,
        min: 0,
        default: 7
      },

      shippingCost: {
        type: Number,
        min: 0,
        default: 0
      }
    },

    specifications: {
      type: Map,
      of: String,
      default: {}
    },

    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },

      count: {
        type: Number,
        min: 0,
        default: 0
      }
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({
  name: "text",
  description: "text",
  brand: "text"
});

module.exports = mongoose.model("Product", productSchema);