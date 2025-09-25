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
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { createAdminProduct, getAdminCategories } from "@/lib/adminApi";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stockQuantity: "",
    sku: "",
    tags: [],
    images: [""],
  });

  useEffect(() => {
    getAdminCategories().then((res) => setCategories(res.data.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const payload = {
      ...formData,
      tags:
        typeof formData.tags === "string"
          ? formData.tags.split(",")
          : formData.tags,
    };
    await toast.promise(createAdminProduct(payload), {
      loading: "Creating product...",
      success: () => {
        router.push("/admin/products");
        return "Product created successfully!";
      },
      error: (err) =>
        err.response?.data?.message || "Failed to create product.",
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <Grid container spacing={3}>
        {/* Left Column: General Info, Pricing, Images */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              General Setup
            </Typography>
            <TextField
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="brand"
              label="Brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
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
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="stockQuantity"
              label="Current Stock"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              fullWidth
              required
            />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Images (URLs)
            </Typography>
            {formData.images.map((img, index) => (
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
              disabled={formData.images.length >= 6}
            >
              Add Another Image
            </Button>
          </Paper>
        </Grid>
        {/* Right Column: Save */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              Save Product
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
