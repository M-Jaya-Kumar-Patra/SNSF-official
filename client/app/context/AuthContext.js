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

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {},
      });
      const result = await response.json();
      if (!response.ok || result.error || !result.data?.accessToken) return null;
      localStorage.setItem("accessToken", result.data.accessToken);
      return result.data.accessToken;
    } catch (error) {
      console.error("Access token refresh failed:", error);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout API failed:", err);
    }

    localStorage.clear();

    setUserData(null);
    setIsLogin(false);
    setIsCheckingToken(false);

    router.push("/login");
  }, [router]);

  const fetchUserDetails = useCallback(async (allowRefresh = true) => {
    try {
      let response = await fetchDataFromApi("/api/user/user-details");
      if (response.error && allowRefresh) {
        const token = await refreshAccessToken();
        if (token) response = await fetchDataFromApi("/api/user/user-details");
      }
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
  }, [logout, refreshAccessToken]);
  const login = useCallback(
    async (data, token) => {
      if (!data || !token) return;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", data._id || data.id || "");
      localStorage.setItem("email", data.email || "");

      setIsLogin(true);
      setUserData(data);

      await fetchUserDetails();
    },
    [fetchUserDetails]
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLogin(false);
      setUserData(null);
      setIsCheckingToken(false);
      return;
    }

    const restoreSession = async () => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        const refreshed = await refreshAccessToken();
        if (refreshed) await fetchUserDetails(false);
        else await logout();
        setIsCheckingToken(false);
      } else {
        const timeLeft = (decoded.exp - currentTime) * 1000;
        const refreshTimer = setTimeout(async () => {
          const refreshed = await refreshAccessToken();
          if (refreshed) await fetchUserDetails(false);
          else await logout();
        }, Math.max(0, timeLeft - 60_000));
        fetchUserDetails().finally(() => setIsCheckingToken(false));
        return () => clearTimeout(refreshTimer);
      }
    } catch (err) {
      const refreshed = await refreshAccessToken();
      if (refreshed) await fetchUserDetails(false);
      else await logout();
      setIsCheckingToken(false);
    }
    };
    let cleanup;
    restoreSession().then((result) => { cleanup = result; });
    return () => cleanup?.();
  }, [fetchUserDetails, logout, refreshAccessToken]);

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
        isCheckingToken,
        setIsCheckingToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
