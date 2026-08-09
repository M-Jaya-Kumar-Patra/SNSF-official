"use client";

import AuthWrapper from "@/components/AuthWrapper";
import VisitorTracker from "@/components/VisitorTracker";
import dynamic from "next/dynamic";

const SnsfAiAssistant = dynamic(() => import("@/components/SnsfAiAssistant"), {
  ssr: false,
});
const SnsfFurnitureDesigner = dynamic(() => import("@/components/SnsfFurnitureDesigner"), {
  ssr: false,
});

export default function ClientRuntime({ children }) {
  return (
    <AuthWrapper>
      <VisitorTracker />
      <SnsfAiAssistant />
      <SnsfFurnitureDesigner />
      {children}
    </AuthWrapper>
  );
}
