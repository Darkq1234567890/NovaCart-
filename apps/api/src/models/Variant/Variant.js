const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
{
product: {
type: mongoose.Schema.Types.ObjectId,
ref: "Product",
required: true,
index: true
},

name: {
  type: String,
  required: true,
  trim: true,
  maxlength: 200
},

sku: {
  type: String,
  required: true,
  unique: true,
  uppercase: true,
  trim: true,
  index: true
},

attributes: {
  type: Map,
  of: String,
  default: {}
},

price: {
  type: Number,
  min: 0,
  default: null
},

compareAtPrice: {
  type: Number,
  min: 0,
  default: null
},

stock: {
  type: Number,
  min: 0,
  default: 0
},

lowStockThreshold: {
  type: Number,
  min: 0,
  default: 5
},

image: {
  type: String,
  trim: true,
  default: ""
},

isActive: {
  type: Boolean,
  default: true,
  index: true
}

},
{
timestamps: true
}
);

variantSchema.index({
product: 1,
isActive: 1
});

module.exports = mongoose.model("Variant", variantSchema);