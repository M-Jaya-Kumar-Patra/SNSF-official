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
  Box,
  LinearProgress
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


  

  const router = useRouter();
  const alert = useAlert();
  const { isLogin } = useAuth();

  useEffect(() => {
    if (isLogin) {
      router.push("/profile");
    } else {
      setCheckingAuth(false);
    }
  }, [isLogin, router]);

  
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
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
  if (!password.trim()) {
    alert.alertBox({ type: "error", msg: "Please enter password" });
    setIsLoading(false);
    return;
  }

  const response = await postData("/api/user/register", formFields, false);
  if (!response.error) {
    const { email, name, _id } = response.user;

    // ✅ Save to localStorage for OTP screen
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    localStorage.setItem("userId", _id);
    localStorage.setItem("actionType", "register");

    setFormFields({ name: "", email: "", password: "" });
    router.push("/verify-otp");
  } else {
    alert.alertBox({ type: "error", msg: response?.message || "Signup failed" });
  }

  setIsLoading(false);
};


  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] border rounded-md shadow overflow-hidden bg-white">
        {isLoading && <Box><LinearProgress /></Box>}

        <div className="w-full py-4 px-5 flex flex-col items-center">
          <Image
            className="w-16 h-16 rounded-full mt-4"
            src="/images/logo.png"
            alt="SNSF Logo"
            width={64}
            height={64}
          />

          <div className="w-full flex items-center gap-3 justify-center">
            <h1 className="text-[#131e30] my-2 font-bold text-lg">Sign up to</h1>
            <h1
              className={`text-xl font-bold ${righteous.className} bg-gradient-to-b from-[#8ca4b4] via-[#4c6984] to-[#93b2c7] bg-clip-text text-transparent`}
            >
              SNSF
            </h1>
          </div>

          <TextField
            label="Full name"
            variant="outlined"
            margin="dense"
            size="small"
            fullWidth
            name="name"
            disabled={isLoading}
            value={formFields.name}
            onChange={onChangeInput}
          />

          <TextField
            label="Email Id"
            variant="outlined"
            margin="dense"
            size="small"
            fullWidth
            name="email"
            disabled={isLoading}
            value={formFields.email}
            onChange={onChangeInput}
          />

          <FormControl size="small" fullWidth margin="dense" variant="outlined">
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              value={formFields.password}
              onChange={onChangeInput}
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
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-[120px] h-[36px] flex justify-center items-center 
              !bg-primary-gradient hover:opacity-90 
              transition duration-200 text-white rounded-md mt-4 text-[15px]
              shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.35)] 
              active:scale-95 active:shadow-inner"
          >
            {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Sign Up"}
          </button>

          <div className="w-full text-center mt-3">
            <h3
              className="text-[#131e30] text-[14px] cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Already have an account?{" "}
              <span className="hover:text-blue-700 hover:underline">Log in</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
