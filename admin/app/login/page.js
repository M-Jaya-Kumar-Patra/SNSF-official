"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthPanel from "@/components/AuthPanel";
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
      router.replace("/");
      return;
    }

    setCheckingAuth(false);
  }, [isLogin, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const alertData = sessionStorage.getItem("alert");
    if (alertData) {
      const { type, msg } = JSON.parse(alertData);
      alert.alertBox({ type, msg });
      sessionStorage.removeItem("alert");
    }
  }, [alert]);

  if (checkingAuth) return null;

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
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
      const response = await postData("/api/admin/login", { email, password });

      if (!response.error && response.data?.accessToken) {
        const { accessToken, refreshToken, email: adminEmail, name } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("email", adminEmail);
        if (name) localStorage.setItem("adminName", name);

        login(response.data, accessToken);
        setFormFields({ email: "", password: "" });
        setIsLogin(true);
        alert.alertBox({ type: "success", msg: "Logged in successfully" });
        router.replace("/");
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Login failed" });
        setFormFields((prev) => ({ ...prev, password: "" }));
      }
    } catch {
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
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("actionType", "forgot-password");

      const response = await postData("/api/admin/forgot-password", { email });

      if (!response.error) {
        alert.alertBox({ type: "success", msg: response.message });
        router.push("/verify-otp");
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Failed to send OTP" });
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
    }
  };

  return (
    <AuthPanel
      title="Welcome back"
      subtitle="Login to manage products, enquiries, homepage content, and analytics."
      footer={
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="font-semibold text-blue-700 hover:text-blue-900"
        >
          Create admin account
        </button>
      }
    >
      {loading && (
        <Box className="-mx-7 -mt-6 mb-5">
          <LinearProgress />
        </Box>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <TextField
          label="Email Id"
          variant="outlined"
          size="small"
          fullWidth
          name="email"
          value={formFields.email}
          onChange={onChangeInput}
          disabled={loading}
        />

        <FormControl size="small" fullWidth variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            name="password"
            type={showPassword ? "text" : "password"}
            value={formFields.password}
            onChange={onChangeInput}
            disabled={loading}
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(event) => event.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <button
        type="button"
        onClick={forgotPassword}
        className="mt-5 w-full text-sm font-semibold text-blue-700 hover:text-blue-900"
      >
        Forgot password?
      </button>
    </AuthPanel>
  );
}
