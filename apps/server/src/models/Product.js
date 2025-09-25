// File: apps/server/src/models/Product.js

const mongoose = require("mongoose");

// Define the Review Schema first
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    images: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length > 0 && val.length <= 6,
        "Must have between 1 and 6 images",
      ],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },

    // --- NEW FIELDS based on Product-Add.png ---
    brand: { type: String, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    tags: [{ type: String, trim: true }],
    discount: {
      discountType: {
        type: String,
        enum: ["percent", "fixed"],
        default: "fixed",
      },
      discountAmount: { type: Number, default: 0 },
    },
    colors: [{ type: String, trim: true }],
    unit: { type: String, default: "pc" },
    // --- END OF NEW FIELDS ---

    sizes: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug from name before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1, rating: -1 });

module.exports = mongoose.model("Product", productSchema);
