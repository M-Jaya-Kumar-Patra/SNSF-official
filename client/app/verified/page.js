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

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-sm">
        <Image
          src={getOptimizedCloudinaryUrl("/images/check.png")}
          alt="Success"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h1>
        <p className="text-gray-700 mb-4">You have registered successfully.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
