// File: apps/client/src/lib/productApi.js

import api from "./api";

/**
 * Fetches featured products from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of featured products.
 */
export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/api/products/featured");
    return response.data.data; // The API returns data nested under a 'data' key
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    // In a real app, you might want to throw the error or return a default value
    return [];
  }
};

/**
 * Fetches all products with optional filtering, sorting, and pagination.
 * @param {object} params - The query parameters for the API call.
 * @param {string} params.category - Filter by category.
 * @param {string} params.size - Filter by size.
 * @param {number} params.minPrice - Minimum price.
 * @param {number} params.maxPrice - Maximum price.
 * @param {number} params.rating - Minimum rating.
 * @param {string} params.sort - Sorting order (e.g., 'price_asc', 'newest').
 * @param {number} params.page - Page number for pagination.
 * @param {number} params.limit - Number of items per page.
 * @param {string} params.search - Search term.
 * @returns {Promise<object>} A promise that resolves to the API response object.
 */
export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get("/api/products", { params });
    return response.data; // Returns the full response with data and pagination
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { data: [], pagination: {} }; // Return a default structure on error
  }
};

/**
 * Fetches a single product by its slug.
 * @param {string} slug - The slug of the product to fetch.
 * @returns {Promise<object|null>} A promise that resolves to the product object or null if not found.
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/products/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch product with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Fetches products similar to the one specified by the slug.
 * @param {string} slug - The slug of the product.
 * @returns {Promise<Array>} A promise that resolves to an array of similar products.
 */
export const getSimilarProducts = async (slug) => {
  try {
    const response = await api.get(`/api/products/${slug}/similar`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch similar products for slug ${slug}:`, error);
    return [];
  }
};

/**
 * Searches for products based on a search term.
 * @param {string} term - The search term.
 * @returns {Promise<Array>} A promise that resolves to an array of matching products.
 */
export const searchProducts = async (term) => {
  if (!term) return [];
  try {
    const response = await api.get("/api/products/search", {
      params: { term },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to search products:", error);
    return [];
  }
};

/**
 * Fetches all active public categories for the filter.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 */
export const getCategories = async () => {
  try {
    // --- FIX: Point to the new, correct public endpoint ---
    const response = await api.get("/api/category/categories");
    return response.data; // The API returns { success: true, data: [...] }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, data: [] };
  }
};

export const getActiveBanners = () => api.get("/api/products/banners/active");
