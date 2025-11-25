"use client";

import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Loading from "@/components/Loading";
import Slider from "@/components/Slider";
import Shopbycat from "@/components/Shopbycat";
import Bestsellers from "@/components/Bestsellers";
import New from "@/components/New";
import AllinOne from "@/components/AllinOne";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const { isCheckingToken } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    postData("/api/visit/new", {}, false); // no auth required
  }, []);

  if (isCheckingToken) return <Loading />;

  return (
    <>
      <Toaster position="top-right" />

      {/* Slider Section */}
      <section className="flex justify-center">
        <Slider />
      </section>

      {/* --- AdSense Display Ad (After Slider) --- */}
      <div className="w-full flex justify-center my-5">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9814214172872974"
          data-ad-slot="8091212195"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>

      {/* Shop by Category */}
      <section className="flex justify-center">
        <Shopbycat />
      </section>

      {/* Bestsellers */}
      <section className="flex justify-center">
        <Bestsellers />
      </section>

      {/* Optional In-content Ad after Bestsellers */}
      <div className="w-full flex justify-center my-5">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9814214172872974"
          data-ad-slot="6039763920"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>

      {/* All-in-One Section */}
      <section className="flex justify-center">
        <AllinOne />
      </section>

      {/* New Products */}
      <section className="flex justify-center">
        <New />
      </section>
    </>
  );
}
