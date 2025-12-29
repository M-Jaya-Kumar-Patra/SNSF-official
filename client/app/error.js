"use client";

import { useEffect } from "react";
import { IoRefresh } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // optional: log error to console or monitoring tool
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="max-w-md w-full text-center">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
          Oops! Something went wrong
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base mb-8">
          Don’t worry — this can happen sometimes.  
          Please try again or go back to safety.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-slate-900 text-white font-medium transition"
          >
            <IoRefresh className="text-lg" />
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 rounded-md border border-slate-600 text-slate-800 transition"
          >
            Go to Home
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-slate-700">
          If the problem continues, please contact support.
        </p>
      </div>
    </div>
  );
}
