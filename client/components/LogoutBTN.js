"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function LogoutBTN({ onLogout }) {
  const { logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogoutClick = async () => {
    console.log("Logout clicked");
    setOpen(false);

    // 🔥 Directly call AuthContext logout (SINGLE source of truth)
    await logout();

    // If parent passed callback
    if (onLogout) onLogout();
  };

  return (
    <>
      <button
        type="button"
        className="h-[50px] w-full flex items-center pl-5 font-semibold text-red-600 cursor-pointer gap-2 capitalize text-left bg-transparent border-none outline-none"
        onClick={handleOpen}
      >
        <LogOut size={18} />
        Logout
      </button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Confirm Logout"}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>

          <Button onClick={handleLogoutClick} autoFocus color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
