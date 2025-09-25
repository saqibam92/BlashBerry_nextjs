// File: apps/client/src/contexts/AuthContexts.js
"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start true to verify session
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const res = await api.get("/api/auth/me");
          dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });
        } catch (err) {
          Cookies.remove("token");
          dispatch({ type: "AUTH_ERROR", payload: "Session expired." });
        }
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, isAdmin = false) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/login";
      const res = await api.post(endpoint, { email, password });
      Cookies.set("token", res.data.token, { expires: 7, secure: true });
      dispatch({ type: "AUTH_SUCCESS", payload: { user: res.data.user } });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    // ... register logic
  };

  const logout = () => {
    Cookies.remove("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
