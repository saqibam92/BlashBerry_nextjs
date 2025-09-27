// apps/client/src/app/(shop)/cart/page.jsx

"use client";
import { useCart } from "@/contexts/CartContext";
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

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();

  if (getCartItemCount() === 0) {
    return (
      <Typography align="center" sx={{ p: 5 }}>
        Your cart is empty.
      </Typography>
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
              sx={{ display: "flex", mb: 2, p: 2 }}
              elevation={2}
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
              <Box sx={{ flexGrow: 1, ml: 2 }}>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography>Size: {item.size}</Typography>
                <Typography>{formatPrice(item.product.price)}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
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
                />
                <IconButton
                  onClick={() => removeFromCart(item.product._id, item.size)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal ({getCartItemCount()} items)</Typography>
              <Typography>{formatPrice(getCartTotal())}</Typography>
            </Box>
            {/* Shipping can be added later */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">
                {formatPrice(getCartTotal())}
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/checkout"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
