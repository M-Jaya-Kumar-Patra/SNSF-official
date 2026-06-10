"use client";

import { useCallback, useEffect } from "react";
import { postData } from "@/utils/api";
import { useAlert } from "@/app/context/AlertContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useScreen } from "@/app/context/ScreenWidthContext";

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function GoogleOneTap() {
  const router = useRouter();
  const alert = useAlert();
  const { login } = useAuth();
  const { isXs, isSm } = useScreen();

  const handleCredentialResponse = useCallback(
    async (response) => {
      try {
        const res = await postData(
          "/api/user/authWithGoogle",
          { token: response.credential },
          false
        );

        if (res?.success) {
          const { accessToken, refreshToken, user } = res;

          login(user, accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          alert.alertBox({
            type: "success",
            msg: "Logged in successfully",
          });

          router.push("/profile");
        } else {
          throw new Error(res?.message || "Google login failed");
        }
      } catch (err) {
        console.error("Google One Tap error:", err);
        alert.alertBox({
          type: "error",
          msg: "Login failed",
        });
      }
    },
    [alert, login, router]
  );

  useEffect(() => {
    if (isXs || isSm || window.__ONE_TAP_ACTIVE__) return;

    let cancelled = false;
    window.__ONE_TAP_ACTIVE__ = true;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          prompt_parent_id: "google-one-tap",
        });

        window.google.accounts.id.prompt();
      })
      .catch((err) => {
        window.__ONE_TAP_ACTIVE__ = false;
        console.error("Google Identity script failed:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [handleCredentialResponse, isSm, isXs]);

  return null;
}
