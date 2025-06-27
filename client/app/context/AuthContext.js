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
  const [isCheckingToken, setIsCheckingToken] = useState(true); // ✅

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");

    setUserData(null);
    setIsLogin(false);
    router.push("/login");
  }, [router]);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetchDataFromApi("/api/user/user-details");
      if (!response.error) {
        console.log("✅ Fetched user details:", response);
        setUserData(response.data);
        setIsLogin(true);
      } else {
        console.error("❌ API error:", response.message);
        if (response.message === "Something is wrong") {
          alert("Your session is closed, please login again");
        }
        logout();
      }
    } catch (error) {
      console.error("❌ Failed to fetch user details", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback((data, token) => {
    if (data && token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", data._id || data.id || "");
      localStorage.setItem("email", data.email || "");
      setUserData(data);
      setIsLogin(true);
      console.log("✅ Login successful");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLogin(false);
      setUserData(null);
      setIsCheckingToken(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
        setIsCheckingToken(false);
      } else {
        const timeLeft = (decoded.exp - currentTime) * 1000;
        setTimeout(() => logout(), timeLeft);
        fetchUserDetails().finally(() => setIsCheckingToken(false));
      }
    } catch (err) {
      console.error("❌ Invalid token", err);
      logout();
      setIsCheckingToken(false);
    }
  }, [fetchUserDetails, logout]);

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
        isCheckingToken, // ✅ exposed to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
