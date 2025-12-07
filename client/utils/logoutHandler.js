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

    // Remove auth keys
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    logout();

    // Redirect and reload
    router.push("/");
    window.location.reload(); // just call reload after push
  } catch (error) {
    console.error("Logout error:", error);
  }
};

