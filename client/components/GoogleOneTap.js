"use client";

import { useEffect } from "react";

export default function GoogleOneTap() {
  useEffect(() => {
    // 🔒 GLOBAL LOCK (survives re-mounts)
    if (window.__ONE_TAP_ACTIVE__) return;
    window.__ONE_TAP_ACTIVE__ = true;

    const start = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(start, 300);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      // 🚫 NO callback here (FedCM-safe)
      window.google.accounts.id.prompt();
    };

    start();
  }, []);

  const handleCredentialResponse = async (response) => {
    await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    });
  };

  return null;
}
