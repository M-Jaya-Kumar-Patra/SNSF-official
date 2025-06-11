"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

const SessionGuard = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          router.push("/login");
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, []);

  return <>{children}</>;
};

export default SessionGuard;
