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
const { body } = require("express-validator");

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
// Validation for CREATING a product (strict)
const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("category").isMongoId().withMessage("A valid category is required."),
  body("stockQuantity")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative number."),
  body("images")
    .isArray({ min: 1, max: 6 })
    .withMessage("Must have between 1 and 6 images."),
  body("images.*").isURL().withMessage("Each image must be a valid URL."),
];

// Validation for UPDATING a product (flexible)
const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty."),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("A valid category is required."),
  // ... add optional validation for other fields as needed
];

// Dashboard
router.get("/stats", getDashboardStats);

// Category Routes
router.route("/categories").get(getCategories).post(createCategory);
router.route("/categories/:id").put(updateCategory).delete(deleteCategory);

// Product Routes
router
  .route("/products")
  .get(adminGetProducts)
  .post(createProductValidation, adminCreateProduct);
router
  .route("/products/:id")
  .get(adminGetProductById)
  .put(updateProductValidation, adminUpdateProduct)
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
