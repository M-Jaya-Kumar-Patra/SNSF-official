"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Righteous, Poppins } from "next/font/google";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: "300" });

export default function Login() {
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const router = useRouter();
  const alert = useAlert();
  const { isLogin, login, setIsLogin } = useAuth();

  useEffect(() => {
    if (isLogin) {
      router.push("/profile");
    } else {
      setCheckingAuth(false);
    }
  }, [isLogin, router]);

  useEffect(() => {
    const alertData = sessionStorage.getItem("alert");
    if (alertData) {
      const { type, msg } = JSON.parse(alertData);
      alert.alertBox({ type, msg });
      sessionStorage.removeItem("alert");
    }
  }, [alert]);


  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBtnLoading(true);

    const { email, password } = formFields;

    if (!email) {
      alert.alertBox({ type: "error", msg: "Please enter your email" });
      setLoading(false);
      setBtnLoading(false);
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert.alertBox({ type: "error", msg: "Invalid email format" });
      setLoading(false);
      setBtnLoading(false);
      return;
    }

    if (!password) {
      alert.alertBox({ type: "error", msg: "Please enter your password" });
      setLoading(false);
      setBtnLoading(false);
      return;
    }

    try {
      const response = await postData("/api/user/login", { email, password }, false);

      if (!response.error && response.data?.accessToken) {
        alert.alertBox({ type: "success", msg: "Logged in successfully" });

        const token = response.data.accessToken;
        login(response.data, token);

        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("email", response.data.email);

        setFormFields({ email: "", password: "" });
        setIsLogin(true);

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
      setBtnLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!formFields.email) {
      alert.alertBox({ type: "error", msg: "Please enter your email" });
      return;
    }

    alert.alertBox({ type: "success", msg: `OTP Sent to ${formFields.email}` });

    localStorage.setItem("userEmail", formFields.email);
    localStorage.setItem("actionType", "forgot-password");

    const response = await postData("/api/user/forgot-password", { email: formFields.email }, false);

    if (!response.error) {
      alert.alertBox({ type: "success", msg: response.message });
      router.push("/verify-otp");
    } else {
      alert.alertBox({ type: "error", msg: response?.message || "Failed to send OTP" });
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

          <div className="w-full flex items-center gap-1 justify-center">
            <h1 className="text-[#131e30] my-2 font-bold text-lg">Log in to</h1>
            <h1
              className={`text-xl font-bold ${righteous.className} bg-gradient-to-b from-[#8ca4b4] via-[#4c6984] to-[#93b2c7] bg-clip-text text-transparent`}
            >
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
            className={`w-[120px] h-[36px] flex justify-center items-center 
              !bg-primary-gradient hover:opacity-90 
              transition duration-200 text-white rounded-md mt-4 text-[15px]
              shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.35)] 
              active:scale-95 active:shadow-inner`}
            disabled={loading}
          >
            {btnLoading ? <CircularProgress size={20} color="inherit" /> : "Log In"}
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
