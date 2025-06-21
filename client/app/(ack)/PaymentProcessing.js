"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PaymentProcessingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-blue-100">
        {/* 🔄 Animation */}
        <div className="w-[200px] sm:w-[260px] mx-auto mb-6">
          <DotLottieReact
            src="https://lottie.host/2bd8105b-5758-4075-99bb-2ad26dc64c4d/m6BRiygRLd.lottie"
            loop
            autoplay
          />
        </div>

        {/* 🧾 Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-2">
          Processing Payment...
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Please wait while we confirm your transaction. Do not refresh or close this window.
        </p>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;
