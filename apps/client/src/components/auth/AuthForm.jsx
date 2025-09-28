// apps / client / src / components / auth / AuthForm.jsx;
"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { Container } from "lucide-react";

export default function AuthForm({ formType, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isRegister = formType === "register";

  return (
    <Container component="main">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              {isRegister ? "Create an Account" : "Sign In"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {isRegister && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : isRegister ? (
                  "Register"
                ) : (
                  "Sign In"
                )}
              </Button>
              {isRegister ? (
                <Typography align="center" variant="body2">
                  Already have an account?{" "}
                  <Link href="/login" style={{ textDecoration: "underline" }}>
                    Sign In
                  </Link>
                </Typography>
              ) : (
                <Typography align="center" variant="body2">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    style={{ textDecoration: "underline" }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
