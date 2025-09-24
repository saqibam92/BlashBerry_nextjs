// File: apps/server/src/routes/order.js

const express = require("express");
const { body } = require("express-validator");
const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Validation rules
const orderValidation = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products array is required and must not be empty"),
  body("products.*.productId")
    .isMongoId()
    .withMessage("Valid product ID is required"),
  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("shippingAddress.fullName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name is required"),
  body("shippingAddress.address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address is required"),
  body("shippingAddress.city")
    .trim()
    .isLength({ min: 2 })
    .withMessage("City is required"),
  body("shippingAddress.postalCode")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Postal code is required"),
  body("shippingAddress.phone")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
];

// Public routes (guest checkout)
router.post("/", orderValidation, createOrder);

// Protected routes
router.get("/my-orders", protect, getUserOrders);
router.get("/:id", protect, getOrder);

// Admin routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
