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
import Loading from "@/components/Loading";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";
import { getOrCreateVisitorId } from "@/lib/tracking";

export default function Login() {
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(null);

  const { isLogin, login, setIsLogin, isCheckingToken, setIsCheckingToken } = useAuth();
  const router = useRouter();
  const alert = useAlert();

  useEffect(() => {
    if (isLogin) {
      setIsCheckingToken(false);
      router.push("/profile");
    } else {
      setCheckingAuth(false);
    }
  }, [isLogin, router, setIsCheckingToken]);

  useEffect(() => {
    const alertData = sessionStorage.getItem("alert");
    if (alertData) {
      const { type, msg } = JSON.parse(alertData);
      alert.alertBox({ type, msg });
      sessionStorage.removeItem("alert");
    }
  }, [alert]);

  if (isCheckingToken || checkingAuth) {
    return (
      <div className="mt-10 text-center">
        <Loading />
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: field === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
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
      const response = await postData(
        "/api/user/login",
        { email, password, visitorId: getOrCreateVisitorId() },
        false
      );

      if (response?.popup) setShowPopUp(response.popup);

      if (!response.error && response.data?.accessToken) {
        const token = response.data.accessToken;
        login(response.data, token);
        setIsLogin(true);
        setFormFields({ email: "", password: "" });
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("email", response.data.email);
        alert.alertBox({ type: "success", msg: "Logged in successfully" });
        router.push("/profile");
      } else {
        if (!response?.popup) {
          alert.alertBox({ type: "error", msg: response?.message || "Login failed" });
        }
        setFormFields((prev) => ({ ...prev, password: "" }));
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (event) => {
    event.preventDefault();

    const email = formFields.email.trim();
    if (!email) {
      alert.alertBox({ type: "error", msg: "Please enter your email" });
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert.alertBox({ type: "error", msg: "Invalid email format" });
      return;
    }

    setLoading(true);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("actionType", "forgot-password");

    const response = await postData("/api/user/forgot-password", { email }, false);
    setLoading(false);

    if (!response.error) {
      alert.alertBox({ type: "success", msg: `OTP sent to ${email}` });
      router.push("/verify-otp");
    } else {
      alert.alertBox({ type: "error", msg: response?.message || "Failed to send OTP" });
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to manage your enquiries, wishlist, saved addresses, and account details."
      footer={
        <span>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="font-bold text-slate-950 hover:text-blue-700"
          >
            Create one
          </button>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          fullWidth
          value={formFields.email}
          onChange={(event) => handleInputChange("email", event.target.value)}
          disabled={loading}
          autoComplete="email"
        />

        <FormControl size="small" fullWidth variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            value={formFields.password}
            onChange={(event) => handleInputChange("password", event.target.value)}
            disabled={loading}
            label="Password"
            autoComplete="current-password"
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
          type="button"
          onClick={forgotPassword}
          disabled={loading}
          className="ml-auto block text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          Forgot password?
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Log In"}
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
