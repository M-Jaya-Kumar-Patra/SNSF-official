"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthShell from "@/components/AuthShell";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

export default function ResetPasswordPage() {
  const [formFields, setFormFields] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const alert = useAlert();
  const { isCheckingToken } = useAuth();

  useEffect(() => {
    setIsClient(true);
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) router.push("/");
    setFormFields((prev) => ({ ...prev, email: storedEmail || "" }));
  }, [router]);

  if (isCheckingToken) return <div className="mt-10 text-center">Checking session...</div>;
  if (!isClient) return null;

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const { newPassword, confirmPassword } = formFields;

    if (!newPassword) {
      alert.alertBox({ type: "error", msg: "Please enter new password" });
      return;
    }

    if (!confirmPassword) {
      alert.alertBox({ type: "error", msg: "Confirm your password" });
      return;
    }

    if (newPassword !== confirmPassword) {
      alert.alertBox({ type: "error", msg: "Passwords do not match" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await postData("/api/user/reset-password", formFields, false);
      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Password changed successfully" });
        setFormFields({ newPassword: "", confirmPassword: "", email: "" });
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        router.push("/login");
      } else {
        alert.alertBox({ type: "error", msg: response?.message });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: err?.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Create a new password for your verified SNSF account."
      footer={
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-bold text-slate-950 hover:text-blue-700"
        >
          Remembered your password? Back to Login
        </button>
      }
    >
      <form onSubmit={handleChangePassword} className="space-y-4">
        <FormControl size="small" fullWidth variant="outlined">
          <InputLabel>New Password</InputLabel>
          <OutlinedInput
            name="newPassword"
            value={formFields.newPassword}
            onChange={onChangeInput}
            type={showPassword ? "text" : "password"}
            label="New Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl size="small" fullWidth variant="outlined">
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            name="confirmPassword"
            value={formFields.confirmPassword}
            onChange={onChangeInput}
            type={showPassword ? "text" : "password"}
            label="Confirm Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Change Password"}
        </button>
      </form>
    </AuthShell>
  );
}
