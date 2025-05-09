"use client";

import React, { useRef } from "react";
import { Josefin_Sans } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const New = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior:"smooth",
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-5 pb-10 bg-slate-100 w-full">
      <h1 className={`text-3xl font-bold text-black mt-10 mb-14 ${joSan.className}`}>
        New Arrivals
      </h1>

      {/* Slider Container with Arrows */}
      <div className="relative w-[800px]">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-20"
        >
          <ChevronLeft />
        </button>

        {/* Scrollable Image Container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth"
        >
          <div className="flex space-x-4 px-10">
            <img src="/images/chair/Slide1.PNG" alt="Chair 1" className="w-64 h-auto object-cover" />
            <img src="/images/chair/Slide2.PNG" alt="Chair 2" className="w-64 h-auto object-cover" />
            <img src="/images/chair/Slide3.PNG" alt="Chair 3" className="w-64 h-auto object-cover" />
            <img src="/images/chair/Slide4.PNG" alt="Chair 4" className="w-64 h-auto object-cover" />
            <img src="/images/chair/Slide5.PNG" alt="Chair 5" className="w-64 h-auto object-cover" />
            <img src="/images/chair/Slide6.PNG" alt="Chair 6" className="w-64 h-auto object-cover" />
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-20"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default New;
