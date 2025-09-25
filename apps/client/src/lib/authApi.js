// File: apps/client/src/lib/authApi.js

import api from "./api";

export const loginUser = (credentials) =>
  api.post("/api/auth/login", credentials);
export const registerUser = (userData) =>
  api.post("/api/auth/register", userData);
export const adminLoginUser = (credentials) =>
  api.post("/api/auth/admin/login", credentials);
export const getMe = () => api.get("/api/auth/me");
