"use client";

import React from "react";

const New = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-black m-4">New Arrivals</h1>

      {/* Scrollable Image Container */}
      <div className="w-[800px] overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div className="flex space-x-4">
          <img src="/images/chair/Slide1.PNG" alt="Chair 1" className="w-64 h-auto object-cover" />
          <img src="/images/chair/Slide2.PNG" alt="Chair 2" className="w-64 h-auto object-cover" />
          <img src="/images/chair/Slide3.PNG" alt="Chair 3" className="w-64 h-auto object-cover" />
          <img src="/images/chair/Slide4.PNG" alt="Chair 4" className="w-64 h-auto object-cover" />
          <img src="/images/chair/Slide5.PNG" alt="Chair 5" className="w-64 h-auto object-cover" />
          <img src="/images/chair/Slide6.PNG" alt="Chair 6" className="w-64 h-auto object-cover" />
        </div>
      </div>
    </div>
  );
};

export default New;
