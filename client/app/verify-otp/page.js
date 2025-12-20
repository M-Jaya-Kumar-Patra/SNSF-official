"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../context/AuthContext";
import { trackVisitor } from "@/lib/tracking";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  const router = useRouter();
  const alert = useAlert();
  const { userData } = useAuth();

  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const [timer, setTimer] = useState(0);

  // ✅ derived state (KEY FIX)
  const isOtpComplete = otp.every((d) => d !== "");

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    if (userData?.otp === false) {
      router.push("/");
      return;
    }

    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("userEmail"));
      setName(localStorage.getItem("userName"));
      setUserId(localStorage.getItem("userId"));
      setActionType(localStorage.getItem("actionType"));
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    trackVisitor("verify-otp");
  }, []);

  /* ---------------- TIMER (UNCHANGED) ---------------- */

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

  /* ---------------- OTP INPUT ---------------- */

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  /* ---------------- VERIFY OTP ---------------- */

  const verifyOTP = async (e) => {
    e.preventDefault();
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
      } else {
        const res = await postData(
          "/api/user/verifyEmail",
          { email, otp: fullOtp },
          false
        );

        if (!res.error) {
          localStorage.removeItem("userEmail");
          sessionStorage.setItem(
            "alert",
            JSON.stringify({ type: "success", msg: res.message })
          );
          router.push("/login");
        } else {
          alert.alertBox({ type: "error", msg: res.message });
        }
      }
    } catch {
      alert.alertBox({ type: "error", msg: "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */

  const resendOTP = async () => {
    if (timer > 0 || loading) return;

    setLoading(true);
    try {
      const res = await postData(
        "/api/user/resendOTP",
        { email},
        false
      );

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

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-[300px] border border-gray-200 rounded-md shadow bg-white py-4 px-10 flex flex-col items-center">

        <div className="w-full gap-3 text-center">
          <h1 className="text-[#131e30] my-2 font-bold text-lg">
            {actionType === "forgot-password" ? "Verify OTP" : "Verify your email"}
          </h1>
          <h1 className="text-gray-500 text-[13px] mb-4">
            OTP sent to {email}
          </h1>
        </div>

        <form
          onSubmit={verifyOTP}
          className="w-full flex flex-col items-center gap-2"
        >
          <div className="flex justify-center gap-2 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="text-black border border-gray-400 w-10 h-10 text-center text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-[#334257]"
              />
            ))}
          </div>

          {/* VERIFY OTP (LOGIC FIX ONLY) */}
          <button
            type="submit"
            disabled={isSubmitting || !isOtpComplete}
            className={`w-[120px] h-[36px] flex justify-center items-center
              !bg-primary-gradient hover:opacity-90
              transition duration-200 text-white rounded-md mt-2 text-[15px]
              shadow-[0_4px_10px_rgba(0,0,0,0.3)]
              ${isSubmitting || !isOtpComplete ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {isSubmitting ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Verify OTP"
            )}
          </button>

          <h3
            className="text-[#131e30] text-[14px] cursor-pointer hover:text-[#363fa6] text-center mt-2"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </h3>

          {/* RESEND OTP (LOGIC FIX ONLY) */}
          <div className="w-full text-center mt-3">
            <h3
              className={`text-[#131e30] text-[14px] cursor-pointer ${
                timer > 0 || loading
                  ? "opacity-50 pointer-events-none"
                  : "hover:text-[#363fa6]"
              }`}
              onClick={resendOTP}
            >
              {loading
                ? "Sending OTP..."
                : timer > 0
                ? `Resend OTP in ${timer}s`
                : "Resend OTP"}
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}
