"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Righteous } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import Account from "../account/page";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });

const Page = () => {
    const { data: session } = useSession();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Prevents mismatches during SSR hydration

    return session ? (
        <Account />
    ) : (
        <div className="flex justify-center items-center w-full h-screen bg-gray-100">
            <div className="w-[300px] h-[420px] border border-gray-200 rounded-md shadow bg-white p-4 flex flex-col items-center">
                {/* Profile Image */}
                <Image
                    className="w-16 h-16 rounded-full mt-4"
                    src={session?.user?.image || "/images/logo.png"}
                    alt="SNSF Logo"
                    width={64}
                    height={64}
                />

                {/* Heading */}
                <div className="w-full flex items-center gap-3 justify-center">
                    <h1 className="text-[#131e30] my-2 font-bold text-lg">Login to</h1>
                    <h1 className={`text-xl font-bold ${righteous.className} bg-gradient-to-b from-[#8ca4b4] via-[#4c6984] to-[#93b2c7] bg-clip-text text-transparent`}>
                        SNSF
                    </h1>
                </div>

                {/* Email Field */}
                <div className="flex items-center gap-1 my-2">
                    <img className="w-[22px] h-[23px]" src="/images/email.png" alt="Email" />
                    <div className="font-sans flex items-center w-[230px] border-b border-gray-400 focus-within:border-black">
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            className="w-full px-2 py-1 outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="flex items-center gap-1">
                    <img className="w-[25px] h-[23px]" src="/images/padlock.png" alt="Password" />
                    <div className="font-sans flex items-center w-[230px] border-b border-gray-400 focus-within:border-black">
                        <input
                            type="password"
                            placeholder="Enter your Password"
                            className="w-full px-2 py-1 outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Forgot Password */}
                <div className="w-full text-right m-2 mb-0">
                    <h3 className="text-[#131e30] text-[12px] cursor-pointer hover:underline">
                        Forgot Password?
                    </h3>
                </div>

                {/* Sign In Button */}
                <button className="bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] text-white px-4 py-2 rounded-md mt-2 hover:opacity-90">
                    Sign In
                </button>

                <div className="text-[12px] text-gray-500 font-sans mt-2">or</div>

                {/* Google Sign In Button */}
                <button
                    onClick={() => signIn()}
                    className="text-black bg-gray-200 px-4 py-2 rounded-md text-[15px] font-sans border border-gray-600 mt-1 hover:bg-gray-300"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Page;
