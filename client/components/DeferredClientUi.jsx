"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BottomNav = dynamic(() => import("@/components/BottomNav"), {
  ssr: false,
});
const AppToaster = dynamic(() => import("@/components/ToastProvider"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

function useIdleUi() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), {
        timeout: 3500,
      });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timer = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return ready;
}

export default function DeferredClientUi() {
  const ready = useIdleUi();

  return (
    <>
      <BottomNav />
      {ready && (
        <>
          <Footer />
          <AppToaster />
        </>
      )}
    </>
  );
}
