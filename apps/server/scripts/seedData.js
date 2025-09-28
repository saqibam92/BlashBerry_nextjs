const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// Correctly load environment variables from the root .env.local file
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const User = require("../src/models/User");
const Product = require("../src/models/Product");
const Order = require("../src/models/Order"); // Import Order model
const Category = require("../src/models/Category");

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

const seedCategory = async () => {
  try {
    const categories = [
      // {
      //   name: "Bras",
      //   image:
      //     "https://images.unsplash.com/photo-1585148710999-3899134a9488?q=80&w=1887&auto=format&fit=crop",
      //   priority: 1,
      //   isActive: true,
      // },
      {
        name: "Panties",
        image:
          "https://images.unsplash.com/photo-1619138443907-6e5b5311e2f7?q=80&w=1887&auto=format&fit=crop",
        priority: 2,
        isActive: true,
      },
      {
        name: "Lingerie Sets",
        image:
          "https://images.unsplash.com/photo-1631896847798-a0353a25f7a0?q=80&w=1887&auto=format&fit=crop",
        priority: 3,
        isActive: true,
      },
      {
        name: "Sleepwear",
        image:
          "https://images.unsplash.com/photo-1594396539202-a7b6860f3d9d?q=80&w=1887&auto=format&fit=crop",
        priority: 4,
        isActive: true,
      },
      {
        name: "Slips & Babydolls",
        image:
          "https://images.unsplash.com/photo-1605353151433-72c0693a4a9c?q=80&w=1887&auto=format&fit=crop",
        priority: 5,
        isActive: true,
      },
      {
        name: "Bodysuits",
        image:
          "https://images.unsplash.com/photo-1617489422185-3d5f87b8f0d2?q=80&w=1887&auto=format&fit=crop",
        priority: 6,
        isActive: true,
      },
      {
        name: "Robes",
        image:
          "https://images.unsplash.com/photo-1616859516347-8a4e3a4e4e4d?q=80&w=1887&auto=format&fit=crop",
        priority: 7,
        isActive: true,
      },
      {
        name: "Corsets & Bustiers",
        image:
          "https://images.unsplash.com/photo-1597821689219-913a0518c1b3?q=80&w=1887&auto=format&fit=crop",
        priority: 8,
        isActive: true,
      },
      {
        name: "Shapewear",
        image:
          "https://images.unsplash.com/photo-1620921201900-538a7c2e0bca?q=80&w=1887&auto=format&fit=crop",
        priority: 9,
        isActive: true,
      },
      {
        name: "Hosiery & Garters",
        image:
          "https://images.unsplash.com/photo-1599855131526-3a7a4f913611?q=80&w=1887&auto=format&fit=crop",
        priority: 10,
        isActive: true,
      },
      {
        name: "Bridal Lingerie",
        image:
          "https://images.unsplash.com/photo-1591547900488-80e1c12ab995?q=80&w=1887&auto=format&fit=crop",
        priority: 11,
        isActive: true,
      },
      {
        name: "Accessories",
        image:
          "https://images.unsplash.com/photo-1594939235976-92c206f3ed1b?q=80&w=1887&auto=format&fit=crop",
        priority: 12,
        isActive: true,
      },
    ];

    await Category.insertMany(categories);
    console.log("Categories seeded successfully");
  } catch (error) {
    console.log(error);
  }
};

// const seedUsers = async () => {
//   try {
//     await User.deleteMany();

//     // Create Master Admin
//     const adminUser = new User({
//       name: "Master Admin",
//       email: "admin@blashberry.com",
//       password: "adminpassword", // This will be hashed on save
//       role: "admin",
//       provider: "local",
//     });
//     await adminUser.save();
//     console.log("Master Admin created successfully.");

//     // Create Test User
//     const testUser1 = new User({
//       name: "Test User ",
//       email: "test1@example.com",
//       password: "testpassword", // This will be hashed on save
//       role: "user",
//       provider: "local",
//     });
//     await testUser1.save();
//     console.log("Test User 1 created successfully.");
//     // Create Test User
//     const testUser2 = new User({
//       name: "Test User 2",
//       email: "test2@example.com",
//       password: "testpassword", // This will be hashed on save
//       role: "user",
//       provider: "local",
//     });
//     await testUser2.save();
//     console.log("Test User 2 created successfully.");
//     // Create Test User
//     const testUser3 = new User({
//       name: "Test User 3",
//       email: "test3@example.com",
//       password: "testpassword", // This will be hashed on save
//       role: "user",
//       provider: "local",
//     });
//     await testUser3.save();
//     console.log("Test User 3 created successfully.");
//     // Create Test User
//     const testUser4 = new User({
//       name: "Test User 4",
//       email: "test4@example.com",
//       password: "testpassword", // This will be hashed on save
//       role: "user",
//       provider: "local",
//     });
//     await testUser4.save();
//     console.log("Test User created successfully.");

//     // const users = [
//     //   {
//     //     name: "Master Admin",
//     //     email: "admin@blashberry.com",
//     //     password: "adminpassword", // Use a strong password in production
//     //     role: "admin",
//     //     provider: "local",
//     //   },
//     //   {
//     //     name: "Test User 1",
//     //     email: "test1@example.com",
//     //     password: "testpassword1",
//     //     role: "user",
//     //     provider: "local",
//     //   },
//     //   {
//     //     name: "Test User 2",
//     //     email: "test2@example.com",
//     //     password: "testpassword2",
//     //     role: "user",
//     //     provider: "local",
//     //   },
//     //   {
//     //     name: "Test User 3",
//     //     email: "test3@example.com",
//     //     password: "testpassword3",
//     //     role: "user",
//     //     provider: "local",
//     //   },
//     // ];

//     // Using insertMany to hash passwords via the pre-save hook
//     // await User.insertMany(users);

//     // console.log("Master Admin and Test User created successfully.");
//   } catch (error) {
//     console.error("Error seeding users:", error);
//   }
// };

// const seedUsers = async () => {
//   try {
//     await User.deleteMany();

//     const users = [
//       {
//         name: "Admin User",
//         email: "admin@blashberry.com",
//         password: "admin123", // Password will be hashed by the pre-save hook
//         role: "admin",
//         provider: "local",
//       },
//       {
//         name: "Test User",
//         email: "test@example.com",
//         password: "test123", // Password will be hashed by the pre-save hook
//         role: "user",
//         provider: "local",
//       },
//     ];

//     await User.insertMany(users);
//     console.log("Users seeded successfully");
//   } catch (error) {
//     console.error("Error seeding users:", error);
//   }
// };

// const seedProducts = async () => {
//   try {
//     await Product.deleteMany();

//     const products = [
//       {
//         name: "Classic Cotton T-Shirt",
//         slug: "classic-cotton-t-shirt",
//         description:
//           "A comfortable and breathable cotton t-shirt perfect for everyday wear.",
//         price: 599,
//         category: "T-Shirts",
//         sizes: ["S", "M", "L", "XL"],
//         rating: 4.5,
//         images: [
//           "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
//           "https://plus.unsplash.com/premium_photo-1718913931807-4da5b5dd27fa?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
//         ],
//         stockQuantity: 50,
//         isFeatured: true,
//       },
//       {
//         name: "Premium Hoodie",
//         slug: "premium-hoodie",
//         description: "Warm and cozy hoodie made from premium materials.",
//         price: 1299,
//         category: "Hoodies",
//         sizes: ["S", "M", "L", "XL"],
//         rating: 4.8,
//         images: [
//           "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
//           "https://images.unsplash.com/photo-1619183036291-4dbe7854a859?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         ],
//         stockQuantity: 30,
//         isFeatured: true,
//       },
//       {
//         name: "Denim Jeans",
//         slug: "denim-jeans",
//         description: "Classic blue denim jeans with a comfortable fit.",
//         price: 1899,
//         category: "Jeans",
//         sizes: ["S", "M", "L", "XL"],
//         rating: 4.3,
//         images: [
//           "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
//           "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
//         ],
//         stockQuantity: 25,
//       },
//       {
//         name: "Summer Dress",
//         slug: "summer-dress",
//         description: "Light and airy summer dress perfect for warm weather.",
//         price: 1599,
//         category: "Dresses",
//         sizes: ["S", "M", "L", "XL"],
//         rating: 4.6,
//         images: [
//           "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
//           "https://images.unsplash.com/photo-1736290533821-178f8a1608ff?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
//         ],
//         stockQuantity: 20,
//         isFeatured: true,
//       },
//       {
//         name: "Casual Sneakers",
//         slug: "casual-sneakers",
//         description: "Comfortable casual sneakers for everyday activities.",
//         price: 2299,
//         category: "Shoes",
//         // Corrected sizes to match a flexible schema
//         sizes: ["38", "39", "40", "41", "42", "43"],
//         rating: 4.4,
//         images: [
//           "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
//           "https://images.unsplash.com/photo-1736555142217-916540c7f1b7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
//         ],
//         stockQuantity: 40,
//       },
//       {
//         name: "Leather Jacket",
//         slug: "leather-jacket",
//         description: "Stylish leather jacket for a classic look.",
//         price: 4999,
//         category: "Jackets",
//         sizes: ["S", "M", "L", "XL"],
//         rating: 4.7,
//         images: [
//           "https://images.unsplash.com/photo-1553640662-9ab20b8fa2ea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400",
//           "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
//         ],
//         stockQuantity: 15,
//         isFeatured: true,
//       },
//     ];

//     await Product.insertMany(products);
//     console.log("Products seeded successfully");
//   } catch (error) {
//     console.error("Error seeding products:", error.message);
//   }
// };

const seedData = async () => {
  await connectDB();
  // await seedUsers();
  await seedCategory();
  // await seedProducts();
  // await Order.deleteMany(); // Also clear previous orders
  console.log("Database seeding completed!");
  mongoose.connection.close();
};

seedData();
