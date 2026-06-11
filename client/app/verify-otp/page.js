"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import AuthShell from "@/components/AuthShell";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";
import { trackVisitor } from "@/lib/tracking";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [actionType, setActionType] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [timer, setTimer] = useState(0);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const router = useRouter();
  const alert = useAlert();
  const { userData } = useAuth();

  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    if (userData?.otp === false) {
      router.push("/");
      return;
    }

    setEmail(localStorage.getItem("userEmail") || "");
    setActionType(localStorage.getItem("actionType") || "");
    setIsClient(true);
  }, [router, userData]);

  useEffect(() => {
    trackVisitor("verify-otp");
  }, []);

  const startTimer = (seconds = 30) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimer(seconds);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isClient) startTimer(30);
  }, [isClient]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isClient) return null;

  const handleChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (event, index) => {
    if (event.key !== "Backspace") return;

    const nextOtp = [...otp];
    if (nextOtp[index]) {
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  const verifyOTP = async (event) => {
    event.preventDefault();
    if (!isOtpComplete) return;

    const fullOtp = otp.join("");
    setIsSubmitting(true);

    try {
      if (actionType === "forgot-password") {
        const res = await postData(
          "/api/user/verify-forgot-password-otp",
          { email, otp: fullOtp },
          false
        );

        if (!res.error) {
          localStorage.removeItem("actionType");
          router.push("/forgot-password");
        } else {
          alert.alertBox({ type: "error", msg: res.message });
        }
        return;
      }

      const res = await postData("/api/user/verifyEmail", { email, otp: fullOtp }, false);

      if (!res.error) {
        localStorage.removeItem("userEmail");
        sessionStorage.setItem("alert", JSON.stringify({ type: "success", msg: res.message }));
        router.push("/login");
      } else {
        alert.alertBox({ type: "error", msg: res.message });
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0 || loading) return;

    setLoading(true);
    try {
      const res = await postData("/api/user/resendOTP", { email }, false);

      if (!res.error) {
        alert.alertBox({ type: "success", msg: res.message });
        startTimer(30);
      } else {
        alert.alertBox({ type: "error", msg: res.message });
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Failed to resend OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={actionType === "forgot-password" ? "Verify reset code" : "Verify your email"}
      subtitle={`Enter the 6 digit OTP sent to ${email || "your email"}.`}
      footer={
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-bold text-slate-950 hover:text-blue-700"
        >
          Back to Login
        </button>
      }
    >
      <form onSubmit={verifyOTP} className="space-y-5">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(event) => handleChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => (inputRefs.current[index] = element)}
              className="h-12 w-11 rounded-xl border border-slate-300 bg-white text-center text-lg font-bold text-slate-950 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isOtpComplete}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Verify OTP"}
        </button>

        <button
          type="button"
          disabled={timer > 0 || loading}
          onClick={resendOTP}
          className="w-full text-sm font-semibold text-slate-600 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </form>
    </AuthShell>
  );
}
