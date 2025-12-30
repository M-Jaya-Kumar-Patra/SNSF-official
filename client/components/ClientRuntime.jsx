"use client";

import AuthWrapper from "@/components/AuthWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VisitorTracker from "@/components/VisitorTracker";

export default function ClientRuntime({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthWrapper>
        <VisitorTracker />
        {children}
      </AuthWrapper>
    </GoogleOAuthProvider>
  );
}
