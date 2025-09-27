// apps/client/src/app/(shop)/order-complete/page.jsx

"use client";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import Link from "next/link";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function OrderCompletePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <Paper sx={{ p: 4 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "success.main" }} />
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          Thank You For Your Order!
        </Typography>
        <Typography>
          Your order number is: <strong>{orderId}</strong>
        </Typography>
        <Typography sx={{ my: 2 }}>
          We have received your order and will begin processing it shortly.
        </Typography>
        <Button component={Link} href="/" variant="contained">
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
}
