"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Righteous, Poppins } from "next/font/google";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { trackVisitor } from "@/lib/tracking";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: "300" });

export default function Signup() {
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({
    label: "",
    color: "",
  });
  const [showPopUp, setShowPopUp] = useState(null);

  const router = useRouter();
  const alert = useAlert();
  const { login, isLogin, setIsLogin, isCheckingToken, setIsCheckingToken } =
    useAuth();

  const [emailError, setEmailError] = useState(false);

  if (isCheckingToken)
    return <div className="text-center mt-10">Checking session...</div>;

  useEffect(() => {
    if (isLogin) {
      setIsCheckingToken(false);
      router.push("/profile");
    } else {
      setCheckingAuth(false);
    }
  }, [isLogin, router]);

  // Reset form on mount
  useEffect(() => {
    setFormFields({ name: "", email: "", password: "" });
  }, []);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Update state based on field
  const handleInputChange = (field, value) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: field === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, password } = formFields;

    if (!name.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter full name" });
      setIsLoading(false);
      return;
    }
    if (!email.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter your email id" });
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setIsLoading(false);
      setEmailError(true);
      return;
    }
    if (!password.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter password" });
      setIsLoading(false);
      return;
    }

    setEmailError(false);
    const response = await postData("/api/user/register", formFields, false);

    if (response?.popup) {
      setShowPopUp(response?.popup);
    }
    if (!response.error) {
      const { email, name, _id } = response.user;

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("userId", _id);
      localStorage.setItem("actionType", "register");

      setFormFields({ name: "", email: "", password: "" });
      router.push("/verify-otp");
    } else {
      if (!response?.popup) {
        alert.alertBox({
          type: "error",
          msg: response?.message || "Signup failed",
        });
      }
    }

    setIsLoading(false);
  };

  const checkPasswordStrength = (password) => {
    let strength = { label: "Weak", color: "#ef4444" }; // red

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const conditions = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
      Boolean
    ).length;

    if (password.length >= 8 && conditions >= 3)
      strength = { label: "Strong", color: "#22c55e" };
    else if (password.length >= 6 && conditions >= 2)
      strength = { label: "Medium", color: "#eab308" };

    setPasswordStrength(strength);
  };

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  return (
    <div className="min-h-screen py-5 w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* ================= LEFT : VISUAL / BRAND ================= */}
        <div className="hidden md:flex relative">
          <Image
            src="/images/signup-furniture.png" // sofa / bed / interior image
            alt="Luxury Furniture"
            fill
            className="object-cover"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

          {/* Brand text */}
          <div className="relative z-10 p-10 flex flex-col justify-end text-white">
            <h1 className={`text-4xl font-bold ${righteous.className}`}>
              Join SNSF
            </h1>
            <p className="mt-2 text-lg text-slate-200">
              Crafted furniture for refined living
            </p>
          </div>
        </div>

        {/* ================= RIGHT : SIGNUP FORM ================= */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src={getOptimizedCloudinaryUrl("/images/logo.png")}
                alt="SNSF Logo"
                width={70}
                height={70}
                className="rounded-full"
              />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Sign up to{" "}
                <span
                  className={`${righteous.className} bg-gradient-to-r from-slate-700 via-slate-900 to-black bg-clip-text text-transparent`}
                >
                  SNSF
                </span>
              </h2>
             
            </div>

            {/* Dummy hidden inputs */}
            <form autoComplete="off" className="w-full">
              <input
                type="text"
                name="fake_username"
                style={{ display: "none" }}
              />
              <input
                type="password"
                name="fake_password"
                style={{ display: "none" }}
              />

              {/* Full Name */}
              <TextField
                label="Full name"
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth
                disabled={isLoading}
                value={formFields.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />

              {/* Email */}
              <TextField
                label="Email"
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth
                disabled={isLoading}
                value={formFields.email}
                error={emailError}
                helperText={
                  emailError ? "Please enter a valid email address" : ""
                }
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                  disabled={isLoading}
                  value={formFields.password}
                  onChange={(e) => {
                    handleInputChange("password", e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
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

              {/* Password strength */}
              {formFields.password.length > 0 && (
                <div className="w-full mt-2">
                  <div className="w-full h-1.5 rounded bg-gray-200 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width:
                          passwordStrength.label === "Weak"
                            ? "33%"
                            : passwordStrength.label === "Medium"
                            ? "66%"
                            : "100%",
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <p
                    className="text-xs mt-1 font-medium"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label} Password
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className=
                {`w-full h-[44px] mt-6
                bg-gradient-to-r from-slate-800 to-slate-900
                text-white rounded-lg
                font-medium
                flex items-center justify-center
                shadow-lg
                hover:opacity-95
                active:scale-[0.98]
                transition ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {isLoading ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login */}
            <p className="text-center text-sm text-slate-600 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-slate-900 font-medium cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-slate-300" />
              <span className="px-3 text-sm text-slate-500">or</span>
              <div className="flex-1 h-px bg-slate-300" />
            </div>

            <div className="w-full flex justify-center items-center mt-2 pb-2">
  <div className="overflow-hidden rounded-lg py-1 ">
    <SignInWithGoogle />
  </div>
</div>
          </div>
        </div>
      </div>

      {/* ================= GOOGLE POPUP (UNCHANGED) ================= */}
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