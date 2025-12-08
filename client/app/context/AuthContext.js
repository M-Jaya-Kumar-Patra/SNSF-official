"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const logout = useCallback(async () => {
    try {
      // Backend logout (clears cookies)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout API failed:", err);
    }

    // Frontend cleanup
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    setUserData(null);
    setIsLogin(false);
    setIsCheckingToken(false);

    // Redirect
    router.push("/login");

    // 🔥 IMPORTANT: Fix mobile logout not working
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }, [router]);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetchDataFromApi("/api/user/user-details");
      if (!response.error) {
        setUserData(response.data);
        setIsLogin(true);
      } else {
        if (response.message === "Something is wrong") {
          alert("Your session is closed, please login again");
        }
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback((data, token) => {
    if (data && token) {
      setUserData(data);
      setIsLogin(true);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", data._id || data.id || "");
      localStorage.setItem("email", data.email || "");
      console.log("User dataaaaaaaaaaaaaaaaaaaaaa: ", data);
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
        setIsCheckingToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
