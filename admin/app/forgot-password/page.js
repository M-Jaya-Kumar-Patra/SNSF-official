"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAlert } from "../context/AlertContext";
import { postData } from "@/utils/api";

const Page = () => {
  const router = useRouter();
  const alert = useAlert();

  const [showPassword, setShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "", // prefilled from localStorage
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Load email from localStorage only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const storedEmail = localStorage.getItem("adminEmail");

      if (token) router.push("/profile"); // already logged in
      if (storedEmail) {
        setFormFields((prev) => ({
          ...prev,
          email: storedEmail,
        }));
      }
    }
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    const { newPassword, confirmPassword } = formFields;

    if (!newPassword) {
      return alert.alertBox({ type: "error", msg: "Please enter new password" });
    }
    if (!confirmPassword) {
      return alert.alertBox({ type: "error", msg: "Confirm your password" });
    }
    if (newPassword !== confirmPassword) {
      return alert.alertBox({ type: "error", msg: "Passwords do not match" });
    }

    try {
      const response = await postData("/api/admin/reset-password", formFields, false);
      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Password changed successfully" });
        localStorage.removeItem("actionType");
        setFormFields({ email: "", newPassword: "", confirmPassword: "" });
        router.push("/login");
      } else {
        alert.alertBox({ type: "error", msg: response?.message });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: err?.message || "Something went wrong" });
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] border border-gray-200 rounded-md shadow bg-white py-4 px-5 flex flex-col items-center">
        <h1 className="text-[#131e30] my-2 font-bold text-lg">Reset Your Password</h1>

        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <FormControl size="small" fullWidth margin="dense" variant="outlined">
            <InputLabel>New Password</InputLabel>
            <OutlinedInput
              name="newPassword"
              value={formFields.newPassword}
              type={showPassword ? "text" : "password"}
              onChange={onChangeInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <FormControl size="small" fullWidth margin="normal" variant="outlined">
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              name="confirmPassword"
              value={formFields.confirmPassword}
              type={showPassword ? "text" : "password"}
              onChange={onChangeInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Box>

        <button
          className="bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] text-white px-4 py-1 rounded-md mt-3 hover:opacity-90 text-[15px]"
          onClick={handleChangePassword}
        >
          Change Password
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
};

export default Page;
