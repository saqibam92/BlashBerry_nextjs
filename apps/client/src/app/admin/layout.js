//File: apps/client/src/app/admin/layout.jsx;
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard,
  ShoppingCart,
  Category,
  Group,
  Settings,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;
const navItems = [
  { text: "Dashboard", icon: <Dashboard />, href: "/admin" },
  { text: "Products", icon: <ShoppingCart />, href: "/admin/products" },
  { text: "Categories", icon: <Category />, href: "/admin/categories" },
  { text: "Orders", icon: <ShoppingCart />, href: "/admin/orders" },
  { text: "Users", icon: <Group />, href: "/admin/users" },
  { text: "Banners", icon: <Group />, href: "/admin/banners" },
  { text: "Settings", icon: <Settings />, href: "/admin/settings" },
];

// A simple component to show while verifying authentication
const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

export default function AdminLayout({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while the auth state is loading
    if (loading) {
      return;
    }

    // If not authenticated, redirect to the admin login page
    if (!isAuthenticated) {
      router.push("/admin-login");
      return;
    }

    // If authenticated but the user is not an admin, redirect to the home page
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, loading, router]);

  // While loading, or if the user is not a logged-in admin, show the loading screen.
  // This prevents the admin content from flashing on the screen before a redirect.
  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <LoadingScreen />;
  }

  // If everything is fine, render the full admin layout with the page content
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            BlashBerry Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
