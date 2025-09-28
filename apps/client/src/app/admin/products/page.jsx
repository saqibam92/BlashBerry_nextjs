// File: apps/client/src/app/admin/products/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Switch,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import {
  getAdminProducts,
  deleteAdminProduct,
  updateAdminProduct,
  getAdminCategories,
} from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: "", search: "" });

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ]);
      setProducts(productsRes.data.data);
      setFilteredProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = products;
    if (filters.category) {
      result = result.filter((p) => p.category?._id === filters.category);
    }
    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = async (id, field, currentValue) => {
    await toast.promise(updateAdminProduct(id, { [field]: !currentValue }), {
      loading: "Updating...",
      success: "Product updated!",
      error: "Update failed.",
    });
    fetchData(); // Refresh data after toggle
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product permanently?"
      )
    ) {
      await toast.promise(deleteAdminProduct(id), {
        loading: "Deleting...",
        success: "Product deleted!",
        error: "Failed to delete product.",
      });
      fetchData();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Product List</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/admin/products/add")}
        >
          Add New Product
        </Button>
      </Box>

      {/* Filter Section */}
      <Card component={Paper} elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter Products
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  label="Category"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                name="search"
                label="Search by Product Name"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>In stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product._id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={product.images[0]}
                      alt={product.name}
                      variant="rounded"
                      sx={{ mr: 2 }}
                    />
                    {product.name}
                  </Box>
                </TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <Switch
                    checked={product.isFeatured}
                    onChange={() =>
                      handleToggle(
                        product._id,
                        "isFeatured",
                        product.isFeatured
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product.isActive}
                    onChange={() =>
                      handleToggle(product._id, "isActive", product.isActive)
                    }
                  />
                </TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="default"
                    onClick={() => router.push(`/products/${product.slug}`)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      router.push(`/admin/products/edit/${product._id}`)
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
