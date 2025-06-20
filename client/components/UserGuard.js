// components/UserGuard.jsx
"use client";
import { useUser } from "../context/UserContext.js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserGuard({ children }) {
  const { userData, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userData) {
      router.push("/login"); // redirect if no user
    }
  }, [loading, userData, router]);

  if (loading) return <div>Loading...</div>; // or show a spinner

  if (!userData) return null; // prevent render until redirected

  return children;
}
