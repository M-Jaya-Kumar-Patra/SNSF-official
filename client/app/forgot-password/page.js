"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Righteous, Poppins } from "next/font/google";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAlert } from "../context/AlertContext";
import { postData } from "@/utils/api";


const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: '300' })


const Page = () => {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [type, setType] = useState("password");
  const [formFields, setFormFields] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });


  const alert = useAlert();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleChangePassword = async () => {
    const { newPassword, confirmPassword } = formFields

    if (!newPassword) {
      alert.alertBox({ type: "error", msg: "Please enter new password" });
      // setIsLoading(false);
      return;
    }

    if (!confirmPassword) {
      alert.alertBox({ type: "error", msg: "Confirm your password" });
      // setIsLoading(false);
      return;
    }

    try {
      const response = await postData("/api/user/reset-password", formFields, false);

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Password changed successfully" });



        setFormFields({ newPassword: "", confirmPassword: "" });
        router.push("/login");
        localStorage.removeItem("actionType")
      } else {
        alert.alertBox({ type: "error", msg: response?.message });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: err?.message });
    }
  }


  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (!isClient) return;
    // Run only in browser
    const storedEmail = localStorage.getItem("userEmail");
    setFormFields((prev) => ({ ...prev, email: storedEmail || "" }));

    if (session) {
      router.push("/profile");
    }
  }, [session]);

  if (!isClient) return null;

  const togglePasswordVisibility = () => {
    if (type === "password") {
      setType("text");
      setShowPassword("Hide");
    } else {
      setType("password");
      setShowPassword("Show");
    }
  };


  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] h-[auto] border border-gray-200 rounded-md shadow bg-white py-4 px-5 flex flex-col items-center">

        <div className="w-full  gap-3 text-center">
          <h1 className="text-[#131e30] my-2 font-bold text-lg">Reset Your Password</h1>


        </div>

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <div>


            <FormControl size="small" fullWidth margin="dense" variant="outlined">
              <InputLabel>New Password</InputLabel>
              <OutlinedInput
                name="newPassword"
                value={formFields.newPassword}
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
            <FormControl size="small" fullWidth margin="normal" variant="outlined">
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                name="confirmPassword"
                value={formFields.confirmPassword}
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

          </div>
        </Box>
        <button className="bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] text-white px-4 py-1 rounded-md mt-3 hover:opacity-90 text-[15px]" onClick={handleChangePassword}>
          Change Password
        </button>
        {/* Already have an account? Login */}
        <div className="w-full text-center mt-3 ">
          <h3 className="text-[#131e30] text-[14px] cursor-pointer hover:text-[#363fa6]" onClick={() => router.push("/login")}>Remembered your password? Back to Login</h3>
        </div>



      </div>
    </div>
  );
};

export default Page;
