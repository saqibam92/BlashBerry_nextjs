const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: "./.env.local" });

const connectDB = require("./config/database");

// Route imports
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const categoryRoutes = require("./routes/category");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// 1. Core Security & CORS

// 1. Define your list of allowed origins (whitelist)
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3005",
];

// 2. Core Security & CORS Configuration (MUST COME FIRST)
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(
          new Error(
            "The CORS policy for this site does not allow access from your origin."
          ),
          false
        );
      }
    },
    credentials: true,
  })
);

// 3. Rate Limiting (comes AFTER CORS)
// This is important because it allows OPTIONS preflight requests to pass without being rate-limited.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit is safer for development and initial testing
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 4. Body Parsers & Logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// 5. API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BlashBerry API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 BlashBerry server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
