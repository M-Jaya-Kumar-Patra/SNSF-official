"use client";
import React, { useState, useEffect } from 'react';
import { fetchDataFromApi } from '@/utils/api';
import { ChevronLeft, ChevronRight } from "lucide-react";





const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getSlides = async () => {
    try {
      const response = await fetchDataFromApi(`/api/homeSlider/getAllSlides`, false);
      setSlides(response?.data || []);
      console.log("slides", slides)
      return
    } catch (error) {
      console.error("Error fetching slides:", error);
    }
  };

  useEffect(() => {
    getSlides();
  }, []);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

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

          {/* Slide Image */}
          {slides?.length > 0 && (
            <img
              src={slides[currentIndex]?.images}
              alt={`Slide ${currentIndex + 1}`}
              className="w-auto h-full transition-opacity duration-500 object-contain"
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
