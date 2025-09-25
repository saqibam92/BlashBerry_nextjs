// File: apps / server / src / routes / admin.js;

const express = require("express");
const { protect, admin } = require("../middleware/auth");
const {
  getDashboardStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getOrders,
  updateOrderStatus,
  getUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} = require("../controllers/adminController");

const router = express.Router();
router.use(protect, admin); // Apply middleware to all admin routes

// Dashboard
router.get("/stats", getDashboardStats);

// Category Routes
router.route("/categories").get(getCategories).post(createCategory);
router.route("/categories/:id").put(updateCategory).delete(deleteCategory);

// Product Routes
router.route("/products").get(adminGetProducts).post(adminCreateProduct);
router
  .route("/products/:id")
  .put(adminUpdateProduct)
  .delete(adminDeleteProduct);

// User Routes
router.route("/users").get(getUsers).post(adminCreateUser);

router.route("/users/:id").put(adminUpdateUser).delete(adminDeleteUser);

// Order Routes
router.route("/orders").get(getOrders);
router.route("/orders/:id/status").put(updateOrderStatus);

module.exports = router;
