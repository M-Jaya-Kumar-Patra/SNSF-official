"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import GlobalLoader from "@/components/GlobalLoader";

export default function AuthWrapper({ children }) {
  const [hasMounted, setHasMounted] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  if (!auth || typeof auth !== "object") return <GlobalLoader />;

  const { isCheckingToken, loading } = auth;

  if (isCheckingToken || loading) return <GlobalLoader />;

  return children;
}
