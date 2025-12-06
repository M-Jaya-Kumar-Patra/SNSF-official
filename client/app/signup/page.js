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

  const router = useRouter();
  const alert = useAlert();
  const { isLogin, isCheckingToken, setIsCheckingToken } = useAuth();

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
      setEmailError(true)
      return;
    }
    if (!password.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter password" });
      setIsLoading(false);
      return;
    }

    setEmailError(false)
    const response = await postData("/api/user/register", formFields, false);
    if (!response.error) {
      const { email, name, _id } = response.user;

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("userId", _id);
      localStorage.setItem("actionType", "register");

      setFormFields({ name: "", email: "", password: "" });
      router.push("/verify-otp");
    } else {
      alert.alertBox({
        type: "error",
        msg: response?.message || "Signup failed",
      });
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
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] border rounded-md shadow overflow-hidden bg-white">
        <div className="w-full py-4 px-5 flex flex-col items-center">
          <Image
            className="w-16 h-16 rounded-full mt-4"
            src={getOptimizedCloudinaryUrl("/images/logo.png")}
            alt="SNSF Logo"
            width={64}
            height={64}
          />

          <div className="w-full flex items-center gap-3 justify-center">
            <h1 className="text-[#131e30] my-2 font-bold text-lg">
              Sign up to
            </h1>
            <h1
              className={`text-xl font-bold ${righteous.className} bg-gradient-to-b from-[#8ca4b4] via-[#4c6984] to-[#93b2c7] bg-clip-text text-transparent`}
            >
              SNSF
            </h1>
          </div>

          {/* Dummy hidden inputs to prevent autofill */}
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

            <TextField
              label="Full name"
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth
              name="name"
              disabled={isLoading}
              value={formFields.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              autoComplete="off"
            />

            <TextField
              label="Email Id"
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth
              name="user_email_unique"
              autoComplete="new-email"
              disabled={isLoading}
              value={formFields.email}
              error={emailError}
              helperText={
                emailError ? "Please enter a valid email address" : ""
              }
              onChange={(e) => handleInputChange("email", e.target.value)}
            />

            <FormControl
              size="small"
              fullWidth
              margin="dense"
              variant="outlined"
            >
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                name="user_password_unique"
                autoComplete="new-password"
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

            {formFields.password.length > 0 && (
              <div className="w-full mt-1">
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
                  ></div>
                </div>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label} Password
                </p>
              </div>
            )}
            <div className="w-full flex justify-center mt-1">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-[120px] h-[36px] flex justify-center items-center 
                !bg-primary-gradient hover:opacity-90 
                transition duration-200 text-white rounded-md mt-4 text-[15px]
                shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.35)] 
                active:scale-95 active:shadow-inner"
              >
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <div className="w-full text-center mt-3">
            <h3
              className="text-[#131e30] text-[14px] cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Already have an account?{" "}
              <span className="hover:text-blue-700 hover:underline">
                Log in
              </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
