"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token,
          user: JSON.parse(user),
        },
      });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: "LOGIN_START" });

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({
        type: "LOGIN_ERROR",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "LOGIN_START" });

      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({
        type: "LOGIN_ERROR",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
