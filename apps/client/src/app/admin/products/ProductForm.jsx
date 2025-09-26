// File: apps / client / src / app / admin / products / ProductForm.jsx;
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  createAdminProduct,
  updateAdminProduct,
  getAdminCategories,
} from "@/lib/adminApi";
import toast from "react-hot-toast";
import CategoryCreator from "@/components/admin/CategoryCreator";

export default function ProductForm({ productData, isEditMode = false }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stockQuantity: "",
    sizes: "",
    images: [""],
    discount: { discountType: "Fixed", discountAmount: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (isEditMode && productData) {
      // Flatten data for form state
      setFormData({
        ...productData,
        sizes: Array.isArray(productData.sizes)
          ? productData.sizes.join(", ")
          : "",
        category: productData.category?._id || "",
      });
    }
    getAdminCategories().then((res) => setCategories(res.data.data));
  }, [productData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "add-new-category") {
      setIsCategoryModalOpen(true);
    } else {
      handleChange(e);
    }
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setFormData((prev) => ({ ...prev, category: newCategory._id }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    if (formData.images.length < 6) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      sizes:
        typeof formData.sizes === "string"
          ? formData.sizes.split(",").map((s) => s.trim())
          : formData.sizes,
    };

    const apiCall = isEditMode
      ? updateAdminProduct(productData._id, payload)
      : createAdminProduct(payload);

    await toast.promise(apiCall, {
      loading: `${isEditMode ? "Updating" : "Creating"} product...`,
      success: () => {
        router.push("/admin/products");
        return `Product ${isEditMode ? "updated" : "created"}!`;
      },
      error: (err) => err.response?.data?.message || "Operation failed.",
    });
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              General Information
            </Typography>
            <TextField
              name="name"
              label="Product Name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              required
              sx={{ my: 2 }}
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Grouping
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category || ""}
                label="Category"
                onChange={handleCategoryChange}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
                <MenuItem value="add-new-category">
                  <em>+ Create New Category</em>
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="brand"
              label="Brand"
              value={formData.brand || ""}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pricing & Stock
            </Typography>
            <TextField
              name="price"
              label="Unit Price"
              type="number"
              value={formData.price || ""}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            <TextField
              name="stockQuantity"
              label="Stock Quantity"
              type="number"
              value={formData.stockQuantity || ""}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            <TextField
              name="sizes"
              label="Sizes (comma separated)"
              value={formData.sizes || ""}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Images (Up to 6 URLs)
            </Typography>
            {formData.images?.map((img, index) => (
              <TextField
                key={index}
                label={`Image URL ${index + 1}`}
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                fullWidth
                required
                sx={{ mb: 1 }}
              />
            ))}
            <Button
              onClick={addImageField}
              disabled={formData.images?.length >= 6}
            >
              Add Another Image
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: "sticky", top: "80px" }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEditMode ? (
                "Update Product"
              ) : (
                "Save Product"
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <CategoryCreator
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </Box>
  );
}
