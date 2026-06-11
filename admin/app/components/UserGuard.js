"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { isLogin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isLogin) {
      router.replace("/login");
    }
  }, [loading, isLogin, router]);

  if (loading || !isLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)] text-sm text-[var(--admin-muted)]">
        Checking admin session...
      </div>
    );
  }

  return children;
}
