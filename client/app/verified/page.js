"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { trackVisitor } from "@/lib/tracking";





const SuccessPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);
   

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  if (!isClient) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-950">
      <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-900/10">
        <Image
          src={getOptimizedCloudinaryUrl("/images/check.png")}
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
