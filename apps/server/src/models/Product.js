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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    // --- CHANGE: imageUrl is now an array of images ---
    images: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length > 0 && val.length <= 6,
        "Product must have between 1 and 6 images",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    sizes: [{ type: String }],
    // --- CHANGE: rating is now calculated from the reviews array ---
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema], // --- NEW: Embed reviews in the product ---
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1, rating: -1 });

module.exports = mongoose.model("Product", productSchema);
