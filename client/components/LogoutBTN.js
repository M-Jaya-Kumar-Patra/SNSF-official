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
export default function LogoutBTN({ onLogout, className = "" }) {
  const { logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleLogoutClick = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    setOpen(false);
    await logout();
    if (onLogout) onLogout();
  };

  return (
    <>
      <button
        type="button"
        className={`h-[50px] w-full flex items-center font-semibold text-red-600 gap-2 pl-[14px] ${className}`}
        onClick={() => setOpen(true)}
      >
        <LogOut size={18} />
        Logout
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button type="button" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            type="button"
            color="error"
            onTouchStart={handleLogoutClick}
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
