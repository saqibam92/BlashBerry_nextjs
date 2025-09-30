const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

// 2. Use a more reliable path to your .env file
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env.local"),
});
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

// CORS configuration
app.use(
  cors({
    origin: "https://blash-berry-nextjs-client.vercel.app", // Your client origin; use '*' for testing but not production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Add more if needed (e.g., for JWT)
    credentials: true, // If using cookies or auth headers
    preflightContinue: false, // Default; handles OPTIONS automatically
    optionsSuccessStatus: 204, // Some browsers need this
  })
);

// 2. Core Security & CORS Configuration (MUST COME FIRST)
app.use(helmet());
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like Postman, mobile apps)
//       if (!origin) return callback(null, true);

//       // --- 3. THE FIX: Don't throw an error, just disallow ---
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from your origin.";
//         // Call the callback with an error object, but let cors handle the response
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

// 3. Rate Limiting (comes AFTER CORS)
// This is important because it allows OPTIONS preflight requests to pass without being rate-limited.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

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
