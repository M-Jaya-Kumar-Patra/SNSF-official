"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

const OrderFailedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4 py-10">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-red-100">
        {/* 🔴 Same Animation */}
        <div className="w-[200px] sm:w-[260px] mx-auto mb-6">
          <DotLottieReact
            src="https://lottie.host/e8aac45c-476c-4bdf-87ad-4c502dc89e90/FLpudApNbn.lottie"
            loop={false}
            autoplay
          />
        </div>

        {/* ❌ Error Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-red-600">
          Order Failed
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Something went wrong while processing your order. Please try again later or contact support.
        </p>

        {/* 🔁 Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderFailedPage;
