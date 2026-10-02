"use client";

import AuthWrapper from "@/components/AuthWrapper";
import VisitorTracker from "@/components/VisitorTracker";
import AIAssistantChat from "@/components/AIAssistantChat";
import ProductNavigationFeedback from "@/components/ProductNavigationFeedback";

export default function ClientRuntime({ children }) {
  return (
    <AuthWrapper>
      <VisitorTracker />
      <ProductNavigationFeedback />
      {children}
      <AIAssistantChat />
    </AuthWrapper>
  );
}
