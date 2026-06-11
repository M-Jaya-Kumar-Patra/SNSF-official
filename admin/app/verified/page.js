"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SuccessPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="auth-light flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8fafc,#eef2ff_52%,#f8fafc)] p-6 text-slate-950">
      <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-900/10">
        <Image
          src="/images/check.png" // Replace with your image path or use a public URL
          alt="Success"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="mb-2 text-2xl font-bold text-green-600">Congratulations!</h1>
        <p className="mb-4 text-slate-600">You have registered successfully.</p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
