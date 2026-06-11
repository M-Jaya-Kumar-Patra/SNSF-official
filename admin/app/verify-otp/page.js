"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "@/components/AuthPanel";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";

const Page = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [adminEmail, setAdminEmail] = useState("");
  const [actionType, setActionType] = useState("");
  const inputRefs = useRef([]);
  const router = useRouter();
  const alert = useAlert();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAdminEmail(localStorage.getItem("adminEmail") || "");
    setActionType(localStorage.getItem("actionType") || "");
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key !== "Backspace") return;

    const nextOtp = [...otp];
    if (otp[index]) {
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  const verifyOTP = async (event) => {
    event.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      alert.alertBox({ type: "error", msg: "Please enter all 6 digits." });
      return;
    }

    if (actionType === "forgot-password") {
      localStorage.removeItem("actionType");
      const res = await postData("/api/admin/verify-forgot-password-otp", {
        email: adminEmail,
        otp: fullOtp,
      });

      if (!res?.error) {
        router.push("/forgot-password");
      } else {
        alert.alertBox({ type: "error", msg: res?.message || "Invalid OTP" });
      }
      return;
    }

    const res = await postData("/api/admin/verifyEmail", {
      email: adminEmail,
      otp: fullOtp,
    });

    if (!res?.error) {
      localStorage.removeItem("adminEmail");
      sessionStorage.setItem(
        "alert",
        JSON.stringify({ type: "success", msg: res?.message })
      );
      router.push("/login");
    } else {
      alert.alertBox({ type: "error", msg: res?.message || "Invalid OTP" });
    }
  };

  const resendOTP = async () => {
    if (typeof window === "undefined") return;
    const email = localStorage.getItem("adminEmail");
    const name = localStorage.getItem("adminName");
    const adminId = localStorage.getItem("adminId");

    const response = await postData("/api/user/resendOTP", { email, name, adminId });

    if (!response.error) {
      alert.alertBox({ type: "success", msg: response.message });
    } else {
      alert.alertBox({ type: "error", msg: response?.message || "Failed to send OTP" });
    }
  };

  return (
    <AuthPanel
      title="Verify OTP"
      subtitle={`Enter the 6 digit code sent to ${adminEmail || "your email"}.`}
      footer={
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-blue-700 hover:text-blue-900"
        >
          Back to login
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
              onChange={(event) => handleChange(event.target, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => (inputRefs.current[index] = element)}
              className="h-12 w-11 rounded-xl border border-slate-300 bg-white text-center text-lg font-bold text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          ))}
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-700"
        >
          Verify OTP
        </button>

        <button
          type="button"
          onClick={resendOTP}
          className="w-full text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          Resend OTP
        </button>
      </form>
    </AuthPanel>
  );
};

export default Page;
