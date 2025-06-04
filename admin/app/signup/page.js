"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Righteous, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: "300" });

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);


  const alert = useAlert();
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isLogin, login, setIsLogin, setLoading, loading, adminData } = useAuth();
  
    // Redirect if already logged in
    useEffect(() => {
      if (isLogin) {
        router.push("/profile");
      } else {
        setCheckingAuth(false); // allow rendering login form
      }
    }, [isLogin, router]);

  if (checkingAuth) {
    // Optional: return a spinner or just null
    return null;
  }

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name.trim() === "") {
      alert.alertBox({
        type: "error",
        msg: "Please enter full name",
      });
      setIsLoading(false);
      return;
    }
    if (formFields.email.trim() === "") {
      alert.alertBox({
        type: "error",
        msg: "Please enter your email id",
      });
      setIsLoading(false);
      return;
    }
    if (formFields.password.trim() === "") {
      alert.alertBox({
        type: "error",
        msg: "Please enter password",
      });
      setIsLoading(false);
      return;
    }

    postData("/api/admin/register", formFields, false).then((response) => {
      if (!response.error) {
        localStorage.setItem("adminEmail", formFields.email);
        localStorage.setItem("adminName", formFields.name);

        setIsLoading(false);
        setFormFields({
          name: "",
          email: "",
          password: "",
        });
        router.push("/verify-otp");
      } else {
        alert.alertBox({
          type: "error",
          msg: response?.message,
        });
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] border rounded-md shadow overflow-hidden bg-white">
        <div className="top-0">
          <Box className={isLoading ? "top-0 w-full" : "top-0 w-0"}>
            <LinearProgress />
          </Box>
        </div>

        <div>
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
              margin="dense"
              name="email"
              onChange={onChangeInput}
            />
            <FormControl size="small" fullWidth margin="dense" variant="outlined">
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                name="password"
                value={formFields.password}
                disabled={isLoading}
                type={showPassword ? "text" : "password"}
                onChange={onChangeInput}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
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
              className="hover:opacity-90 bg-gradient-to-l from-[#798ca8] via-[rgb(51,66,87)] to-[#131e30] text-white px-4 py-1 rounded-md mt-4  text-[15px]"
            >
              Sign Up
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

            {/* <div className="text-[12px] text-gray-500 font-sans my-2">or</div>

            <div className="provider">
              <button
                type="button"
                onClick={() => signIn("google")}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-1 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition h-[35px] w-[230px] text-[15px] justify-center"
              >
                <Image
                  loading="eager"
                  height={20}
                  width={20}
                  src="https://authjs.dev/img/providers/google.svg"
                  alt="Google Logo"
                />
                <span className="text-gray-700 text-base font-sans">Continue with Google</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
