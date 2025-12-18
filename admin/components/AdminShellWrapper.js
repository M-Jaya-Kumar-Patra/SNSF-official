"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/AdminShell";

export default function AdminShellWrapper({ children }) {
  const pathname = usePathname();

  const hideShellRoutes = ["/login", "/signup"];

 const shouldHideShell =
  pathname.startsWith("/login") ||
  pathname.startsWith("/signup");

  
  if (shouldHideShell) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
