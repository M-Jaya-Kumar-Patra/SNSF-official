"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AdminShell from "@/components/AdminShell";

export default function AdminShellWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLogin, loading } = useAuth();

  const shouldHideShell = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/verified",
  ].some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (!shouldHideShell && !loading && !isLogin) {
      router.replace("/login");
    }
  }, [isLogin, loading, router, shouldHideShell]);

  if (shouldHideShell) {
    return <>{children}</>;
  }

  if (loading || !isLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-6 py-5 text-center shadow-xl">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950 dark:border-slate-700 dark:border-t-white" />
          <p className="text-sm font-semibold">Checking admin session</p>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
