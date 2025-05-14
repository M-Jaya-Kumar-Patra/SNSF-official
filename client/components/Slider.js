// "use client"; // Required for Next.js App Router

// import { useState, useEffect } from "react";

// const images = [
//   "/images/chair/Slide1.PNG",
//   "/images/chair/Slide2.PNG",
//   "/images/chair/Slide3.PNG",
//   "/images/chair/Slide4.PNG",
//   "/images/chair/Slide5.PNG",
//   "/images/chair/Slide6.PNG",
//   "/images/chair/Slide7.PNG",
//   "/images/chair/Slide8.PNG",
//   "/images/chair/Slide9.PNG",
//   "/images/chair/Slide10.PNG",
//   "/images/chair/Slide11.PNG",
//   "/images/chair/Slide12.PNG",
//   "/images/chair/Slide13.PNG",
//   "/images/chair/Slide14.PNG",
//   "/images/chair/Slide15.PNG",
//   "/images/chair/Slide16.PNG",
//   "/images/chair/Slide17.PNG",
//   "/images/chair/Slide18.PNG",
//   "/images/chair/Slide19.PNG",
//   "/images/chair/Slide20.PNG",
//   "/images/chair/Slide21.PNG",
//   "/images/chair/Slide22.PNG",
//   "/images/chair/Slide23.PNG",
//   "/images/chair/Slide24.PNG",
//   "/images/chair/Slide25.PNG",
//   "/images/chair/Slide26.PNG",
//   "/images/chair/Slide27.PNG",
//   "/images/chair/Slide28.PNG",
//   "/images/chair/Slide29.PNG",
//   "/images/chair/Slide30.PNG"
// ];

// const ImageSlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 300); // Change image every 3 seconds

//     return () => clearTimeout(timer); // Cleanup timeout on component unmount
//   }, [currentIndex]); // Re-run effect when currentIndex changes

//   return (
//     <div className="relative w-full max-w-2xl mx-auto">
//       <img
//         src={images[currentIndex]}
//         alt={`Slide ${currentIndex + 1}`}
//         className="w-auto h-[40vh] rounded-lg transition-opacity duration-500"
//       />

//       {/* Navigation Buttons */}
//       <button
//         className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-white p-2 rounded-full"
//         onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
//       >
//         ◀
//       </button>
//       <button
//         className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-white p-2 rounded-full"
//         onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
//       >
//         ▶
//       </button>
//     </div>
//   );
// };

// export default ImageSlider;

"use client"
import React from 'react'
import { useState, useEffect } from 'react';

const images = [
    "/images/chair/Slide1.PNG",
    "/images/chair/Slide2.PNG",
    "/images/chair/Slide3.PNG",
    "/images/chair/Slide4.PNG",
    "/images/chair/Slide5.PNG",
    "/images/chair/Slide6.PNG",
    "/images/chair/Slide7.PNG",
    "/images/chair/Slide8.PNG",
    "/images/chair/Slide9.PNG"
];



const Slider = () => {

  const [currentIndex, setCurrentIndex] = useState(0) 
  useEffect(() => {
        const timer = setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
    
        return () => clearTimeout(timer); // Cleanup timeout on component unmount
      }, [currentIndex]); // Re-run effect when currentIndex changes

  return (
    <div className='w-[1000px] h-[350px] shadow flex justify-center'>
      <img src={images[currentIndex]} 
      alt={`Slide ${currentIndex + 1}`}
      className="w-auto h-[full] rounded-lg transition-opacity duration-500"
      />
    </div>
   
  )
}

export default Slider
