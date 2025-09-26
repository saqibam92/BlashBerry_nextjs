// File: apps/client/src/components/admin/CategoryCreator.jsx

"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { createAdminCategory } from "@/lib/adminApi";
import toast from "react-hot-toast";

export default function CategoryCreator({ open, onClose, onCategoryCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    priority: 10,
  });

  const handleSave = async () => {
    await toast.promise(createAdminCategory(formData), {
      loading: "Creating category...",
      success: (res) => {
        onCategoryCreated(res.data.data); // Pass the new category back
        onClose();
        return "Category created!";
      },
      error: "Failed to create category.",
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Category</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          label="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
