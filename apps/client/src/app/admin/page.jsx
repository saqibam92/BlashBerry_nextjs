// File: apps/client/src/spp/(admin)/admin/page.jsx

"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar, // <-- Import Avatar
} from "@mui/material";
import { AttachMoney, ShoppingCart, Group } from "@mui/icons-material";
// You will create this API service in the next steps
// import { getDashboardStats } from '@/lib/adminApi';

// It's good practice to define reusable components outside the main component
const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={3} sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: color, mr: 2, width: 56, height: 56 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // const fetchStats = async () => {
    //   const data = await getDashboardStats();
    //   setStats(data);
    // };
    // fetchStats();

    // Using mock data for now until the admin API is fully connected
    setStats({
      totalSales: 560500,
      totalOrders: 152,
      totalProducts: 78,
      totalUsers: 45,
    });
  }, []);

  if (!stats) {
    // You can add a loading spinner here
    return <p>Loading dashboard...</p>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Business Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={`৳${stats.totalSales.toLocaleString()}`}
            icon={<AttachMoney sx={{ fontSize: 32 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart sx={{ fontSize: 32 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<ShoppingCart sx={{ fontSize: 32 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalUsers}
            icon={<Group sx={{ fontSize: 32 }} />}
            color="error.main"
          />
        </Grid>
        {/* You can add Chart components here in the future */}
      </Grid>
    </Box>
  );
}
