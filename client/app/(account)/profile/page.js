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
import { useMemo } from "react";




const Account = () => {
  const router = useRouter();
  const alert = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: ""
  });

  
    const {isLogin, userData, setUserData}=useAuth()
  




  useEffect(() => {
    console.log("profile page")
    if (!isLogin) {
      console.log("p1")
      router.replace("/login");
      console.log("p2")
    }
    
    else {
      console.log(userData)
      console.log("p3")
      setFormFields({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || ""
      });
      console.log("p4")
    }
  }, [isLogin, userData]);



  useEffect(() => {
    console.log("p5")
    console.log(userData?._id||userData?.id)
    if (userData?._id||userData?.id) {
      setUserId(userData?._id||userData?.id);
    }
    console.log("p6")
  }, [userData]);//all check

  const onChangeFile = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (
        file &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
      ) {
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

      console.log("Updated", response?.user)

      setUserData({
        ...userData,
        name: response.user?.name || name,
        email: response.user?.email || email,
        phone: response.user?.phone || phone,
        avatar: response.user?.avatar || userData.avatar
      });
      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Profile updated successfully" });

        // Update userData  
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Update failed" });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: "Network error. Try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const print = ()=>{
  }


  console.log(isLogin, isLoading,  )

  if (!isLogin) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-[1020px] my-3 mx-auto flex justify-between">
        {/* Sidebar */}
        <div className="left h-full">
          <div className="w-[256px] bg-white shadow-lg p-2 flex gap-3 items-center">
            <img
              className="h-[50px] w-[50px] rounded-full object-cover"
              src={userData?.avatar || "/images/account.png"}
              alt="User Profile"
            />
            <h1 className="text-black font-sans font-semibold overflow-x-auto scrollbar-hide">
              {userData?.name}
            </h1>
          </div>

          <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
                            <ul className="text-gray-600 font-sans">
                                <li>
                                    <Link href="/orders">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <Package size={18} /> My Orders
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
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer  text-[#131e30] bg-slate-100 active:bg-slate-100">
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
                                <li>
                                    <Link href="/payments">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <CreditCard size={18} /> Payments
                                        </div>
                                    </Link>
                                </li>
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
        <div className="w-[750px] bg-white shadow-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-black font-semibold text-[20px]">Profile Information</span>
          </div>

          {/* Avatar Upload */}
          <div className="mt-4 w-28 h-28 relative group overflow-hidden rounded-md border border-gray-300 shadow">
            {!uploading && (
              <img
                src={userData?.avatar || "/images/account.png"}
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

          {/* Profile Info Form */}
          <form onSubmit={handleSubmit}>
            <Box
              component="div"
              sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
              className="mt-4"
            >
              <div className="flex flex-col gap-4">
                <TextField
                  label="Full Name"
                  variant="outlined"
                  size="small"
                  name="name"
                  value={formFields.name}
                  disabled={isLoading}
                  onChange={onChangeInput}
                  margin="dense"
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  name="email"
                  value={formFields.email}
                  disabled={true}
                  onChange={onChangeInput}
                  margin="dense"
                />
                <TextField
                  label="Phone"
                  variant="outlined"
                  size="small"
                  name="phone"
                  value={formFields.phone}
                  disabled={isLoading}
                  onChange={onChangeInput}
                  margin="dense"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                  }}
                />
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    onClick={print}
                    
                    disabled={isLoading}
                    className={`btn-org btn-sm w-[150px] bg-green-800 p-1 rounded-sm ${
                      (isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <CircularProgress color="inherit" size={22} />
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </div>
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;


// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { User, Package, CreditCard, Bell, Heart } from "lucide-react";
// import LogoutBTN from "@/components/LogoutBTN";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import InputAdornment from "@mui/material/InputAdornment";
// import { useUser } from "@/app/context/UserContext";
// import { FaCloudUploadAlt } from "react-icons/fa";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useAlert } from "@/app/context/AlertContext";
// import { uploadImage } from "@/utils/api";
// import { editData } from "@/utils/api";
// import { useAuth } from "@/app/context/AuthContext";

// const Account = () => {
//   const router = useRouter();
//   const alert = useAlert();

//   const [isLoading, setIsLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [userId, setUserId] = useState("");

//   const [formFields, setFormFields] = useState({
//     name: "",
//     email: "",
//     phone: ""
//   });

//   const {isLogin, userData, setUserData}=useAuth()

//   const validValue = Object.values(formFields).every(
//   (el) => typeof el === "string" && el.trim() !== ""
// );


//   useEffect(() => {
//     if (!isLogin) {
//       router.replace("/login");
//     } else {
//       setFormFields({
//         name: userData?.name || "",
//         email: userData?.email || "",
//         phone: userData?.phone || ""
//       });
//     }
//   }, [isLogin, userData]);

//   useEffect(() => {
//     if (userData?._id) {
//       setUserId(userData._id);
//     }
//   }, [userData]);

//   const onChangeFile = async (e) => {
//     try {
//       const file = e.target.files?.[0];
//       if (
//         file &&
//         ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
//       ) {
//         setUploading(true);
//         const formData = new FormData();
//         formData.append("avatar", file);

//         const response = await uploadImage("/api/user/user-avatar", formData);

//         if (response?.success && response.avatar) {
//           setUserData((prev) => ({ ...prev, avatar: response.avatar }));
//           localStorage.setItem("userAvatar", response.avatar);
//         } else {
//           alert.alertBox({ type: "error", msg: response.message || "Failed to update avatar" });
//         }
//       } else {
//         alert.alertBox({ type: "error", msg: "Invalid image format" });
//       }
//     } catch (error) {
//       console.error(error);
//       alert.alertBox({ type: "error", msg: "Something went wrong" });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const onChangeInput = (e) => {
//     const { name, value } = e.target;
//     setFormFields((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const { name, email, phone } = formFields;

//     if (!name || !email || !phone) {
//       alert.alertBox({ type: "error", msg: "Please fill all fields" });
//       setIsLoading(false);
//       return;
//     }

//     if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
//       alert.alertBox({ type: "error", msg: "Invalid email format" });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await editData(`/api/user/${userId}`, formFields, false);

//       if (!response.error) {
//         alert.alertBox({ type: "success", msg: "Profile updated successfully" });

//         // Update userData
//         setUserData({
//           ...userData,
//           name: response.user?.name || name,
//           email: response.user?.email || email,
//           phone: response.user?.phone || phone,
//           avatar: response.user?.avatar || userData.avatar
//         });
//       } else {
//         alert.alertBox({ type: "error", msg: response?.message || "Update failed" });
//       }
//     } catch (err) {
//       alert.alertBox({ type: "error", msg: "Network error. Try again later." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isLogin) return <div className="text-center mt-10">Loading...</div>;

//   return (
//     <div className="flex w-full min-h-screen justify-center bg-slate-100">
//       <div className="w-[1020px] my-3 mx-auto flex justify-between">
//         {/* Sidebar */}
//         <div className="left h-full">
//           <div className="w-[256px] bg-white shadow-lg p-2 flex gap-3 items-center">
//             <img
//               className="h-[50px] w-[50px] rounded-full object-cover"
//               src={userData?.avatar || "/images/account.png"}
//               alt="User Profile"
//             />
//             <h1 className="text-black font-sans font-semibold overflow-x-auto scrollbar-hide">
//               {userData?.name}
//             </h1>
//           </div>

//           <div className="mt-3 w-[256px] bg-white shadow-lg">
//             <ul className="text-gray-600 font-sans">
//               <li><Link href="/orders"><div className="h-[50px] flex items-center pl-5 font-semibold gap-2"><Package size={18} /> My Orders</div></Link></li>
//               <li><div className="h-[50px] flex items-center pl-5 font-semibold gap-2"><User size={18} /> Account Settings</div></li>
//               <li><Link href="/profile"><div className="h-[40px] pl-12 font-semibold text-[#131e30] bg-slate-100">Profile Information</div></Link></li>
//               <li><Link href="/address"><div className="h-[40px] pl-12 font-semibold">Manage Address</div></Link></li>
//               <li><Link href="/payments"><div className="h-[50px] pl-5 font-semibold gap-2 flex items-center"><CreditCard size={18} /> Payments</div></Link></li>
//               <li><Link href="/notifications"><div className="h-[50px] pl-5 font-semibold gap-2 flex items-center"><Bell size={18} /> Notifications</div></Link></li>
//               <li><Link href="/wishlist"><div className="h-[50px] pl-5 font-semibold gap-2 flex items-center"><Heart size={18} /> Wishlist</div></Link></li>
//               <li><LogoutBTN /></li>
//             </ul>
//           </div>
//         </div>

//         {/* Main Panel */}
//         <div className="w-[750px] bg-white shadow-lg p-5">
//           <div className="flex items-center justify-between">
//             <span className="text-black font-semibold text-[20px]">Profile Information</span>
//           </div>

//           {/* Avatar Upload */}
//           <div className="mt-4 w-28 h-28 relative group overflow-hidden rounded-md border border-gray-300 shadow">
//             {!uploading && (
//               <img
//                 src={userData?.avatar || "/images/account.png"}
//                 alt="avatar"
//                 className="w-full h-full object-cover"
//               />
//             )}
//             <div
//               className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-300 ${uploading
//                   ? "bg-[rgba(0,0,0,0.7)] opacity-100"
//                   : "bg-[rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100"
//                 }`}
//             >
//               {uploading ? (
//                 <CircularProgress color="inherit" size={30} />
//               ) : (
//                 <FaCloudUploadAlt className="text-white text-2xl" />
//               )}
//               <input
//                 type="file"
//                 name="avatar"
//                 accept="image/*"
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 onChange={onChangeFile}
//               />
//             </div>
//           </div>

//           {/* Profile Info Form */}
//           <form onSubmit={handleSubmit}>
//             <Box
//               component="div"
//               sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
//               className="mt-4"
//             >
//               <div className="flex flex-col gap-4">
//                 <TextField
//                   label="Full Name"
//                   variant="outlined"
//                   size="small"
//                   name="name"
//                   value={formFields.name}
//                   disabled={isLoading}
//                   onChange={onChangeInput}
//                   margin="dense"
//                 />
//                 <TextField
//                   label="Email"
//                   variant="outlined"
//                   size="small"
//                   name="email"
//                   value={formFields.email}
//                   disabled={true}
//                   onChange={onChangeInput}
//                   margin="dense"
//                 />
//                 <TextField
//                   label="Phone"
//                   variant="outlined"
//                   size="small"
//                   name="phone"
//                   value={formFields.phone}
//                   disabled={isLoading}
//                   onChange={onChangeInput}
//                   margin="dense"
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">+91</InputAdornment>,
//                   }}
//                 />
//                 <div className="flex items-center gap-4">
//                   <button
//                     type="submit"
//                     disabled={!validValue || isLoading}
//                     className={`btn-org btn-sm w-[150px] bg-green-800 p-1 rounded-sm ${
//                       (!validValue || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     {isLoading ? (
//                       <CircularProgress color="inherit" size={22} />
//                     ) : (
//                       "Update Profile"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </Box>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Account;
