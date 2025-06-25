"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { handleLogout } from "@/utils/logoutHandler";

export default function LogoutBTN() {
  const router = useRouter();
  const { logout } = useAuth();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        className="h-[50px] flex items-center pl-5 font-semibold text-red-600 cursor-pointer gap-2 capitalize"
        onClick={handleClickOpen}
      >
        <LogOut size={18} />
        Logout
      </div>

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
          <Button
            onClick={() => {
              handleLogout({ logout, router });
              setOpen(false);
            }}
            autoFocus
            color="error"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
