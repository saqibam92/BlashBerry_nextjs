// // File: apps/client/src/lib/api.js

// import axios from "axios";
// import Cookies from "js-cookie"; // Import js-cookie

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
// /**
//  * For production, set NEXT_PUBLIC_API_BASE_URL in .env
//  * Example:
//  * NEXT_PUBLIC_API_BASE_URL=https://blashberry-nextjs.onrender.com
//  */
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       // --- FIX: Read the token from Cookies, not localStorage ---
//       const token = Cookies.get("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         Cookies.remove("token");
//         // Redirect to the appropriate login page
//         if (window.location.pathname.startsWith("/admin")) {
//           window.location.href = "/admin-login";
//         } else {
//           window.location.href = "/login";
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

/*--------------------------- */

import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://blashberry-nextjs.onrender.com");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/admin-login";
        } else {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
