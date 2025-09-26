// File: apps/server/src/controllers/adminControllers

const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Order = require("../models/Order");
const slugify = require("slugify");
const Banner = require("../models/Banner");

// --- Dashboard Analytics ---
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const totalSalesData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, amount: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales: totalSalesData.length > 0 ? totalSalesData[0].amount : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Category Management ---
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ priority: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.createCategory = async (req, res) => {
  const { name, image, priority, isActive } = req.body;
  if (!name || !image) {
    return res
      .status(400)
      .json({ success: false, message: "Name and image URL are required." });
  }
  try {
    const category = await Category.create({ name, image, priority, isActive });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    // Handles duplicate name error
    res.status(400).json({
      success: false,
      message: "Category name already exists or data is invalid.",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, image, priority, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    category.name = name || category.name;
    category.image = image || category.image;
    category.priority = priority ?? category.priority;
    category.isActive = isActive ?? category.isActive;

    const updatedCategory = await category.save();
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category update failed. Duplicate name may exist.",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    // Safety check: prevent deletion if a product is using this category
    const productCount = await Product.countDocuments({
      category: req.params.id,
    });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category as it is currently in use by products.",
      });
    }
    await category.deleteOne();
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Product Management ---
exports.adminGetProducts = async (req, res) => {
  try {
    const { category, brand, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .populate("category", "name") // Populate category name for display
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.adminGetProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.adminCreateProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- User Management ---
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.adminCreateUser = async (req, res) => {
  const { name, email, password, role, isActive } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, password, and role.",
    });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with that email already exists.",
      });
    }
    const user = await User.create({ name, email, password, role, isActive });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = isActive ?? user.isActive;

    // Only update the password if a new one is provided
    if (password) {
      user.password = password; // The pre-save hook will hash it automatically
    }

    const updatedUser = await user.save();
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User update failed. Email may already be in use.",
    });
  }
};

exports.adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Optional: Prevent the master admin from deleting themselves
    if (user.email === "admin@blashberry.com") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the master admin account.",
      });
    }
    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Order Management ---
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- Banner Management ---
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ priority: 1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner)
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner)
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    await banner.deleteOne();
    res.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- File Upload ---
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }
  // We are storing in /public/uploads/banners, so the accessible URL will be /uploads/banners/[filename]
  const imageUrl = `/uploads/banners/${req.file.filename}`;
  res.json({ success: true, data: { imageUrl } });
};
