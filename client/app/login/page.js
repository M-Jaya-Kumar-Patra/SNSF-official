"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Righteous, Poppins } from "next/font/google";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({subsets: ["latin"], weight: '300' })

const Page = () => {
    const { data: session } = useSession();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        if (session) {
            router.push("/profile"); // Redirect to profile page if logged in
        }
    }, [session]);

    if (!isClient) return null;

    return (
        <div className="flex justify-center items-center w-full h-screen bg-gray-100">
            <div className="w-[300px] h-[420px] border border-gray-200 rounded-md shadow bg-white p-4 flex flex-col items-center">
                <Image
                    className="w-16 h-16 rounded-full mt-4"
                    src="/images/logo.png"
                    alt="SNSF Logo"
                    width={64}
                    height={64}
                />
                <div className="w-full flex items-center gap-3 justify-center">
                    <h1 className="text-[#131e30] my-2 font-bold text-lg">Login to</h1>
                    <h1 className={`text-xl font-bold ${righteous.className} bg-gradient-to-b from-[#8ca4b4] via-[#4c6984] to-[#93b2c7] bg-clip-text text-transparent`}>
                        SNSF
                    </h1>
                </div>

                {/* Email Field */}
                <div className="flex items-center gap-1 my-2 mb-3">
                    <Image className="w-[22px] h-[23px]" src="/images/email.png" alt="Email" width={22} height={23} />
                    <input type="email" placeholder="Enter your Email" className=" text-[15px] w-[230px] px-2 py-1 border-b border-gray-400 outline-none text-gray-700 placeholder-gray-400" />
                </div>

                {/* Password Field */}
                <div className="flex items-center gap-1 mb-1">
                    <Image className="w-[25px] h-[23px] " src="/images/padlock.png" alt="Password" width={25} height={23} />
                    <input type="password" placeholder="Enter your Password" className="text-[15px] w-[230px] px-2 py-1 border-b border-gray-400 outline-none text-gray-700 placeholder-gray-400" />
                </div>

                {/* Forgot Password */}
                <div className="w-full text-right m-2 mb-4">
                    <h3 className="text-[#131e30] text-[12px] cursor-pointer hover:underline">Forgot Password?</h3>
                </div>

                {/* Sign In Button */}
                <button className="bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] text-white px-4 py-1 rounded-md mt-2 hover:opacity-90 text-[15px]">
                    Sign In
                </button>

                <div className="text-[12px] text-gray-500 font-sans my-2">or</div>

                {/* Google Sign-In Button */}
                <div className="provider">
                    <button
                        onClick={() => signIn("google")}
                        className="flex items-center gap-2 px-4 py-1 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition h-[35px] w-[230px] text-[15px] justify-center"
                    >
                    <Image loading="eager" height={20} width={20} src="https://authjs.dev/img/providers/google.svg" alt="Google Logo"  />
                        <span className="text-gray-700 text-base font-sans">Sign in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
