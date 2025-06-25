// components/AdminGuard.jsx
"use client";
import { useAdmin } from "../context/AdminContext.js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }) {
  const { adminData, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !adminData) {
      router.push("/login"); // redirect if no admin
    }
  }, [loading, adminData, router]);

  if (loading) return <div>Loading...</div>; // or show a spinner

  if (!adminData) return null; // prevent render until redirected

  return children;
}
