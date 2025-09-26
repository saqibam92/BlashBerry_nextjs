// apps/server/src/routes/category.js

const express = require("express");
const { getPublicCategories } = require("../controllers/categoryController");

const router = express.Router();

// This endpoint is used by the product filter on the shop page
router.get("/categories", getPublicCategories);

module.exports = router;
