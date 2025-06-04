import { signOut } from "next-auth/react";
import { fetchDataFromApi } from "./api";

export const handleLogout = async ({ logout, router }) => {
  const token = localStorage.getItem("accessToken");

  try {
    if (token) {
      await fetchDataFromApi(`/api/admin/logout?accessToken=${token}`);
    }
  } catch (error) {
    console.error("Logout API failed", error);
  }

  localStorage.clear();
  logout();
  await signOut({ redirect: false });
  router.push("/");
};
