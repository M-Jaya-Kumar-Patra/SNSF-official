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

    // ✅ Local state for values fetched from localStorage
    const [adminEmail, setAdminEmail] = useState("");
    const [actionType, setActionType] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setAdminEmail(localStorage.getItem("adminEmail") || "");
            setActionType(localStorage.getItem("actionType") || "");
        }
    }, []);

    const handleChange = (element, index) => {
        const value = element.value.replace(/\D/, "");
        if (value) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
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
            const res = await postData("/api/admin/verify-forgot-password-otp", {
                email: adminEmail,
                otp: fullOtp,
            }, false);

            if (!res?.error) {
                router.push("/forgot-password");
            } else {
                alert.alertBox({ type: "error", msg: res?.message || "Invalid OTP" });
            }
        } else {
            const res = await postData("/api/admin/verifyEmail", {
                email: adminEmail,
                otp: fullOtp,
            });

            if (!res?.error) {
                localStorage.removeItem("adminEmail");
                sessionStorage.setItem("alert", JSON.stringify({
                    type: "success",
                    msg: res?.message,
                }));
                router.push("/login");
            } else {
                alert.alertBox({ type: "error", msg: res?.message || "Invalid OTP" });
            }
        }
    };

    const resendOTP = async () => {
        if (typeof window === "undefined") return;
        const email = localStorage.getItem("adminEmail");
        const name = localStorage.getItem("adminName");
        const adminId = localStorage.getItem("adminId");

        const response = await postData("/api/user/resendOTP", { email, name, adminId }, false);

        if (!response.error) {
            alert.alertBox({ type: "success", msg: response.message });
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
                        OTP sent to snsteelfabrication010@gmail.com
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
