"use client";

import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext"; // ✅ Added
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import { motion, AnimatePresence, useReducedMotion  } from "framer-motion";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const prefersReducedMotion = useReducedMotion();
  const [isTabActive, setIsTabActive] = useState(true);
const [isMobile, setIsMobile] = useState(false);

const shouldAnimate = slides.length > 0 && !isMobile && !prefersReducedMotion;


useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);


useEffect(() => {
  const handleVisibilityChange = () => {
    setIsTabActive(!document.hidden);
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () =>
    document.removeEventListener("visibilitychange", handleVisibilityChange);
}, []);
useEffect(() => {
  if (!slides.length || !isTabActive) return;

  const timer = setInterval(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, 5000);

  return () => clearInterval(timer);
}, [slides, isTabActive]);


  useEffect(() => {

    const getSlides = async () => {
      try {
        setLocalLoading(true);
        const response = await fetchDataFromApi(
          `/api/homeSlider/getAllSlides`,
          false
        );
        setSlides(response?.data || []);
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    getSlides();
  }, []); // ✅ Only runs after token is checked

  
  const handlePrev = () => {
  setDirection(-1);
  setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
};

const handleNext = () => {
  setDirection(1);
  setCurrentIndex((prev) => (prev + 1) % slides.length);
};

  const getOptimizedCloudinaryUrl = (url, isMobile = false) => {
  if (!url?.includes("/upload/")) return url;

  return url.replace(
    "/upload/",
    isMobile
      ? "/upload/w_900,h_900,c_fit,f_auto,q_80/"
      : "/upload/w_1600,h_1600,c_fit,f_auto,q_90/"
  );
}
  // ✅ Render nothing while loading or waiting for token
  if (localLoading) {
  return (
    <section className="w-full py-10 md:py-12">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.5fr] gap-14 items-center">

        {/* LEFT TEXT SKELETON */}
        <div>
          <Skeleton width={140} height={22} />
          <Skeleton width="80%" height={48} className="mt-3" />
          <Skeleton width="70%" height={48} className="mt-2" />
          <Skeleton width="90%" height={18} className="mt-4" />
          <Skeleton width="60%" height={18} className="mt-2" />
          <Skeleton
            variant="rounded"
            width={160}
            height={44}
            className="mt-6"
          />
        </div>

        {/* CENTER PRODUCT SKELETON */}
        <div className="flex justify-center">
          <Skeleton
            variant="circular"
            width={320}
            height={320}
            sx={{
              boxShadow:
                "inset 0 0 40px rgba(15,23,42,0.12), 0 20px 60px rgba(15,23,42,0.18)",
            }}
          />
        </div>

        {/* RIGHT LIST SKELETON (DESKTOP ONLY) */}
        <div className="hidden lg:flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="circular" width={48} height={48} />
              <Skeleton width="70%" height={16} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


  const sideItemVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
};

const sideItemTransition = {
  duration: 0.45,
  ease: "easeOut",
};

const textContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const textItem = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const splitWords = (text = "") => {
  return text.split(" ");
};

const typingContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: isMobile ? 0.04 : 0.12,
    },
  },
};

const typingWord = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};





return (
  <section className="relative w-full 
py-10 md:py-12 pt-8 md:pt-12 lg:pt-12 overflow-hidden">

  
    {/* subtle ambient glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/40 blur-3xl" />
    </div>

    <div className="relative max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.5fr] gap-14 items-center">

      {/* LEFT CONTENT */}
      
<AnimatePresence mode="wait" >
  <motion.div
    key={currentIndex}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* TAGLINE */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sm:text-[22px] font-medium text-slate-700 tracking-wider mb-2 max-w-sm"
    >
      {slides[currentIndex]?.tagline}
    </motion.p>

    {/* TITLE — SOFT TYPING */}
   <motion.h1
  variants={shouldAnimate ? typingContainer : undefined}
  initial={!isMobile && !prefersReducedMotion ? "hidden" : false}
  animate={!isMobile && !prefersReducedMotion ? "show" : false}
  className="
    text-4xl md:text-5xl
    font-bold text-slate-900
    leading-tight
    break-words
  "
>
  {!isMobile && !prefersReducedMotion
    ? splitWords(slides[currentIndex]?.title).map((word, i) => (
        <motion.span
          key={i}
          variants={typingWord}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))
    : slides[currentIndex]?.title}
</motion.h1>




    {/* DESCRIPTION */}
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="mt-4 max-w-md text-slate-600 text-sm sm:text-base
 leading-relaxed"
    >
      {slides[currentIndex]?.description}
    </motion.p>

    {/* CTA */}
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onClick={() =>
        slides[currentIndex]?.url &&
        router.push(slides[currentIndex].url)
      }
      className="
        mt-7 px-7 py-3 rounded-lg
        bg-slate-900 text-white text-sm font-semibold
        shadow-lg hover:shadow-xl
        flex items-center gap-2
      "
    >
      View Details <span className="text-lg">→</span>
    </motion.button>
  </motion.div>
</AnimatePresence>




      {/* CENTER PRODUCT */}
      <div className="relative flex justify-center items-center">

  {/* LEFT ARROW */}
  <button
  onClick={handlePrev}
  className="
    absolute -left-12 z-20
    w-10 h-10
    flex items-center justify-center
    rounded-full
    bg-white/80
    border border-slate-200
    text-slate-600
    shadow-sm
    opacity-0
    group-hover:opacity-100
    transition-all duration-300
    hover:bg-white hover:shadow-md
  "
>
  <ChevronLeft className="w-5 h-5" />
</button>

<div className="relative">
  <div className="
    absolute inset-0
    bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.08),transparent_65%)]
    rounded-full
  " />
  {/* STATIC CIRCLE (NO ANIMATION HERE) */}
  <div
  className="
    min-w-[320px] min-h-[320px]
    md:min-w-[420px] md:min-h-[420px]
    rounded-full
    bg-white
    border border-slate-200
    flex items-center justify-center
    shadow-[inset_0_0_60px_rgba(15,23,42,0.12),0_30px_80px_rgba(15,23,42,0.22)]
    overflow-hidden
  "
>

    {/* ONLY PRODUCT IMAGE ANIMATES */}
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center"
         onClick={() =>
        slides[currentIndex]?.url &&
        router.push(slides[currentIndex].url)
      }
      >
        <Image
          src={getOptimizedCloudinaryUrl(slides[currentIndex]?.images[0], isMobile) || "/images/placeholder.jpg"}
          alt={slides[currentIndex]?.title || "Furniture"}
          width={420}
          height={420}
            className="object-contain scale-100 hover:scale-110 transition-transform duration-700 ease-out"
          priority
        />
      </motion.div>
    </AnimatePresence>
  </div>
</div>
  {/* RIGHT ARROW */}
  <button
    onClick={handleNext}
    className="
      absolute -right-6 z-20
      bg-white border border-slate-200
      opacity-0
      p-2 rounded-full shadow
      hover:bg-slate-100
    "
  >
    <ChevronRight className="text-slate-700" />
  </button>
</div>


      {/* RIGHT SIDE LIST – CALM & PREMIUM */}
<div className="hidden lg:flex flex-col gap-2">
  {slides.map((slide, index) => {
    const isActive = index === currentIndex;

    return (
      <motion.div
        key={slide._id || index}
        onClick={() => {
          setDirection(index > currentIndex ? 1 : -1);
          setCurrentIndex(index);
        }}
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0.55,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          relative
          flex items-center gap-3
          px-3 py-2
          cursor-pointer
        "
      >
        {/* ACTIVE INDICATOR */}
        <motion.div
          layout
          className="
            absolute left-0 top-1/2 -translate-y-1/2
            h-8 w-[2px]
            rounded-full
            bg-slate-900
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* IMAGE */}
        <motion.div
          animate={{
            scale: isActive ? 1 : 0.92,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="
            min-w-12 min-h-12
            rounded-full
            bg-white
            border border-slate-200
            flex items-center justify-center 
          "
        >
          <Image
            src={getOptimizedCloudinaryUrl(slide?.images[0], isMobile) || "/images/placeholder.jpg"}
            alt={slide?.title}
            width={48}
            height={48}
            className="object-contain"
          />
        </motion.div>

        {/* TEXT */}
        <motion.p
          animate={{
            y: isActive ? 0 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`text-sm  ${
            isActive
              ? "text-slate-900 font-medium"
              : "text-slate-500"
          }`}
        >
          {slide?.title}
        </motion.p>
      </motion.div>
    );
  })}
</div>



    </div>
  </section>
);



};

export default Slider;
