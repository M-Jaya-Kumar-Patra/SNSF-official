"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, CreditCard, Bell, Heart } from "lucide-react";
import LogoutBTN from "@/components/LogoutBTN";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { useAlert } from "@/app/context/AlertContext";
import { uploadImage } from "@/utils/api";
import { editData } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import Button from '@mui/material/Button';
import { MdModeEdit } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { postData } from "@/utils/api";


const Account = () => {
  const router = useRouter();
  const alert = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [passLoading, setPassLoading] = useState(false)

  
  
const [showTopForm, setShowTopForm] = useState(false);

  const [state, setState] = useState({
    top: false,
  });

  

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPassword : "",
    newPassword : "",
    confirmPassword : ""
  })

  
    const {isLogin, adminData, setAdminData}=useAuth()


  




  useEffect(() => {
    console.log("profile page")
    if (!isLogin) {
      console.log("p1")
      router.replace("/login");
      console.log("p2")
    }
    
    else {
      console.log(adminData)
      console.log("p3")
      setFormFields({
        name: adminData?.name || "",
        email: adminData?.email || "",
        phone: adminData?.phone || ""
      });
      console.log("p4")
    }
  }, [isLogin, adminData]);



  useEffect(() => {
    console.log("p5")
    console.log(adminData?._id||adminData?.id)
        localStorage.setItem("adminId", adminData?._id||adminData?.id)

    if (adminData?._id||adminData?.id) {
      setAdminId(adminData?._id||adminData?.id);
    }
    localStorage.setItem("adminId",adminData?._id||adminData?.id)
    console.log("p6")
  }, [adminData]);//all check

  const onChangeFile = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files?.[0];
      if (
        file &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
      ) {
        setUploading(true);
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await uploadImage("/api/admin/admin-avatar", formData);

        if (response?.success && response.avatar) {
          setAdminData((prev) => ({ ...prev, avatar: response.avatar }));
          localStorage.setItem("adminAvatar", response.avatar);
        } else {
          alert.alertBox({ type: "error", msg: response.message || "Failed to update avatar" });
        }
      } else {
        alert.alertBox({ type: "error", msg: "Invalid image format" });
      }
    } catch (error) {
      console.error(error);
      alert.alertBox({ type: "error", msg: "Something went wrong" });
    } finally {
      setUploading(false);
    }
  };///////////////////

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
      const response = await editData(`/api/admin/${adminId}`, formFields, false);

      console.log("Updated", response?.admin)

      setAdminData({
        ...adminData,
        name: response.admin?.name || name,
        email: response.admin?.email || email,
        phone: response.admin?.phone || phone,
        avatar: response.admin?.avatar || adminData.avatar
      });
      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Profile updated successfully" });

        // Update adminData  
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Update failed" });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: "Network error. Try again later." });
    } finally {
      setIsLoading(false);
    }
  };



  const handlePasswordChange = async (e)=>{
    e.preventDefault()
    setPassLoading(true)

    const {oldPassword, newPassword, confirmPassword} = changePasswordForm

    if(!oldPassword){
      setPassLoading(false)
      alert.alertBox({ type: "error", msg: "Please enter your old password" })
      return
    }
    if(!newPassword){
      setPassLoading(false)
      alert.alertBox({ type: "error", msg: "Please enter your new password" })
      return
    }
    if(!confirmPassword){
      setPassLoading(false)
      alert.alertBox({ type: "error", msg: "Please enter your confirm password" })
      return
    }
    if(oldPassword===newPassword){
      setPassLoading(false)
      // alert.alertBox({ type: "error", msg: "Your new password is same as you old password. Try different." })
      return
    }
    if(confirmPassword!==newPassword){
      setPassLoading(false)
      // alert.alertBox({ type: "error", msg: "Both the password field must same" })
      return
    }

    try {
          const response = await postData("/api/admin/changePassword", {
  email: adminData?.email,
  oldPassword,
  newPassword,
  confirmPassword
});
        
              if (!response.error) {
                alert.alertBox({ type: "success", msg: "Password changed successfully" });
        
        
        
                setChangePasswordForm({ oldPassword:"", newPassword: "", confirmPassword: "" });
                // setIsLoading(false)
                // router.push("/profile");
              } else {
                alert.alertBox({ type: "error", msg: response?.message });
              }
            } catch (err) {
              alert.alertBox({ type: "error", msg: err?.message });
            } finally {
      setPassLoading(false);
    }
  }

  console.log(isLogin, isLoading,  )

  if (!isLogin) return <div className="text-center mt-10">Loading...</div>;

  


  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-[1020px] my-3 mx-auto flex justify-between">
        {/* Sidebar */}
        <div className="left h-full">
          <div className="w-[256px] bg-white shadow-lg pb-5 pt-6 px-5 gap-3 flex flex-col justify-center items-center ">
            <div className="mt-2 mr-2 w-[140px] h-[140px] relative group overflow-hidden border   rounded-full border-gray-300 shadow">
            {!uploading && (
              <img
                src={adminData?.avatar || "/images/account.png"}
                alt="avatar"
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
            <h1 className="text-black font-sans font-semibold overflow-x-auto scrollbar-hide">
              {adminData?.name}
            </h1>
          </div>

          <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
                            <ul className="text-gray-600 font-sans">
                              
                                
                                <li>
                                    <Link href="/profile">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold gap-2 border  border-l-8 border-y-0 border-r-0 border-slate-700  cursor-pointer  text-[#131e30] bg-slate-100 active:bg-slate-100">
                                           <User size={18} /> Profile Information
                                        </div>
                                    </Link>
                                </li>
                                
                                
                                <li>
                                    <Link href="/notifications">
                                        <div className="h-[50px] flex items-center pl-7 font-semibold cursor-pointer gap-2  active:bg-slate-100">
                                            <Bell size={18} /> Notifications
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
        <div className="w-[750px] bg-white shadow-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-black font-semibold text-[25px]">Profile Information</span>
          </div>

          

          {/* Profile Info Form */}
          <form onSubmit={handleSubmit} className="  border-slate-400 rounded-md mt-4  pt-3">
            <Box
              component="div"
              sx={{ "& .MuiTextField-root": { m: 1.5, width: "full" } }}
              className=" w-full"
            >
                <div className="flex flex-col w-full ">
                <TextField
                  label="Full Name"
                  variant="outlined"
                  name="name"
                  value={formFields.name}
                  disabled={isLoading}
                  onChange={onChangeInput}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formFields.email}
                  disabled={true}
                  onChange={onChangeInput}
                />
                <TextField
                  label="Phone"
                  variant="outlined"
                  name="phone"
                  value={formFields.phone}
                  disabled={isLoading}
                  onChange={onChangeInput}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                  }}
                />
              </div>
              <div>
                
              </div>
                <div className="flex items-center gap-4 ">
                  <button
                    type="submit"
                    
                    disabled={isLoading}
                    className={`btn-org btn-sm w-full bg-green-700 p-1 mx-3 mt-1 rounded-md ${
                      (isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <CircularProgress color="inherit" size={22} />
                    ) : (
                      <div className="flex items-center justify-center font-semibold gap-2"><MdModeEdit /><h1>Update Profile</h1></div>
                    )}
                  </button>
                  
                </div>
            </Box>
          </form>
          <form className="border border-slate-400 rounded-md mt-6 mx-3 p-2 pt-3 " onSubmit={handlePasswordChange}>
  <div>
  <div key={'top'}>
    <div className="flex justify-between" onClick={() => setShowTopForm(prev => !prev)}>
      <div className="text-gray-700 font-semibold text-lg">Change Password</div>
      <button
        // onClick={() => setShowTopForm(prev => !prev)}
        className="mt-0 text-blue-500 font-sans font-bold text-md"
        type="button"
      >
        CHANGE PASSWORD
      </button>
    </div>

    {showTopForm && (
      <div className="border-slate-500 rounded-md flex flex-col justify-center items-center">
        <div className="mt-4  gap-x-3 w-2/3 ">
        <Box
              component="div"
              sx={{ "& .MuiTextField-root": { m: 1.5, width: "full" } }}
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

        <div className="flex w-full mx-3 gap-3 ">
          <button
          type="submit"
          disabled={passLoading}
          onClick={()=>setShowTopForm(prev => !prev)}
          className={`btn-org btn-sm w-full bg-white p-1 mt-3 mb-2 border border-slate-400 rounded-md ${
            passLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}> 
          
          <div className="flex items-center justify-center font-semibold text-red-500  gap-2"><RxCross2 /><h1>Cancel</h1></div> 
        </button>
        <button
          type="submit"
          disabled={passLoading}
          className={`btn-org btn-sm w-full bg-blue-600 p-1 mt-3 mb-2 rounded-md ${
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

