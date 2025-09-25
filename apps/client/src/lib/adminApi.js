// File: apps/client/src/lib/adminApi.js

import api from "./api";

// --- CATEGORY APIS ---
export const getAdminCategories = () => api.get("/api/admin/categories");
export const createAdminCategory = (data) =>
  api.post("/api/admin/categories", data);
export const updateAdminCategory = (id, data) =>
  api.put(`/api/admin/categories/${id}`, data);
export const deleteAdminCategory = (id) =>
  api.delete(`/api/admin/categories/${id}`);

// --- PRODUCT APIS ---
export const getAdminProducts = (filters = {}) =>
  api.get("/api/admin/products", { params: filters });
export const getAdminBrands = () => api.get("/api/admin/brands"); // We'll need to create this simple endpoint
export const createAdminProduct = (data) =>
  api.post("/api/admin/products", data);
export const updateAdminProduct = (id, data) =>
  api.put(`/api/admin/products/${id}`, data);
export const deleteAdminProduct = (id) =>
  api.delete(`/api/admin/products/${id}`);

// --- USER APIS ---
export const getAdminUsers = () => api.get("/api/admin/users");
export const createAdminUser = (data) => api.post("/api/admin/users", data);
export const updateAdminUser = (id, data) =>
  api.put(`/api/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/api/admin/users/${id}`);

// --- ORDER APIS ---
export const getAdminOrders = () => api.get("/api/admin/orders");
export const updateAdminOrderStatus = (id, status) =>
  api.put(`/api/admin/orders/${id}/status`, { status });
