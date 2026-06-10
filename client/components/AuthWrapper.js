"use client";

import { useAuth } from "@/app/context/AuthContext";
import GlobalLoader from "@/components/GlobalLoader";

export default function AuthWrapper({ children }) {
  const { loading } = useAuth();

  return (
    <>
      {loading && <GlobalLoader />}
      {children}
    </>
  );
}
