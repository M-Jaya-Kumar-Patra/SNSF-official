"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Stable logout function
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");

    setUserData(null);
    setIsLogin(false);
    router.push("/login");
  }, [router]);

  // ✅ Stable fetch user details function
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetchDataFromApi("/api/user/user-details");
      if (!response.error) {
        console.log("Fetched user details:", response);
        setUserData(response.data);
        setIsLogin(true);
      } else {
        console.error("API error:", response.message);
        if (response.message === "Something is wrong") {
          alert("Your session is closed, please login again");
        }
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // ✅ Login handler
  const login = useCallback((data, token) => {
    if (data && token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", data._id || data.id || "");
      localStorage.setItem("email", data.email || "");
      setUserData(data);
      setIsLogin(true);
      console.log("Login called in auth context");
    }
  }, []);

  // ✅ Token validation and user fetch on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLogin(false);
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
      } else {
        const timeLeft = (decoded.exp - currentTime) * 1000;
        setTimeout(() => logout(), timeLeft); // auto-logout on expiry
        fetchUserDetails();
      }
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  }, [fetchUserDetails, logout]);

  // ✅ Keep userId in localStorage in sync
  useEffect(() => {
    if (userData?._id || userData?.id) {
      localStorage.setItem("userId", userData._id || userData.id);
    }
  }, [userData]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isLogin,
        setIsLogin,
        loading,
        setLoading,
        login,
        logout,
        fetchUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
