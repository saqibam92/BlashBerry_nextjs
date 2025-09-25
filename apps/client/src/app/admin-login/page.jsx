// File:apps/client/src/app/admin/admin-login/page.jsx;

"use client";
import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth(); // Get auth state
  const [email, setEmail] = useState("admin@blashberry.com");
  const [password, setPassword] = useState("adminpassword");
  const [loading, setLoading] = useState(false);

  // --- NEW: Redirect if already logged in ---
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin"); // Redirect to dashboard
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { success, error } = await login(email, password, true); // true for admin
    setLoading(false);

    if (success) {
      toast.success("Login successful! Redirecting...");
      router.push("/admin");
    } else {
      toast.error(error || "An unknown error occurred.");
    }
  };

  // Don't render the form if we know the user is already an admin
  if (isAuthenticated && user?.role === "admin") {
    return null; // Or a loading indicator
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Admin Portal Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
