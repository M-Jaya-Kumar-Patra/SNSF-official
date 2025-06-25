"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const SessionGuard = ({ children }) => {
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    // ✅ Safe: this runs only on client
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token is expired
        alert("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        router.push("/login");
      } else {
        setCheckingToken(false); // ✅ allow render
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  }, [router]);

  // ❌ Prevent render until token is verified
  if (checkingToken) return null;

  return <>{children}</>;
};

export default SessionGuard;
