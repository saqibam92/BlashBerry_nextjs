// File: apps/client/src/app/admin/orders/page.jsx

"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import { getAdminOrders, updateAdminOrderStatus } from "@/lib/adminApi";
import { formatDate, formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    getAdminOrders().then((res) => setOrders(res.data.data));
  };

  useEffect(fetchOrders, []);

  const handleStatusChange = async (id, newStatus) => {
    await toast.promise(updateAdminOrderStatus(id, newStatus), {
      loading: "Updating order status...",
      success: "Status updated!",
      error: "Failed to update status.",
    });
    fetchOrders();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>...{order.orderNumber.slice(-12)}</TableCell>
                <TableCell>{order.user?.name || "Guest"}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    size="small"
                  >
                    {statusOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
