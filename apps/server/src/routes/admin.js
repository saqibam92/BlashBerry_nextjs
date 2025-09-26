// File: apps / server / src / routes / admin.js;

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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
  adminGetProductById,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadImage,
} = require("../controllers/adminController");

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(
      __dirname,
      "../../../client/public/uploads/banners"
    );
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});
const upload = multer({ storage: storage });

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
  .get(adminGetProductById)
  .put(adminUpdateProduct)
  .delete(adminDeleteProduct);

// User Routes
router.route("/users").get(getUsers).post(adminCreateUser);

router.route("/users/:id").put(adminUpdateUser).delete(adminDeleteUser);

// Order Routes
router.route("/orders").get(getOrders);
router.route("/orders/:id/status").put(updateOrderStatus);

// --- Banner Routes ---
router.route("/banners").get(getBanners).post(createBanner);

router.route("/banners/:id").put(updateBanner).delete(deleteBanner);

// --- File Upload Route ---
router.post("/upload/banner", upload.single("file"), uploadImage);

module.exports = router;
