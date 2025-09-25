// File: apps/client/src/spp//admin/categories/page.jsx

"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/lib/adminApi";
import toast from "react-hot-toast";

export default function CategorySetupPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    priority: 10,
  });
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAdminCategories();
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiCall = editId
      ? updateAdminCategory(editId, formData)
      : createAdminCategory(formData);

    await toast.promise(apiCall, {
      loading: `${editId ? "Updating" : "Creating"} category...`,
      success: (res) => {
        resetForm();
        fetchCategories(); // Refresh the list
        return `Category ${editId ? "updated" : "created"} successfully!`;
      },
      error: (err) =>
        err.response?.data?.message ||
        `Failed to ${editId ? "update" : "create"} category.`,
    });
  };

  const handleEdit = (category) => {
    window.scrollTo(0, 0); // Scroll to top to see the form
    setEditId(category._id);
    setFormData({
      name: category.name,
      image: category.image,
      priority: category.priority,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      await toast.promise(deleteAdminCategory(id), {
        loading: "Deleting category...",
        success: () => {
          fetchCategories();
          return "Category deleted successfully!";
        },
        error: (err) =>
          err.response?.data?.message || "Failed to delete category.",
      });
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const payload = { isActive: !currentStatus };
    await toast.promise(updateAdminCategory(id, payload), {
      loading: "Updating status...",
      success: () => {
        // Optimistically update UI to feel faster
        setCategories((cats) =>
          cats.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
        );
        return "Status updated successfully!";
      },
      error: "Failed to update status.",
    });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: "", image: "", priority: 10 });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Category Setup
      </Typography>

      <Card
        component="form"
        onSubmit={handleSubmit}
        sx={{ mb: 4 }}
        elevation={3}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">
            {editId ? "Edit Category" : "Add New Category"}
          </Typography>
          <TextField
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Priority"
            name="priority"
            type="number"
            value={formData.priority}
            onChange={handleInputChange}
          />
          <Box sx={{ alignSelf: "flex-end" }}>
            {editId && (
              <Button onClick={resetForm} sx={{ mr: 2 }}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained">
              {editId ? "Update" : "Submit"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Category List
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat, index) => (
                <TableRow key={cat._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar src={cat.image} alt={cat.name} variant="rounded" />
                  </TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.priority}</TableCell>
                  <TableCell>
                    <Switch
                      checked={cat.isActive}
                      onChange={() => handleStatusToggle(cat._id, cat.isActive)}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <IconButton onClick={() => handleEdit(cat)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(cat._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
