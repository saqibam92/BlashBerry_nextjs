// src/routes / index.js;

const adminRoutes = require("./admin");
const authRoutes = require("./auth");
const productRoutes = require("./products");
const orderRoutes = require("./orders");
const categoryRoutes = require("./category");
// const publicRoutes = require("./public");

const loadRoutes = (app) => {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "BlashBerry API is running!",
    });
  });

  // Register all API routes
  //   app.use("/api/public", publicRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/category", categoryRoutes);
};

module.exports = { loadRoutes };
