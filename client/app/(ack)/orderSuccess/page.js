"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl text-center max-w-md w-full"
      >
        {/* Animation */}
        <div className="w-[250px] sm:w-[300px] mx-auto mb-6">
          <DotLottieReact
            src="https://lottie.host/90553a7e-4b2d-439a-9ef0-127e6fcc3e62/rlPQVly9iA.lottie"
            loop={false}
            autoplay
          />
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          🎉 Thank you for your purchase. We’ve sent a confirmation to your email.
        </p>

        {/* Button */}
        <div className="mt-6 flex flex-col gap-3 items-center">
  <Link
    href="/"
    className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-6 py-2 rounded-full shadow-md transition duration-300"
  >
    Continue Shopping
  </Link>
  <Link
    href="/enquires"
    className="font-semibold text-black text-sm sm:text-base px-6 py-2 rounded-full shadow-md transition duration-300"
  >
    My Enquries
  </Link>
</div>

      </motion.div>
    </div>
  );
};

export default Page;
