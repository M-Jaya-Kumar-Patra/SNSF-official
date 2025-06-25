"use client";

import { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLogin(false);
      setAdminData(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
      } else {
        // Set timeout to auto logout when token expires
        const timeLeft = (decoded.exp - currentTime) * 1000;
        setTimeout(() => logout(), timeLeft);
        fetchAdminDetails();
      }
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetchDataFromApi("/api/admin/admin-details");
      if (!response.error) {
        setAdminData(response.data);
        setIsLogin(true);
      } else {
        console.warn("API error:", response.message);
        if (response.message === "Something is wrong") {
          alert("Your session is closed, please login again");
        }
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch admin details", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (data, token) => {
    if (typeof window !== "undefined" && data && token) {
      localStorage.setItem("accessToken", token);
      setAdminData(data);
      setIsLogin(true);
      console.log("login() called in AuthContext");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    setAdminData(null);
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        adminData,
        isLogin,
        loading,
        setLoading,
        login,
        logout,
        setAdminData,
        setIsLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
