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
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { trackVisitor } from "@/lib/tracking";
import Loading from "@/components/Loading";
import { getOrCreateVisitorId } from "@/lib/tracking";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: "300" });

export default function Login() {
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { isLogin, login, setIsLogin, isCheckingToken, setIsCheckingToken } =
    useAuth();
    const router = useRouter();
    const alert = useAlert();

  const [showPopUp, setShowPopUp] = useState(null);

  const visitorId = getOrCreateVisitorId();


  useEffect(() => {
    if (isLogin) {
      setIsCheckingToken(false);
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

  
  if (isCheckingToken)
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );



  const handleInputChange = (field, value) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: field === "email" ? value.toLowerCase() : value,
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
      const response = await postData(
        "/api/user/login",
        { email, password, visitorId },
        false
      );

      if (response?.popup) {
        setShowPopUp(response?.popup);
      }
      if (!response.error && response.data?.accessToken) {
        alert.alertBox({ type: "success", msg: "Logged in successfully" });

        router.push("/profile");
        const token = response.data.accessToken;
        setFormFields({ email: "", password: "" });
        setIsLogin(true);
        login(response.data, token);

        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("email", response.data.email);
      } else {
        if (!response?.popup) {
          alert.alertBox({
            type: "error",
            msg: response?.message || "Login failed",
          });
        }
        setFormFields({ email: "", password: "" });
      }
    } catch (error) {
      console.error("Login error:", error);
      alert.alertBox({
        type: "error",
        msg: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      setBtnLoading(false);
    }
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    e.preventDefault()

    const { email } = formFields;

    if (!formFields.email) {
      alert.alertBox({ type: "error", msg: "Please enter your email" });
      setLoading(false);
      return;
    }
    
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert.alertBox({ type: "error", msg: "Invalid email format" });
      setLoading(false);
      return;
    }

    
    localStorage.setItem("userEmail", formFields.email);
    localStorage.setItem("actionType", "forgot-password");
    
    const response = await postData(
      "/api/user/forgot-password",
      { email: formFields.email },
      false
    );
    
    if (!response.error) {
      alert.alertBox({ type: "success", msg: `OTP Sent to ${formFields.email}` });
      router.push("/verify-otp");
    } else {
      alert.alertBox({
        type: "error",
        msg: response?.message || "Failed to send OTP",
      });
    }
  };

  return (
    <div className="min-h-screen py-5 w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex relative">
          <Image
            src="/images/login-furniture.png" 
            alt="Premium Furniture"
            fill
            className="object-cover"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />

          {/* Brand text */}
          <div className="relative z-10 p-10 flex flex-col justify-end text-white">
            <h1 className={`text-4xl font-bold ${righteous.className}`}>
              Welcome Back
            </h1>
            <p className="mt-2 text-lg text-slate-200">
              Premium furniture for modern living
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo.png"
                alt="SNSF Logo"
                width={70}
                height={70}
                className="rounded-full"
              />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Log in to{" "}
                <span
                  className={`${righteous.className} bg-gradient-to-r from-slate-700 via-slate-900 to-black bg-clip-text text-transparent`}
                >
                  SNSF
                </span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Access your personalized experience
              </p>
            </div>

            {/* Email */}
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              value={formFields.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={loading}
              autoComplete="off"
            />

            {/* Password */}
            <FormControl
              size="small"
              fullWidth
              margin="dense"
              variant="outlined"
            >
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                value={formFields.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={loading}
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
                label="Password"
              />
            </FormControl>

            {/* Forgot password */}
            <div className="text-right mt-2">
              <button
                onClick={forgotPassword}
                disabled={loading}
                className="text-sm text-slate-600 hover:text-slate-900 transition active:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className=
             {` w-full h-[44px] mt-5
               rounded-lg
              font-medium
              flex items-center justify-center
              shadow-lg
              hover:opacity-95
              active:scale-[0.98]
              transition

              ${!loading ? "cursor-pointer" : "cursor-not-allowed"}
              
              ${loading ? 
              
              "bg-gray-400 text-white" :
              " bg-gradient-to-r from-slate-800 to-slate-900 text-white"}`} >
              {btnLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Log In"
              )}
            </button>

            {/* Signup */}
            <p className="text-center text-sm text-slate-600 mt-4">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-slate-900 font-medium cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-slate-300" />
              <span className="px-3 text-sm text-slate-500">or</span>
              <div className="flex-1 h-px bg-slate-300" />
            </div>

            {/* Google Login */}
            <div className="w-full flex justify-center items-center mt-2 pb-2">
              <SignInWithGoogle />
            </div>
          </div>
        </div>
      </div>

      {showPopUp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Continue with Google
            </h2>
            <p className="text-sm text-gray-600 mb-5">{showPopUp}</p>
            <div className="flex justify-center mb-4">
              <SignInWithGoogle />
            </div>
            <button
              onClick={() => setShowPopUp(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
