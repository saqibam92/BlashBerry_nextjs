// File: apps/client/src/app/admin/products/edit/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductForm from "../../ProductForm";
import { Box, Typography, CircularProgress } from "@mui/material";
import { getAdminProductById } from "@/lib/adminApi";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getAdminProductById(id)
        .then((res) => setProduct(res.data.data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      <ProductForm productData={product} isEditMode={true} />
    </Box>
  );
}
