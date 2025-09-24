// File: apps/client/src/components/ui/LoginPromptDialog.jsx

"use client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

export default function LoginPromptDialog({ open, onClose }) {
  const router = useRouter();

  const handleLoginRedirect = () => {
    onClose();
    router.push("/auth/login");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Authentication Required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You need to be logged in to perform this action. Please log in or
          create an account to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleLoginRedirect} variant="contained">
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
