"use client";
import React, { useState } from "react";
import { MdStar } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useCart } from "../context/CartContext";


const Page = () => {
  const productImages = [
    "images/chair/Slide1.png",
    "images/chair/Slide2.png",
    "images/chair/Slide3.png",
    "images/chair/Slide4.png",
    "images/chair/Slide5.png",
    "images/chair/Slide6.png"
  ];

  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  const { addToCart } = useCart();

  const product = {
    id: 1,
    name: "Single seater Stainless Steel Chair",
    price: 2499,
    image: selectedImage,
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-[1020px] my-3 mx-auto flex justify-between bg-white">
        {/* Left: Image Section */}
        <div className="image w-[400px] h-[350px] p-[2px] border border-slate-400 m-3 mr-0 flex gap-[2px]">
          <div className="w-[75px] overflow-y-auto h-full p-[2px] border scrollbar-hide">
            <ul className="space-y-1">
              {productImages.map((src, idx) => (
                <li
                  key={idx}
                  className={`border rounded cursor-pointer ${selectedImage === src ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedImage(src)}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-[128px] h-[64px] object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="w-[319px] bg-gray-100 h-[300px] flex justify-center items-center">
              <img
                className="h-[300px] w-full object-contain border"
                src={selectedImage}
                alt="Selected Product"
              />
            </div>

            <div className="flex justify-around my-2 gap-2">
              <button
                className="w-[50%] px-4 py-1 bg-yellow-500 font-semibold text-white rounded active:bg-yellow-300 "
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
              <button className="w-[50%] px-4 py-1 bg-green-700 text-white font-semibold rounded active:bg-green-500">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="details w-[600px] p-4">
          <h2 className="text-2xl font-medium mb-3 text-gray-800">
            Single seater Stainless Steel Chair
          </h2>

          <div className='w-[50px] h-[25px] bg-green-700 text-white rounded-sm flex justify-center items-center gap-[1px]'>
            4.5 <MdStar />
          </div>

          <div className="text-black mt-4 text-3xl font-semibold flex gap-[1px] items-center text-center">
            <FaIndianRupeeSign /> 2499
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
