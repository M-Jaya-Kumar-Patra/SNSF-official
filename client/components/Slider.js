"use client";

import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext"; // ✅ import Loading context

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setLoading } = useAuth(); // ✅ Access global loading handler

  // Fetch slides once on mount
  useEffect(() => {
    const getSlides = async () => {
      try {
        setLoading(true); // ✅ Start loading
        const response = await fetchDataFromApi(`/api/homeSlider/getAllSlides`, false);
        setSlides(response?.data || []);
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    getSlides();
  }, [setLoading]);

  // Auto slide every 3 seconds
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  // Manual navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="flex justify-center mt-0">
      <div className="relative w-[500px] h-[300px] md:w-[600px] md:h-[200px] lg:w-[1000px] lg:h-[350px]  shadow flex justify-center items-center overflow-hidden">

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-20"
        >
          <ChevronLeft />
        </button>

        {/* Slide Image */}
        {slides?.[currentIndex]?.images && (
          <Image
            src={slides[currentIndex].images[0]}
            alt={`Slide ${currentIndex + 1}`}
            className="transition-opacity duration-500 object-contain"
            width={500}
            height={500}
          />
        )}

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-20"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Slider;
