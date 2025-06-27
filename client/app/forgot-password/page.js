"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
 const { isCheckingToken } = useAuth()
    if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail");
      if(!storedEmail){
        router.push("/")
      }
      setFormFields((prev) => ({ ...prev, email: storedEmail || "" }));
    }
  }, []);

  if (!isClient) return null;

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
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
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] h-auto border border-gray-200 rounded-md shadow bg-white py-4 px-5 flex flex-col items-center">
        <div className="w-full gap-3 text-center">
          <h1 className="text-[#131e30] my-2 font-bold text-lg">Reset Your Password</h1>
        </div>

        <Box sx={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
          <FormControl size="small" fullWidth margin="dense" variant="outlined">
            <InputLabel>New Password</InputLabel>
            <OutlinedInput
              name="newPassword"
              value={formFields.newPassword}
              onChange={onChangeInput}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New Password"
            />
          </FormControl>

          <FormControl size="small" fullWidth margin="normal" variant="outlined">
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              name="confirmPassword"
              value={formFields.confirmPassword}
              onChange={onChangeInput}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
        </Box>

        <button
          onClick={handleChangePassword}
          disabled={isSubmitting}
          className={`w-[140px] h-[36px] flex justify-center items-center 
            !bg-primary-gradient hover:opacity-90 
            transition duration-200 text-white rounded-md mt-3 text-[15px]
            shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.35)] 
            active:scale-95 active:shadow-inner`}
        >
          {isSubmitting ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Change Password"
          )}
        </button>

        <div className="w-full text-center mt-3">
          <h3
            className="text-[#131e30] text-[14px] cursor-pointer hover:text-[#363fa6]"
            onClick={() => router.push("/login")}
          >
            Remembered your password? Back to Login
          </h3>
        </div>
      </div>
    </div>
  );
}
