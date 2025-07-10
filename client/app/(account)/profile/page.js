"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, CreditCard, Bell, Heart } from "lucide-react";
import { MdOutlineMessage } from "react-icons/md";
import LogoutBTN from "@/components/LogoutBTN";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { useAlert } from "@/app/context/AlertContext";
import { uploadImage, editData, postData } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { MdModeEdit } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";

const Account = () => {
  const router = useRouter();
  const alert = useAlert();
  const { isLogin, userData, setUserData, isCheckingToken, setIsCheckingToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [formFields, setFormFields] = useState({ name: "", email: "", phone: "" });
  const [changePasswordForm, setChangePasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  
   if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;
  useEffect(() => {
    if (!isLogin) {
      setIsCheckingToken(false)
      router.replace("/login");

    } else {
      setFormFields({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
      });
    }
  }, [isLogin, userData, router]);

  useEffect(() => {
    const id = userData?._id || userData?.id;
    if (id) {
      setUserId(id);
      localStorage.setItem("userId", id);
    }
  }, [userData]);

  const onChangeFile = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files?.[0];
      if (file && ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        setUploading(true);
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await uploadImage("/api/user/user-avatar", formData);
        if (response?.success && response.avatar) {
          setUserData((prev) => ({ ...prev, avatar: response.avatar }));
          localStorage.setItem("userAvatar", response.avatar);
        } else {
          alert.alertBox({ type: "error", msg: response.message || "Failed to update avatar" });
        }
      } else {
        alert.alertBox({ type: "error", msg: "Invalid image format" });
      }
    } catch (error) {
      alert.alertBox({ type: "error", msg: "Something went wrong" });
    } finally {
      setUploading(false);
    }
  };
  

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePassword = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, email, phone } = formFields;

    if (!name || !email || !phone) {
      alert.alertBox({ type: "error", msg: "Please fill all fields" });
      setIsLoading(false);
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert.alertBox({ type: "error", msg: "Invalid email format" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await editData(`/api/user/${userId}`, formFields, false);
      setUserData({
        ...userData,
        name: response.user?.name || name,
        email: response.user?.email || email,
        phone: response.user?.phone || phone,
        avatar: response.user?.avatar || userData.avatar,
      });

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Profile updated successfully" });
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Update failed" });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: "Network error. Try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    const { oldPassword, newPassword, confirmPassword } = changePasswordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassLoading(false);
      alert.alertBox({ type: "error", msg: "Please fill all password fields" });
      return;
    }
    if (oldPassword === newPassword) {
      setPassLoading(false);
      alert.alertBox({ type: "error", msg: "New password must be different from old password" });
      return;
    }
    if (confirmPassword !== newPassword) {
      setPassLoading(false);
      alert.alertBox({ type: "error", msg: "Passwords do not match" });
      return;
    }

    try {
      const response = await postData("/api/user/changePassword", {
        email: userData?.email,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Password changed successfully" });
        setChangePasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert.alertBox({ type: "error", msg: response?.message });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: err?.message });
    } finally {
      setPassLoading(false);
    }
  };

  const getOptimizedCloudinaryUrl = (url) => {
  if (!url?.includes("res.cloudinary.com")) return url; // Don't touch local images
  return url.replace("/upload/", "/upload/w_800,h_800,c_fill,f_auto,q_90/");
};

  const [showTopForm, setShowTopForm] = useState(false)

  if (!isLogin) return <div className="text-center mt-10">Loading...</div>;




  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-full sm:w-[1020px]  sm:my-3 mx-auto sm:flex justify-between">
        {/* Sidebar */}
        <div className="left sm:h-full">
            <div className="flex sm:hidden w-full pl-3 items-center justify-start mb-2 bg-white shadow-lg py-2">
            <span className="text-black text-[22px] sm:text-3xl font-extrabold ml-1 sm:ml-0 ">Profile Information</span>
          </div>
          <div className=" w-full sm:w-[256px] mb-2 bg-white shadow-lg pb-2 sm:pb-5 pt-2 sm:pt-6 sm:px-5 gap-3 flex flex-col justify-center items-center ">


            <div className="mt-2 mr-2 w-[90px] h-[90px] sm:w-[140px] sm:h-[140px] relative group overflow-hidden border   rounded-full border-gray-300 shadow">
            {!uploading && (
              <Image
  src={getOptimizedCloudinaryUrl(userData?.avatar) || "/images/account.png"}
  alt="avatar"
  width={50}
  height={50}
  className="w-full h-full object-cover"
/>

            )}
            <div
              className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-300 ${uploading
                  ? "bg-[rgba(0,0,0,0.7)] opacity-100"
                  : "bg-[rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100"
                }`}
            >
              {uploading ? (
                <CircularProgress color="inherit" size={30} />
              ) : (
                <FaCloudUploadAlt className="text-white text-2xl" />
              )}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={onChangeFile}
              />
            </div>
          </div>
            <h1 className=" text-black font-sans font-semibold overflow-x-auto scrollbar-hide">
              {userData?.name}
            </h1>
          </div>

          <div className="hidden sm:block leftlower mt-3 w-[256px] bg-white shadow-lg">
                            <ul className="text-gray-600 font-sans">
                                <li>
                                    <Link href="/enquires">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <MdOutlineMessage size={18} /> My Enquries
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2">
                                        <User size={18} /> Account Settings
                                    </div>
                                </li>
                                <li>
                                    <Link href="/profile">
                                        <div className="h-[40px] flex items-center pl-10 font-semibold  border  border-l-8 border-y-0 border-r-0 border-indigo-950  cursor-pointer  text-indigo-950 bg-slate-100 active:bg-slate-100">
                                            Profile Information
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/address">
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer  active:bg-slate-100">
                                            Manage Address
                                        </div>
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href="/payments">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <CreditCard size={18} /> Payments
                                        </div>
                                    </Link>
                                </li> */}
                                <li>
                                    <Link href="/notifications">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2  active:bg-slate-100">
                                            <Bell size={18} /> Notifications
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/wishlist">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <Heart size={18} /> Wishlist
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <div>
                                        <LogoutBTN />
                                    </div>
                                </li>
                            </ul>
                        </div>
        </div>

        {/* Main Panel */}
        <div className="w-full sm:w-[750px] bg-white shadow-lg p-2 sm:p-5">
          <div className="hidden sm:flex items-center justify-between">
            <span className="text-black text-[22px] sm:text-3xl font-extrabold ml-1 sm:ml-0 ">Profile Information</span>
          </div>

          

          {/* Profile Info Form */}
          <form onSubmit={handleSubmit} className="  sm:border-slate-400 rounded-md mt-2 sm:mt-4  pt-1 sm:pt-3">
            <Box
              component="div"
              sx={{ "& .MuiTextField-root": { width: "full" } }}
              className=" w-full "
            >
                <div className="flex flex-col w-full ">
                <TextField
                  label="Full Name"
                  variant="outlined"
                  name="name"
                  size="small"
                  value={formFields.name}
                  disabled={isLoading}
                  onChange={onChangeInput}


                  className="!m-1 !my-2 sm:!m-3 "
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  name="email"
                  size="small"

                  value={formFields.email}
                  disabled={true}
                  onChange={onChangeInput}
                  className="!m-1 !my-2 sm:!m-3"

                />
                <TextField
                  label="Phone"
                  variant="outlined"
                  name="phone"
                  size="small"

                  value={formFields.phone}
                  disabled={isLoading}
                  onChange={onChangeInput}
                  className="!m-1 !my-2 sm:!m-3"

                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                  }}
                />
              </div>
              <div>
                
              </div>
                <div className="flex items-center gap-4">
  <button
    type="submit"
    disabled={isLoading}
    className={`w-full flex items-center text-xs sm:text-normal justify-center gap-2 px-3 py-2 mt-1 mx-1 sm:mx-3 rounded-md font-semibold text-white  sm:text-base transition-all duration-200
      ${isLoading ? 'bg-green-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 active:scale-95'}`}
  >
    {isLoading ? (
      <CircularProgress color="inherit" size={22} />
    ) : (
      <>
        <MdModeEdit className="text-xs sm:text-normal" />
        <span>Update Profile</span>
      </>
    )}
  </button>
</div>

            </Box>
          </form>
          <form className="border border-slate-400 rounded-md mt-3 sm:mt-6 mx-1 sm:mx-3 p-2 sm:pt-3 " onSubmit={handlePasswordChange}>
  <div>
  <div key={'top'}>
    <div className="flex justify-center sm:justify-between" onClick={() => setShowTopForm(prev => !prev)}>
      <div className="hidden sm:block text-gray-700 font-semibold text-sm  sm:text-lg">Change Password</div>
      <button
        // onClick={() => setShowTopForm(prev => !prev)}
        className="mt-0 text-[#1e40af] font-sans font-bold text-xs sm:text-md"
        type="button"
      >
        CHANGE PASSWORD
      </button>
    </div>

    {showTopForm && (
      <div className="border-slate-500 rounded-md flex flex-col justify-center items-center">
        <div className="mt-4  gap-x-3 w-full sm:w-2/3 ">
        <Box
              component="div"
              sx={{ "& .MuiTextField-root": {  width: "full" } }}
              className=" w-full"
            >
          <TextField
            label="Old password"
            variant="outlined"
            size="small"
            name="oldPassword"
            margin="dense"
            
            value={changePasswordForm.oldPassword}
            fullWidth

            onChange={onChangePassword}
          />  
          <TextField
            label="New password"
            variant="outlined"
            size="small"
            name="newPassword"
            margin="dense"
            value={changePasswordForm.newPassword}
            fullWidth
            onChange={onChangePassword}

          />
          <TextField
            label="Confirm password"
            variant="outlined"
            size="small"
            name="confirmPassword"
            margin="dense"
            value={changePasswordForm.confirmPassword}
            fullWidth
            onChange={onChangePassword}

          />

        <div className="flex w-full gap-3 ">
          <button
          type="submit"
          disabled={passLoading}
          onClick={()=>setShowTopForm(prev => !prev)}
          className={`btn-org btn-sm w-full bg-white p-1 mt-3 mb-2 border text-xs sm:text-normal  border-slate-400 rounded-md ${
            passLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}> 
          
          <div className="flex items-center justify-center font-semibold text-red-500  gap-2"><RxCross2 /><h1>Cancel</h1></div> 
        </button>
        <button
          type="submit"
          disabled={passLoading}
          className={`btn-org btn-sm w-full bg-primary-gradient text-xs sm:text-normal text-nowrap p-1 mt-3 mb-2 rounded-md ${
            passLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          >
          {passLoading ? (
            <CircularProgress color="inherit" size={22} />
          ) : (
            <div className="flex items-center justify-center font-semibold gap-2"><RiLockPasswordFill /><h1>Change Password</h1></div>
          )}
        </button>
        </div>
          </Box>
          </div>
      </div>
    )}
  </div>
</div>

</form>
        </div>
      </div>
    </div>
  );
};

export default Account;

