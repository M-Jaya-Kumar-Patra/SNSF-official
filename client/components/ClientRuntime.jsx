"use client";

import AuthWrapper from "@/components/AuthWrapper";
import VisitorTracker from "@/components/VisitorTracker";

export default function ClientRuntime({ children }) {
  return (
    <AuthWrapper>
      <VisitorTracker />
      {children}
    </AuthWrapper>
  );
}
