"use client";

import AuthWrapper from "@/components/AuthWrapper";
import VisitorTracker from "@/components/VisitorTracker";
import AIAssistantChat from "@/components/AIAssistantChat";

export default function ClientRuntime({ children }) {
  return (
    <AuthWrapper>
      <VisitorTracker />
      {children}
      <AIAssistantChat />
    </AuthWrapper>
  );
}
