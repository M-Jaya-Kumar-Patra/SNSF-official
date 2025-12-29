"use client";

import { useEffect } from "react";
import { postData } from "@/utils/api";
import { useAlert } from "@/app/context/AlertContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useScreen } from "@/app/context/ScreenWidthContext";

export default function GoogleOneTap() {
  const router = useRouter();
  const alert = useAlert();
  const { login } = useAuth();
  const {isXs, isSm} = useScreen();


  useEffect(() => {
    // 🔒 GLOBAL LOCK (prevents multiple One Tap prompts)
    if (window.__ONE_TAP_ACTIVE__) return;
    window.__ONE_TAP_ACTIVE__ = true;

    if (isXs || isSm) return;


    const start = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(start, 300);
        return;
      }
      

     window.google.accounts.id.initialize({
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  callback: handleCredentialResponse,
  auto_select: false,
  cancel_on_tap_outside: true,
  prompt_parent_id: "google-one-tap",
});

      // ✅ FedCM-safe prompt
      window.google.accounts.id.prompt();
    };

    start();
  }, [handleCredentialResponse, isSm, isXs]);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await postData(
        "/api/user/authWithGoogle",
        { token: response.credential },
        false
      );

      // ✅ postData returns res.success (not res.data.success)
      if (res?.success) {
        const { accessToken, refreshToken, user } = res;

        // ✅ update auth FIRST
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
  };

  return null; // 👈 One Tap has no UI
}
  