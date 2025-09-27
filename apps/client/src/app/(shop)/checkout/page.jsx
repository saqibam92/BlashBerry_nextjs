// apps/client/src/app/(shop)/checkout/page.jsx

"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Container,
} from "@mui/material";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; // Use generic api for checkout
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      products: items,
      shippingAddress: formData,
    };

    const promise = api.post("/api/orders", orderData).then((res) => {
      clearCart();
      router.push(`/order-complete?orderId=${res.data.data.orderNumber}`);
    });

    toast.promise(promise, {
      loading: "Placing your order...",
      success: "Order placed successfully!",
      error: "Failed to place order.",
    });
  };

  return (
    <Container sx={{ py: 5 }} component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <TextField
              name="fullName"
              label="Full Name"
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="address"
              label="Address"
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="city"
              label="City"
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="postalCode"
              label="Postal Code"
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="phone"
              label="Phone Number"
              onChange={handleChange}
              fullWidth
              required
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Order
            </Typography>
            {/* Order Summary */}
            <Typography>Total: {formatPrice(getCartTotal())}</Typography>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Place Order (COD)
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
