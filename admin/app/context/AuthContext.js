"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { fetchDataFromApi } from "@/utils/api";

const AuthContext = createContext();

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

export const AuthProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    if (typeof window !== "undefined") {
      ADMIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    }

    setAdminData(null);
    setIsLogin(false);
    setLoading(false);
  };

  const fetchAdminDetails = async () => {
    try {
      const response = await fetchDataFromApi("/api/admin/admin-details");
      if (!response.error) {
        setAdminData(response.data);
        setIsLogin(true);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLogin(false);
      setAdminData(null);
      setLoading(false);
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      logout();
      return;
    }

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      logout();
      return;
    }

    const timeout = setTimeout(() => logout(), (decoded.exp - currentTime) * 1000);
    fetchAdminDetails();

    return () => clearTimeout(timeout);
  }, []);

  const login = (data, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }

    setAdminData(data);
    setIsLogin(true);
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
