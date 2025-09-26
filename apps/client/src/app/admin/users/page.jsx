// apps/client/src/app/admin/users/page.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

// Reusable Form Component for Creating/Editing Users
const UserForm = ({ open, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Populate form when 'user' prop changes (for editing)
    setFormData(
      user || {
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
      }
    );
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    const payload = { ...formData };
    // Don't send an empty password field when editing
    if (user?._id && !payload.password) {
      delete payload.password;
    }
    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{user?._id ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        <TextField
          name="name"
          label="Full Name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
        <TextField
          name="email"
          label="Email Address"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          placeholder={user?._id ? "Leave blank to keep unchanged" : ""}
          onChange={handleChange}
          required={!user?._id}
        />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role || "user"}
            label="Role"
            onChange={handleChange}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              name="isActive"
              checked={formData.isActive || false}
              onChange={handleChange}
            />
          }
          label="Active Status"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {user?._id ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Page Component
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers();
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = async (userData) => {
    const apiCall = selectedUser?._id
      ? updateAdminUser(selectedUser._id, userData)
      : createAdminUser(userData);

    await toast.promise(apiCall, {
      loading: `${selectedUser?._id ? "Updating" : "Creating"} user...`,
      success: () => {
        fetchUsers();
        handleCloseModal();
        return `User ${selectedUser?._id ? "updated" : "created"}!`;
      },
      error: (err) =>
        err.response?.data?.message ||
        `Failed to ${selectedUser?._id ? "update" : "create"} user.`,
    });
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm("Are you sure you want to permanently delete this user?")
    ) {
      await toast.promise(deleteAdminUser(id), {
        loading: "Deleting user...",
        success: "User deleted!",
        error: (err) => err.response?.data?.message || "Failed to delete user.",
      });
      fetchUsers();
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
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Add New User
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteUser(user._id)}
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

      <UserForm
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </Box>
  );
}
