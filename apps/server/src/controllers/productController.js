// File: apps/server/src/controllers/productController.js

const Category = require("../models/Category");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
  try {
    const {
      category,
      size,
      minPrice,
      maxPrice,
      rating,
      sort = "createdAt",
      page = 1,
      limit = 12,
      search,
    } = req.query;

    // Build query object
    let query = { isActive: true };

    // If a category query parameter exists, split it by commas and use the $in operator.
    if (category) {
      query.category = { $in: category.split(",") };
    }
    if (size) query.sizes = { $in: [size] };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) {
      // Use a regex for partial matching on the search page
      query.name = { $regex: search, $options: "i" };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case "price_asc":
        sortObj.price = 1;
        break;
      case "price_desc":
        sortObj.price = -1;
        break;
      case "rating":
        sortObj.rating = -1;
        break;
      case "newest":
        sortObj.createdAt = -1;
        break;
      default:
        sortObj.createdAt = -1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --- FUNCTION FOR LIVE SEARCH ---
const searchProducts = async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.find({
      name: { $regex: term, $options: "i" }, // Case-insensitive regex search
      isActive: true,
    }).limit(4); // Limit to 4 results for the dropdown

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single product by slug
const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("category", "name"); // --- FIX: Populate the category name ---

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      // isActive: true,
    }).limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get similar products
const getSimilarProducts = async (req, res) => {
  try {
    // --- FIX: Use findOne to get a single product object ---
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product || !product.category) {
      return res
        .status(404)
        .json({ success: false, message: "Product or category not found" });
    }

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }, // Exclude the product itself
      isActive: true,
    })
      .populate("category", "name") // --- FIX: Also populate category for the cards ---
      .limit(4);

    res.json({ success: true, data: similarProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---Create a new review ---
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { slug } = req.params;

  if (!rating || !comment) {
    return res
      .status(400)
      .json({ success: false, message: "Rating and comment are required." });
  }

  try {
    const product = await Product.findOne({ slug });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res
      .status(201)
      .json({ success: true, message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// --- Category Management ---
// const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json({ success: true, data: categories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// --- Get all unique categories from products ---
const getCategories = async (req, res) => {
  try {
    // This is more efficient as it only returns the unique category strings
    const categories = await Product.distinct("category", { isActive: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProduct,
  getFeaturedProducts,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
};
