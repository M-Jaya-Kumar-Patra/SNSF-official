"use client";

import React, { useState, useEffect } from 'react';
import { fetchDataFromApi } from '@/utils/api';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch slides once on mount
  useEffect(() => {
    const getSlides = async () => {
      try {
        const response = await fetchDataFromApi(`/api/homeSlider/getAllSlides`, false);
        setSlides(response?.data || []);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    getSlides();
  }, []);

  // Auto slide every 3 seconds
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  // Optional: Manual navigation (left/right buttons)
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };


  
  return (
    <>
      <div className="flex justify-center mt-0">
        <div className="relative w-[1000px] h-[350px] shadow flex justify-center items-center overflow-hidden ">

          {/* Left Arrow */}
          <button
          onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? slides?.length - 1 : prevIndex - 1
              )
            }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-20"
        >
          <ChevronLeft />
        </button>

        {console.log("slides", slides)}

       {/* Slide Image */}
{slides?.[currentIndex]?.images && (
  <Image
    src={slides[currentIndex].images[0]} // ✅ No need for fallback here
    alt={`Slide ${currentIndex + 1}`}
    className="transition-opacity duration-500 object-contain"
    width={500}
    height={500}
  />
)}



          {/* Right Arrow */}
          
          <button
                    onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
              )
            }
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-20"
                  >
                    <ChevronRight />
                  </button>
        </div>
      </div>
    </>

  );
};

export default Slider;
