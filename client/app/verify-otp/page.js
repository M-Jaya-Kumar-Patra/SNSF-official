"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const alert = useAlert();
  const { userData } = useAuth();

  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);


  const [timer, setTimer] = useState(0); // countdown in seconds
const timerRef = useRef(null); // to store interval reference



  useEffect(() => {
  if (userData?.otp === false) {
    router.push("/");
  }

  if (typeof window !== "undefined") {
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    const storedAction = localStorage.getItem("actionType");

    console.log("LocalStorage values on load", { storedEmail, storedName, storedUserId });

    setEmail(storedEmail);
    setName(storedName);
    setUserId(storedUserId);
    setActionType(storedAction);
    setIsClient(true);
  }
}, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isClient) return null;

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };


  const startTimer = () => {
  setTimer(30); // disable for 30 seconds
  timerRef.current = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      alert.alertBox({ type: "error", msg: "Please enter all 6 digits." });
      return;
    }

    setIsSubmitting(true);

    try {
      if (actionType === "forgot-password") {
        localStorage.removeItem("actionType");
        const response = await postData("/api/user/verify-forgot-password-otp", { email, otp: fullOtp }, false);
        if (!response.error) {
          router.push("/forgot-password");
        } else {
          alert.alertBox({ type: "error", msg: response?.message || "Invalid OTP" });
        }
      } else {
        const response = await postData("/api/user/verifyEmail", { email, otp: fullOtp }, false);
        if (!response.error) {
          localStorage.removeItem("userEmail");
          sessionStorage.setItem("alert", JSON.stringify({ type: "success", msg: response?.message }));
          router.push("/login");
        } else {
          alert.alertBox({ type: "error", msg: response?.message || "Invalid OTP" });
        }
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: "Something went wrong. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
  if (timer > 0) return; // prevent multiple clicks

  const response = await postData(
    "/api/user/resendOTP",
    { email, name, userId },
    false
  );

  if (!response.error) {
    alert.alertBox({ type: "success", msg: response.message });
    startTimer(); // ⏱ Start countdown
  } else {
    alert.alertBox({ type: "error", msg: response?.message || "Failed to send OTP" });
  }
};

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-[300px] border border-gray-200 rounded-md shadow bg-white py-4 px-10 flex flex-col items-center">
        <div className="w-full gap-3 text-center">
          <h1 className="text-[#131e30] my-2 font-bold text-lg">Verify OTP</h1>
          <h1 className="text-gray-500 text-[13px] mb-4">OTP sent to {email}</h1>
        </div>

        <form onSubmit={verifyOTP} className="w-full flex flex-col items-center gap-2">
          <div className="flex justify-center gap-2 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="text-black border border-gray-400 w-10 h-10 text-center text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-[#334257]"
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-[120px] h-[36px] flex justify-center items-center 
              !bg-primary-gradient hover:opacity-90 
              transition duration-200 text-white rounded-md mt-2 text-[15px]
              shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.35)] 
              active:scale-95 active:shadow-inner`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Verify OTP"}
          </button>

          <h3
            className="text-[#131e30] text-[14px] cursor-pointer hover:text-[#363fa6] text-center mt-2"
            onClick={() => router.push("/login")}
          >
            Remembered your password? Back to Login
          </h3>

          <div className="w-full text-center mt-3">
            <h3
  className={`text-[#131e30] text-[14px] cursor-pointer ${
    timer > 0 ? "opacity-50 pointer-events-none" : "hover:text-[#363fa6]"
  }`}
  onClick={resendOTP}
>
  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
</h3>

          </div>
        </form>
      </div>
    </div>
  );
}
