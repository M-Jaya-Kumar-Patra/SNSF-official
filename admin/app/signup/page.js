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

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const alert = useAlert();
  const { isLogin } = useAuth();

  useEffect(() => {
    if (isLogin) {
      router.replace("/");
    } else {
      setCheckingAuth(false);
    }
  }, [isLogin, router]);

  if (checkingAuth) return null;

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!formFields.name.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter full name" });
      setIsLoading(false);
      return;
    }

    if (!formFields.email.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter your email id" });
      setIsLoading(false);
      return;
    }

    if (!formFields.password.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter password" });
      setIsLoading(false);
      return;
    }

    const response = await postData("/api/admin/register", formFields);
    setIsLoading(false);

    if (!response.error) {
      localStorage.setItem("adminEmail", formFields.email);
      localStorage.setItem("adminName", formFields.name);
      setFormFields({ name: "", email: "", password: "" });
      router.push("/verify-otp");
    } else {
      alert.alertBox({ type: "error", msg: response?.message || "Registration failed" });
    }
  };

  return (
    <AuthPanel
      title="Create admin account"
      subtitle="Register an admin profile and verify the OTP sent to your email."
      footer={
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-blue-700 hover:text-blue-900"
        >
          Already have an account? Login
        </button>
      }
    >
      {isLoading && (
        <Box className="-mx-7 -mt-6 mb-5">
          <LinearProgress />
        </Box>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          label="Full name"
          variant="outlined"
          size="small"
          fullWidth
          value={formFields.name}
          disabled={isLoading}
          name="name"
          onChange={onChangeInput}
        />

        <TextField
          label="Email Id"
          variant="outlined"
          size="small"
          fullWidth
          value={formFields.email}
          disabled={isLoading}
          name="email"
          onChange={onChangeInput}
        />

        <FormControl size="small" fullWidth variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            name="password"
            value={formFields.password}
            disabled={isLoading}
            type={showPassword ? "text" : "password"}
            onChange={onChangeInput}
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((show) => !show)}
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
          disabled={isLoading}
          className="h-11 w-full rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </AuthPanel>
  );
};

export default Page;
