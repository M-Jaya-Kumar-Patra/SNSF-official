"use client";

import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext"; // ✅ Added
import Loading from "./Loading";
import { Router } from "next/navigation";


const Slider = () => {
  const { isCheckingToken } = useAuth(); // ✅ Get from context
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    console.log("Slider", isCheckingToken)
    if (isCheckingToken) return; // ✅ Prevent fetching too early

    const getSlides = async () => {
      try {
        setLocalLoading(true);
        const response = await fetchDataFromApi(`/api/homeSlider/getAllSlides`, false);
        setSlides(response?.data || []);
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    getSlides();
  }, [isCheckingToken]); // ✅ Only runs after token is checked

  useEffect(() => {
    if (!slides?.length) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // ✅ Render nothing while loading or waiting for token
  if (isCheckingToken || localLoading || !slides.length) return <Loading/>;

  return (
    <div className="flex justify-center w-full ">
      <div className="relative w-full aspect-[16/9] max-w-[1000px] mx-auto  overflow-hidden shadow-md">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-white text-gray-800 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Image */}
        <Image
          src={slides[currentIndex].images[0]}
          alt={`Slide ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-500 ease-in-out"
          priority
          onClick={router.push(slides[currentIndex].url)}
        />

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-white text-gray-800 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-10">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full cursor-pointer transition ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
