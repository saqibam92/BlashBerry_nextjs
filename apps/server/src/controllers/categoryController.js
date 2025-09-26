// apps/server/src/controllers/categoryController.js

const Category = require("../models/Category");

// Fetches all active categories for public display (e.g., in filters)
exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ priority: 1 })
      .select("name _id");
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
