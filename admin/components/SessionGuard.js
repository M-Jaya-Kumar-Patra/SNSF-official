"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

const SessionGuard = ({ children }) => {
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        router.push("/login");
      } else {
        setCheckingToken(false);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  }, [router]);

  if (checkingToken) return <div>Loading...</div>;

  return <>{children}</>;
};

export default SessionGuard;
