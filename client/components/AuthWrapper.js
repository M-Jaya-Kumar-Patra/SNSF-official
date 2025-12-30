"use client";

import { useAuth } from "@/app/context/AuthContext";
import GlobalLoader from "@/components/GlobalLoader";

export default function AuthWrapper({ children }) {
  const { isCheckingToken, loading } = useAuth();

  // ✅ Always render something
  if (isCheckingToken || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <GlobalLoader />
      </div>
    );
  }

  return children;
}
