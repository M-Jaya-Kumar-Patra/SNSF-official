"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api";
import { useAlert } from "../context/AlertContext";

const Page = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const router = useRouter();
    const alert = useAlert();

    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isClient, setIsClient] = useState(false); // 🛡️ Safe check for localStorage

    useEffect(() => {
        if (typeof window !== "undefined") {
            setEmail(localStorage.getItem("userEmail"));
            setName(localStorage.getItem("userName"));
            setUserId(localStorage.getItem("userId"));
            setActionType(localStorage.getItem("actionType"));
            setIsClient(true); // Set once loaded
        }
    }, []);

    if (!isClient) {
        return null; // Or a loading spinner
    }

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

        if (actionType === "forgot-password") {
            localStorage.removeItem("actionType");
            const response = await postData("/api/user/verify-forgot-password-otp", {
                email,
                otp: fullOtp,
            }, false);

            if (!response.error) {
                router.push("/forgot-password");
            } else {
                alert.alertBox({ type: "error", msg: response?.message || "Invalid OTP" });
            }
        } else {
            const response = await postData("/api/user/verifyEmail", {
                email,
                otp: fullOtp,
            }, false);

            if (!response.error) {
                localStorage.removeItem("userEmail");
                sessionStorage.setItem("alert", JSON.stringify({
                    type: "success",
                    msg: response?.message
                }));
                router.push("/login");
            } else {
                alert.alertBox({ type: "error", msg: response?.message || "Invalid OTP" });
            }
        }
    };

    const resendOTP = async () => {
        localStorage.setItem("actionType", "resend-otp");
        const response = await postData("/api/user/resendOTP", { email, name, userId }, false);

        if (!response.error) {
            alert.alertBox({ type: "success", msg: response.message });
            router.push("/verify-otp");
        } else {
            alert.alertBox({ type: "error", msg: response?.message || "Failed to send OTP" });
        }
    };
    return (
        <div className="flex justify-center items-center w-full h-screen bg-gray-100">
            <div className="w-[300px] border border-gray-200 rounded-md shadow bg-white py-4 px-10 flex flex-col items-center">
                <div className="w-full gap-3 text-center">
                    <h1 className="text-[#131e30] my-2 font-bold text-lg">Verify OTP</h1>
                    <h1 className="text-gray-500 text-[13px] mb-4">
                        OTP sent to {localStorage.getItem("userEmail")}
                    </h1>
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
                        className="bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] text-white px-4 py-1 rounded-md mt-1 hover:opacity-90 text-[15px]"
                    >
                        Verify OTP
                    </button>

                     <h3 className="text-[#131e30] text-[14px] cursor-pointer hover:text-[#363fa6] text-center mt-2" onClick={() => router.push("/login")}>Remembered your password? Back to Login</h3>

                    <div className="w-full text-center mt-3">
                        <h3
                            className="text-[#131e30] text-[14px] cursor-pointer hover:text-[#363fa6]"
                            onClick={resendOTP}
                        >
                            Resend OTP
                        </h3>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Page;
