"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import GlobalLoader from "@/components/GlobalLoader";

export default function AuthWrapper({ children }) {
  const { isCheckingToken, loading } = useAuth();

  if (isCheckingToken || loading) {
    return <GlobalLoader />;
  }

  return children;
}
