"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  LinearProgress,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const alert = useAlert();
  const { isLogin, login, setIsLogin, setLoading, loading } = useAuth();

 useEffect(() => {
  if (typeof window === "undefined") return;
  
  const token = localStorage.getItem("accessToken");
  if (token && isLogin) {
    router.replace("/profile");
  } else {
    setCheckingAuth(false);
  }
}, [isLogin]);


  // ✅ Alert from previous page (safe SSR)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const alertData = sessionStorage.getItem("alert");
      if (alertData) {
        const { type, msg } = JSON.parse(alertData);
        alert.alertBox({ type, msg });
        sessionStorage.removeItem("alert");
      }
    }
  }, []);

  if (checkingAuth) return null;

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formFields;

    if (!email) {
      alert.alertBox({ type: "error", msg: "Please enter your email" });
      setLoading(false);
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert.alertBox({ type: "error", msg: "Invalid email format" });
      setLoading(false);
      return;
    }

    if (!password) {
      alert.alertBox({ type: "error", msg: "Please enter your password" });
      setLoading(false);
      return;
    }

    try {
      const response = await postData("/api/admin/login", { email, password }, false);

      if (!response.error && response.data?.accessToken) {
        const { accessToken, refreshToken, email, name } = response.data;

        // ✅ safe for browser
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("email", email);
        }

        login(response.data, accessToken);
        setFormFields({ email: "", password: "" });
        setIsLogin(true);
        alert.alertBox({ type: "success", msg: "Logged in successfully" });
        router.push("/profile");
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Login failed" });
        setFormFields({ email: "", password: "" });
      }
    } catch (error) {
      console.error("Login error:", error);
      alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    const email = formFields.email.trim();

    if (!email) {
      alert.alertBox({ type: "error", msg: "Please enter your email" });
      return;
    }

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("actionType", "forgot-password");
      }

      const response = await postData("/api/admin/forgot-password", { email }, false);

      if (!response.error) {
        alert.alertBox({ type: "success", msg: response.message });
        router.push("/verify-otp");
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] border rounded-md shadow overflow-hidden bg-white">
        {loading && <Box><LinearProgress /></Box>}

        <div className="w-full py-4 px-5 flex flex-col items-center">
          <Image
            className="w-16 h-16 rounded-full mt-4"
            src="/images/logo.png"
            alt="SNSF Logo"
            width={64}
            height={64}
          />

          <div className="w-full flex items-center gap-3 justify-center">
            <h1 className="text-[#131e30] my-2 font-bold text-lg">Log in to</h1>
            <h1 className="text-xl font-bold font-sans bg-gradient-to-b from-[#8ca4b4] via-[#4c6984] to-[#93b2c7] bg-clip-text text-transparent">
              SNSF
            </h1>
          </div>

          <TextField
            label="Email Id"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            name="email"
            value={formFields.email}
            onChange={onChangeInput}
            disabled={loading}
          />

          <FormControl size="small" fullWidth margin="dense" variant="outlined">
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              type={showPassword ? "text" : "password"}
              value={formFields.password}
              onChange={onChangeInput}
              disabled={loading}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <button
            className="relative bg-transparent border-none text-[#131e30] text-[14px] mt-2 right-0"
            onClick={forgotPassword}
            disabled={loading}
          >
            Forgot password?
          </button>

          <button
            type="submit"
            onClick={handleLogin}
            className="hover:opacity-90 bg-gradient-to-l from-[#798ca8] via-[rgb(51,66,87)] to-[#131e30] text-white px-4 py-1 rounded-md mt-4 text-[15px]"
            disabled={loading}
          >
            Log In
          </button>

          <div className="w-full text-center mt-3">
            <h3
              className="text-[#131e30] text-[14px] cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Don&apos;t have an account?{" "}
              <span className="hover:text-blue-700 hover:underline">Sign up</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
