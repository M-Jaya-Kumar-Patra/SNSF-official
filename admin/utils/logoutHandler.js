import { fetchDataFromApi } from "./api";

const ADMIN_STORAGE_KEYS = [
  "accessToken",
  "refreshToken",
  "email",
  "adminId",
  "adminEmail",
  "adminName",
  "adminAvatar",
  "actionType",
];

export const handleLogout = async ({ logout, router, alert }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token) {
      await fetchDataFromApi(`/api/admin/logout?accessToken=${token}`);
    }

    ADMIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();

    // Optional feedback
    alert?.alertBox?.({ type: "success", msg: "Logged out successfully" });

    // Call custom logout logic (clears context, etc.)
    logout();

    // Redirect to login or homepage
    router.push("/login");
  } catch {
    alert?.alertBox?.({ type: "error", msg: "Failed to logout properly. Please try again." });

    // Still fallback to logout for safety
    logout();
    ADMIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
    router.push("/login");
  }
};
