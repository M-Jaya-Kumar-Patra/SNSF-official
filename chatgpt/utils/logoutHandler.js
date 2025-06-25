import { fetchDataFromApi } from "./api";

export const handleLogout = async ({ logout, router, alert }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token) {
      await fetchDataFromApi(`/api/admin/logout?accessToken=${token}`);
    }

    // Clear all local/session storage items
    localStorage.clear();
    sessionStorage.clear();

    // Optional feedback
    alert?.alertBox?.({ type: "success", msg: "Logged out successfully" });

    // Call custom logout logic (clears context, etc.)
    logout();

    // Redirect to login or homepage
    router.push("/login");
  } catch (error) {
    console.error("Logout API failed:", error);

    alert?.alertBox?.({ type: "error", msg: "Failed to logout properly. Please try again." });

    // Still fallback to logout for safety
    logout();
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  }
};
