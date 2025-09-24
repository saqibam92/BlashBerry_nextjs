const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// Correctly load environment variables from the root .env.local file
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const User = require("../src/models/User");
const Product = require("../src/models/Product");
const Order = require("../src/models/Order"); // Import Order model

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in your .env.local file.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: "Admin User",
        email: "admin@blashberry.com",
        password: "admin123", // Password will be hashed by the pre-save hook
        role: "admin",
        provider: "local",
      },
      {
        name: "Test User",
        email: "test@example.com",
        password: "test123", // Password will be hashed by the pre-save hook
        role: "user",
        provider: "local",
      },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

const seedProducts = async () => {
  try {
    await Product.deleteMany();

    const products = [
      {
        name: "Classic Cotton T-Shirt",
        slug: "classic-cotton-t-shirt",
        description:
          "A comfortable and breathable cotton t-shirt perfect for everyday wear.",
        price: 599,
        category: "T-Shirts",
        sizes: ["S", "M", "L", "XL"],
        rating: 4.5,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          "https://plus.unsplash.com/premium_photo-1718913931807-4da5b5dd27fa?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
        ],
        stockQuantity: 50,
        isFeatured: true,
      },
      {
        name: "Premium Hoodie",
        slug: "premium-hoodie",
        description: "Warm and cozy hoodie made from premium materials.",
        price: 1299,
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL"],
        rating: 4.8,
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
          "https://images.unsplash.com/photo-1619183036291-4dbe7854a859?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ],
        stockQuantity: 30,
        isFeatured: true,
      },
      {
        name: "Denim Jeans",
        slug: "denim-jeans",
        description: "Classic blue denim jeans with a comfortable fit.",
        price: 1899,
        category: "Jeans",
        sizes: ["S", "M", "L", "XL"],
        rating: 4.3,
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
          "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
        ],
        stockQuantity: 25,
      },
      {
        name: "Summer Dress",
        slug: "summer-dress",
        description: "Light and airy summer dress perfect for warm weather.",
        price: 1599,
        category: "Dresses",
        sizes: ["S", "M", "L", "XL"],
        rating: 4.6,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
          "https://images.unsplash.com/photo-1736290533821-178f8a1608ff?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
        ],
        stockQuantity: 20,
        isFeatured: true,
      },
      {
        name: "Casual Sneakers",
        slug: "casual-sneakers",
        description: "Comfortable casual sneakers for everyday activities.",
        price: 2299,
        category: "Shoes",
        // Corrected sizes to match a flexible schema
        sizes: ["38", "39", "40", "41", "42", "43"],
        rating: 4.4,
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
          "https://images.unsplash.com/photo-1736555142217-916540c7f1b7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
        ],
        stockQuantity: 40,
      },
      {
        name: "Leather Jacket",
        slug: "leather-jacket",
        description: "Stylish leather jacket for a classic look.",
        price: 4999,
        category: "Jackets",
        sizes: ["S", "M", "L", "XL"],
        rating: 4.7,
        images: [
          "https://images.unsplash.com/photo-1553640662-9ab20b8fa2ea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        ],
        stockQuantity: 15,
        isFeatured: true,
      },
    ];

    await Product.insertMany(products);
    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error.message);
  }
};

const seedData = async () => {
  await connectDB();
  await seedUsers();
  await seedProducts();
  await Order.deleteMany(); // Also clear previous orders
  console.log("Database seeding completed!");
  mongoose.connection.close();
};

seedData();
