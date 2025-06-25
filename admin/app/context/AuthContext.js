"use client";

import { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { fetchDataFromApi } from "@/utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("❌ Invalid JWT:", err);
      logout();
      return;
    }

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      logout();
      return;
    }

    // ⏰ Auto logout at token expiry
    const timeout = setTimeout(() => logout(), (decoded.exp - currentTime) * 1000);

    // 👇 Fetch admin details
    fetchAdminDetails();

    return () => clearTimeout(timeout); // cleanup
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetchDataFromApi("/api/admin/admin-details");
      if (!response.error) {
        setAdminData(response.data);
        setIsLogin(true);
      } else {
        console.warn("⚠️ API error:", response.message);
        logout();
      }
    } catch (err) {
      console.error("❌ Failed to fetch admin:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (data, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      setAdminData(data);
      setIsLogin(true);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
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
