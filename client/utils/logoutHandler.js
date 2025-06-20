import { fetchDataFromApi } from "./api";

export const handleLogout = async ({ logout, router }) => {
  const token = localStorage.getItem("accessToken");

  try {
    if (token) {
      await fetchDataFromApi(`/api/user/logout?accessToken=${token}`);
    }
  } catch (error) {
    console.error("Logout API failed", error);
  }

  localStorage.clear();
  logout(); // your context's logout function
  router.push("/"); // redirect to home or login
};
