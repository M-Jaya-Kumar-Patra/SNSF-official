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
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthShell from "@/components/AuthShell";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [formFields, setFormFields] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [showPopUp, setShowPopUp] = useState(null);

  const router = useRouter();
  const alert = useAlert();
  const { isLogin, isCheckingToken, setIsCheckingToken } = useAuth();

  useEffect(() => {
    if (isLogin) {
      setIsCheckingToken(false);
      router.push("/profile");
    } else {
      setCheckingAuth(false);
    }
  }, [isLogin, router, setIsCheckingToken]);

  if (isCheckingToken || checkingAuth) {
    return <div className="mt-10 text-center">Checking session...</div>;
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field, value) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: field === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      setEmailError(true);
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter password" });
      setIsLoading(false);
      return;
    }

    setEmailError(false);
    const response = await postData("/api/user/register", formFields, false);
    setIsLoading(false);

    if (response?.popup) setShowPopUp(response.popup);

    if (!response.error) {
      const { email: userEmail, name: userName, _id } = response.user;
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", _id);
      localStorage.setItem("actionType", "register");
      setFormFields({ name: "", email: "", password: "" });
      router.push("/verify-otp");
    } else if (!response?.popup) {
      alert.alertBox({ type: "error", msg: response?.message || "Signup failed" });
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save products, track enquiries, and keep your details ready for faster support."
      footer={
        <span>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-bold text-slate-950 hover:text-blue-700"
          >
            Log in
          </button>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
        <TextField
          label="Full name"
          variant="outlined"
          size="small"
          fullWidth
          disabled={isLoading}
          value={formFields.name}
          onChange={(event) => handleInputChange("name", event.target.value)}
        />

        <TextField
          label="Email"
          variant="outlined"
          size="small"
          fullWidth
          disabled={isLoading}
          value={formFields.email}
          error={emailError}
          helperText={emailError ? "Please enter a valid email address" : ""}
          onChange={(event) => handleInputChange("email", event.target.value)}
        />

        <FormControl size="small" fullWidth variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            disabled={isLoading}
            value={formFields.password}
            onChange={(event) => handleInputChange("password", event.target.value)}
            label="Password"
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
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Create Account"}
        </button>
      </form>

      <div className="my-5 flex items-center">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          or
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex justify-center">
        <SignInWithGoogle />
      </div>

      {showPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-950">Continue with Google</h2>
            <p className="mb-5 mt-2 text-sm text-slate-600">{showPopUp}</p>
            <div className="flex justify-center">
              <SignInWithGoogle />
            </div>
            <button
              type="button"
              onClick={() => setShowPopUp(false)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
