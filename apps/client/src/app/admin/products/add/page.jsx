// File: apps/client/src/app/admin/products/add/page.jsx

import ProductForm from "../ProductForm";
import { Box, Typography } from "@mui/material";

export default function AddProductPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Productn
      </Typography>
      <ProductForm />
    </Box>
  );
}
