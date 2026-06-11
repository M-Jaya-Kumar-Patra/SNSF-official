"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AuthPanel from "@/components/AuthPanel";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";

const Page = () => {
  const router = useRouter();
  const alert = useAlert();

  const [showPassword, setShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const storedEmail = localStorage.getItem("adminEmail");

    if (token) router.replace("/");
    if (storedEmail) {
      setFormFields((prev) => ({ ...prev, email: storedEmail }));
    }
  }, [router]);

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

    try {
      const response = await postData("/api/admin/reset-password", formFields);
      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Password changed successfully" });
        localStorage.removeItem("actionType");
        setFormFields({ email: "", newPassword: "", confirmPassword: "" });
        router.push("/login");
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Password reset failed" });
      }
    } catch (error) {
      alert.alertBox({ type: "error", msg: error?.message || "Something went wrong" });
    }
  };

  return (
    <AuthPanel
      title="Reset your password"
      subtitle="Enter a new password for your verified admin email."
      footer={
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-blue-700 hover:text-blue-900"
        >
          Remembered your password? Back to login
        </button>
      }
    >
      <form className="space-y-4" onSubmit={handleChangePassword}>
        <FormControl size="small" fullWidth variant="outlined">
          <InputLabel>New Password</InputLabel>
          <OutlinedInput
            name="newPassword"
            value={formFields.newPassword}
            type={showPassword ? "text" : "password"}
            onChange={onChangeInput}
            label="New Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
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
            type={showPassword ? "text" : "password"}
            onChange={onChangeInput}
            label="Confirm Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700"
        >
          Change Password
        </button>
      </form>
    </AuthPanel>
  );
};

export default Page;
