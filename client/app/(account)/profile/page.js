"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {
  Bell,
  Heart,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  User,
} from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Loading from "@/components/Loading";
import LogoutBTN from "@/components/LogoutBTN";
import { useAlert } from "@/app/context/AlertContext";
import { useAuth } from "@/app/context/AuthContext";
import { editData, postData, uploadImage } from "@/utils/api";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getDeviceId } from "@/utils/deviceId";

const accountLinks = [
  { href: "/profile", label: "Profile Information", icon: User, active: true },
  { href: "/address", label: "Manage Address", icon: MapPin },
  { href: "/enquires", label: "My Enquiries", icon: MessageSquareText },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const getAvatarUrl = (url) =>
  url
    ? getCloudinaryImageUrl(url, { width: 320, height: 320 })
    : "/images/account.png";

export default function Account() {
  const router = useRouter();
  const alert = useAlert();
  const { isLogin, userData, setUserData, isCheckingToken, setIsCheckingToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isLogin) {
      setIsCheckingToken(false);
      router.replace("/login");
      return;
    }

    setFormFields({
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
    });
  }, [isLogin, userData, router, setIsCheckingToken]);

  useEffect(() => {
    const id = userData?._id || userData?.id;
    if (id) {
      setUserId(id);
      localStorage.setItem("userId", id);
    }
  }, [userData]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("l20dec25kjf34u85");

    if (lastVisit !== today) {
      postData("/api/visit/new", { deviceId: getDeviceId() }, false);
      localStorage.setItem("l20dec25kjf34u85", today);
    }
  }, []);

  if (isCheckingToken) {
    return (
      <div className="mt-10 text-center">
        <Loading />
      </div>
    );
  }

  if (!isLogin) {
    return (
      <div className="mt-10 text-center">
        <Loading />
      </div>
    );
  }

  const onChangeFile = async (event) => {
    event.preventDefault();
    const file = event.target.files?.[0];

    if (!file || !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      alert.alertBox({ type: "error", msg: "Invalid image format" });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await uploadImage("/api/user/user-avatar", formData);

      if (response?.success && response?.avatar) {
        setUserData((prev) => ({ ...prev, avatar: response.avatar }));
        localStorage.setItem("userAvatar", response.avatar);
      } else {
        alert.alertBox({
          type: "error",
          msg: response?.message || "Failed to update avatar",
        });
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Something went wrong" });
    } finally {
      setUploading(false);
    }
  };

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePassword = (event) => {
    const { name, value } = event.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const { name, email, phone } = formFields;

    if (!name.trim()) {
      alert.alertBox({ type: "error", msg: "Please enter your name" });
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

      if (!response.error) {
        setUserData({
          ...userData,
          name: response.user?.name || name,
          email: response.user?.email || email,
          phone: response.user?.phone || phone,
          avatar: response.user?.avatar || userData?.avatar,
        });
        alert.alertBox({ type: "success", msg: "Profile updated successfully" });
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Update failed" });
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Network error. Try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPassLoading(true);

    const { oldPassword, newPassword, confirmPassword } = changePasswordForm;

    if (!userData?.signUpWithGoogle && !oldPassword) {
      alert.alertBox({ type: "error", msg: "Please enter old password" });
      setPassLoading(false);
      return;
    }

    if (!newPassword || !confirmPassword) {
      alert.alertBox({ type: "error", msg: "Please fill all password fields" });
      setPassLoading(false);
      return;
    }

    if (confirmPassword !== newPassword) {
      alert.alertBox({ type: "error", msg: "Passwords do not match" });
      setPassLoading(false);
      return;
    }

    try {
      const endpoint = userData?.signUpWithGoogle
        ? "/api/user/setPassword"
        : "/api/user/changePassword";
      const payload = userData?.signUpWithGoogle
        ? { email: userData?.email, newPassword, confirmPassword }
        : { email: userData?.email, oldPassword, newPassword, confirmPassword };

      const response = await postData(endpoint, payload);

      if (!response.error) {
        if (userData?.signUpWithGoogle) {
          await editData(
            `/api/user/${userData?._id}`,
            { email: userData?.email, signUpWithGoogle: false },
            true
          );
          setUserData({ ...userData, signUpWithGoogle: false });
        }

        alert.alertBox({
          type: "success",
          msg: userData?.signUpWithGoogle ? "Password set successfully" : "Password changed successfully",
        });
        setChangePasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordForm(false);
      } else {
        alert.alertBox({ type: "error", msg: response?.message || "Password update failed" });
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Password update failed" });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-slate-950 px-5 py-7 text-white sm:px-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
              Client account
            </p>
            <h1 className="text-3xl font-bold">Profile Information</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Manage your personal details, avatar, security, wishlist, enquiries, and notifications.
            </p>
          </div>

          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[310px_1fr]">
            <aside className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-center">
                <div className="group relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-slate-200 bg-white shadow">
                  {!uploading && (
                    <Image
                      src={getAvatarUrl(userData?.avatar)}
                      alt="User profile"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  )}
                  <div
                    className={`absolute inset-0 z-10 flex items-center justify-center transition ${
                      uploading
                        ? "bg-black/70 opacity-100"
                        : "bg-black/55 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {uploading ? (
                      <CircularProgress color="inherit" size={28} />
                    ) : (
                      <FaCloudUploadAlt className="text-2xl text-white" />
                    )}
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={onChangeFile}
                    />
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-950">
                  {userData?.name || "User"}
                </h2>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {userData?.email || "No email available"}
                </p>
              </div>

              <nav className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                {accountLinks.map(({ href, label, icon: Icon, active }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-semibold last:border-b-0 ${
                      active
                        ? "bg-slate-950 text-white"
                        : "text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}

                <div className="border-t border-slate-100 px-1 py-1">
                  <LogoutBTN className="!pl-3" />
                </div>
              </nav>
            </aside>

            <section className="space-y-5">
              <form
                onSubmit={handleSubmit}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">Personal details</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Keep your contact details accurate for enquiries and support.
                    </p>
                  </div>
                  <User className="hidden h-6 w-6 text-slate-400 sm:block" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    name="name"
                    size="small"
                    value={formFields.name}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    size="small"
                    value={formFields.email}
                    disabled
                    onChange={onChangeInput}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    variant="outlined"
                    name="phone"
                    size="small"
                    value={formFields.phone}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    fullWidth
                    className="md:col-span-2"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-700 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:opacity-60"
                >
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : "Update Profile"}
                </button>
              </form>

              <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <LockKeyhole className="h-5 w-5 text-slate-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">
                        {userData?.signUpWithGoogle ? "Set password" : "Change password"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {userData?.signUpWithGoogle
                          ? "Add a password to your Google-created account."
                          : "Use a strong password and update it regularly."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPasswordForm((prev) => !prev)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    {showPasswordForm ? "Close" : userData?.signUpWithGoogle ? "Set Password" : "Change"}
                  </button>
                </div>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} className="mt-5 grid gap-4 md:grid-cols-3">
                    {!userData?.signUpWithGoogle && (
                      <TextField
                        label="Old password"
                        variant="outlined"
                        size="small"
                        name="oldPassword"
                        value={changePasswordForm.oldPassword}
                        fullWidth
                        onChange={onChangePassword}
                        type="password"
                      />
                    )}
                    <TextField
                      label="New password"
                      variant="outlined"
                      size="small"
                      name="newPassword"
                      value={changePasswordForm.newPassword}
                      fullWidth
                      onChange={onChangePassword}
                      type="password"
                    />
                    <TextField
                      label="Confirm password"
                      variant="outlined"
                      size="small"
                      name="confirmPassword"
                      value={changePasswordForm.confirmPassword}
                      fullWidth
                      onChange={onChangePassword}
                      type="password"
                    />

                    <div className="flex gap-3 md:col-span-3">
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={passLoading}
                        className="flex h-10 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        {passLoading ? <CircularProgress color="inherit" size={20} /> : "Save Password"}
                      </button>
                    </div>
                  </form>
                )}
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                {[
                  ["Verified account", "Your account session is protected.", ShieldCheck],
                  ["Saved products", "Wishlist access stays connected.", Heart],
                  ["Fast enquiries", "Your details autofill support requests.", MessageSquareText],
                ].map(([title, text, Icon]) => (
                  <div key={title} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                    <Icon className="h-5 w-5 text-slate-700" />
                    <p className="mt-3 font-bold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
                  </div>
                ))}
              </section>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
