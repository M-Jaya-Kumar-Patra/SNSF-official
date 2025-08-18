import { fetchDataFromApi } from "./api";

export const handleLogout = async ({ logout, router }) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Token on logout:", token);

    if (token) {
      try {
        await fetchDataFromApi(`/api/user/logout?accessToken=${token}`);
      } catch (error) {
        console.warn("Logout API failed:", error);
      }
    }

    // Remove auth keys explicitly
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    sessionStorage.clear();

    // Clear non-HttpOnly cookies
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    logout();

    // Redirect and force hard reload
    router.push("/").then(() => {
      window.location.reload();
    });

  } catch (error) {
    console.error("Logout error:", error);
  }
};
