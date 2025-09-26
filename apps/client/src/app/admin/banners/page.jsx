// apps/client/src/app/admin/banners/page.jsx

"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  uploadBannerImage,
} from "@/lib/adminApi";
import toast from "react-hot-toast";

// Reusable Form in a Dialog
const BannerForm = ({ open, onClose, onSave, banner }) => {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    priority: 10,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData(banner || { title: "", link: "", priority: 10, image: "" });
  }, [banner]);

  const handleSave = async () => {
    let imageUrl = formData.image;
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      setUploading(true);
      try {
        const res = await uploadBannerImage(uploadFormData);
        imageUrl = res.data.data.imageUrl;
      } catch (error) {
        toast.error("Image upload failed!");
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    onSave({ ...formData, image: imageUrl });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{banner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextField
          label="Link URL (Optional)"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
        <TextField
          label="Priority (lower is higher)"
          type="number"
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
        />
        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Button>
        {imageFile && (
          <Typography variant="caption">{imageFile.name}</Typography>
        )}
        {!imageFile && formData.image && (
          <Avatar
            src={formData.image}
            variant="rounded"
            sx={{ width: 100, height: 50 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={uploading}>
          {uploading ? (
            <CircularProgress size={24} />
          ) : banner ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Page
export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchBanners = () =>
    getAdminBanners().then((res) => setBanners(res.data.data));
  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSave = async (data) => {
    const apiCall = selectedBanner
      ? updateAdminBanner(selectedBanner._id, data)
      : createAdminBanner(data);
    await toast.promise(apiCall, {
      loading: "Saving banner...",
      success: "Banner saved!",
      error: "Failed to save banner.",
    });
    fetchBanners();
    setOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Banner Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedBanner(null);
            setOpen(true);
          }}
        >
          Add Banner
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          {/* TableHead and TableBody to list banners with Edit/Delete buttons */}
        </Table>
      </TableContainer>
      <BannerForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        banner={selectedBanner}
      />
    </Box>
  );
}
