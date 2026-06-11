"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Camera, LockKeyhole, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAlert } from "@/app/context/AlertContext";
import { useAuth } from "@/app/context/AuthContext";
import { editData, postData, uploadImage } from "@/utils/api";

const Account = () => {
  const router = useRouter();
  const alert = useAlert();
  const { isLogin, adminData, setAdminData } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [adminId, setAdminId] = useState("");
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
      router.replace("/login");
      return;
    }

    setFormFields({
      name: adminData?.name || "",
      email: adminData?.email || "",
      phone: adminData?.phone || "",
    });
  }, [isLogin, adminData, router]);

  useEffect(() => {
    const id = adminData?._id || adminData?.id;
    if (id) {
      setAdminId(id);
      localStorage.setItem("adminId", id);
    }
  }, [adminData]);

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

      const response = await uploadImage("/api/admin/admin-avatar", formData);

      if (response?.success && response.avatar) {
        setAdminData((prev) => ({ ...prev, avatar: response.avatar }));
        localStorage.setItem("adminAvatar", response.avatar);
      } else {
        alert.alertBox({ type: "error", msg: response.message || "Failed to update avatar" });
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
      const response = await editData(`/api/admin/${adminId}`, formFields);

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Profile updated successfully" });
        setAdminData({
          ...adminData,
          name: response.admin?.name || name,
          email: response.admin?.email || email,
          phone: response.admin?.phone || phone,
          avatar: response.admin?.avatar || adminData?.avatar,
        });
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

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert.alertBox({ type: "error", msg: "All password fields are required" });
      setPassLoading(false);
      return;
    }

    if (oldPassword === newPassword) {
      alert.alertBox({ type: "error", msg: "New password cannot be same as old password" });
      setPassLoading(false);
      return;
    }

    if (confirmPassword !== newPassword) {
      alert.alertBox({ type: "error", msg: "New password and confirm password must match" });
      setPassLoading(false);
      return;
    }

    try {
      const response = await postData("/api/admin/changePassword", {
        email: adminData?.email,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Password changed successfully" });
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

  if (!isLogin) {
    return <div className="mt-10 text-center text-[var(--admin-muted)]">Loading...</div>;
  }

  return (
    <div className="admin-page px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="admin-card overflow-hidden rounded-3xl">
          <div className="bg-slate-950 px-7 py-8 text-white">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-300">
              Admin profile
            </p>
            <h1 className="text-3xl font-bold">Account settings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage your admin identity, contact information, avatar, and password security.
            </p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-5">
              <div className="flex flex-col items-center text-center">
                <div className="group relative h-36 w-36 overflow-hidden rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow">
                  {!uploading && (
                    <img
                      src={adminData?.avatar || "/images/account.png"}
                      alt="Admin avatar"
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div
                    className={`absolute inset-0 flex items-center justify-center transition ${
                      uploading
                        ? "bg-black/70 opacity-100"
                        : "bg-black/55 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {uploading ? (
                      <CircularProgress color="inherit" size={30} />
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

                <h2 className="mt-4 text-xl font-bold text-[var(--admin-text)]">
                  {adminData?.name || "Admin"}
                </h2>
                <p className="mt-1 text-sm text-[var(--admin-muted)]">
                  {adminData?.email || "admin account"}
                </p>

                <div className="mt-5 grid w-full gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 text-left">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--admin-text)]">Secure session</p>
                      <p className="text-xs text-[var(--admin-muted)]">Protected admin access</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 text-left">
                    <Camera className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--admin-text)]">Avatar upload</p>
                      <p className="text-xs text-[var(--admin-muted)]">JPG, PNG, or WebP</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="space-y-5">
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--admin-text)]">Profile information</h3>
                    <p className="text-sm text-[var(--admin-muted)]">Update the public admin details.</p>
                  </div>
                  <User className="h-5 w-5 text-[var(--admin-muted)]" />
                </div>

                <Box className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    name="name"
                    value={formFields.name}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formFields.email}
                    disabled
                    onChange={onChangeInput}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={17} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Phone"
                    variant="outlined"
                    name="phone"
                    value={formFields.phone}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    fullWidth
                    className="md:col-span-2"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={17} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-5 h-11 rounded-xl bg-[var(--admin-accent)] px-5 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : "Update Profile"}
                </button>
              </form>

              <form
                onSubmit={handlePasswordChange}
                className="rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--admin-surface-soft)]">
                      <LockKeyhole className="h-5 w-5 text-[var(--admin-accent)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--admin-text)]">Password security</h3>
                      <p className="text-sm text-[var(--admin-muted)]">Change your password periodically.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPasswordForm((prev) => !prev)}
                    className="rounded-xl border border-[var(--admin-border)] px-4 py-2 text-sm font-bold text-[var(--admin-text)] transition hover:bg-[var(--admin-surface-soft)]"
                  >
                    {showPasswordForm ? "Close" : "Change"}
                  </button>
                </div>

                {showPasswordForm && (
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
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
                        className="h-10 rounded-xl border border-[var(--admin-border)] px-5 text-sm font-bold text-[var(--admin-muted)]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={passLoading}
                        className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        {passLoading ? <CircularProgress color="inherit" size={20} /> : "Save Password"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
