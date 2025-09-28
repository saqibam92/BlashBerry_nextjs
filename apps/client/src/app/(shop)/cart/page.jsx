// apps/client/src/app/(shop)/cart/page.jsx
"use client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  TextField,
  Divider,
  Container,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      router.push("/login?redirect=/checkout"); // Redirect to login, then to checkout
    }
  };

  if (getCartItemCount() === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Button component={Link} href="/products" variant="contained">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper
              key={`${item.product._id}-${item.size}`}
              sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
              elevation={2}
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <Box sx={{ flexGrow: 1, ml: 2 }}>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography color="text.secondary">
                  Size: {item.size}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {formatPrice(item.product.price)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.product._id,
                      item.size,
                      parseInt(e.target.value)
                    )
                  }
                  sx={{ width: "70px" }}
                  inputProps={{ min: 1 }}
                  size="small"
                />
                <IconButton
                  onClick={() => removeFromCart(item.product._id, item.size)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: "100px" }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Subtotal ({getCartItemCount()} items)</Typography>
              <Typography>{formatPrice(getCartTotal())}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {formatPrice(getCartTotal())}
              </Typography>
            </Box>
            <Button
              onClick={handleCheckout}
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
