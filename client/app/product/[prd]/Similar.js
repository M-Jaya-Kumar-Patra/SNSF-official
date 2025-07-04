"use client";

import React, { useEffect, useRef, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrd } from "@/app/context/ProductContext";
import { Button } from "@mui/material";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";




const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Similar = (props) => {
  const { prdData } = usePrd();
  const scrollRef = useRef(null);
  const router = useRouter()
  const { isCheckingToken } = useAuth()
  if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;


  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const [similarProducts, setSimilarProducts] = useState([])


  useEffect(() => {
    if (!props.prdId) return;

    fetchDataFromApi(`/api/user/getCategoriesByProductId?productId=${props.prdId}`)
      .then((res) => {
        setSimilarProducts(res?.products);
      });
  }, [props.prdId]);

  return (
    <div className="flex flex-col items-center mt-3 pb-10 bg-slate-100 w-full">
      <h1 className={`text-3xl font-bold text-black mt-10 mb-4 ${joSan.className}`}>
        Similar Products
      </h1>

      {/* Slider Container */}
      <div className="relative w-full max-w-[1100px] mx-auto px-4">
        {/* Left Arrow */}
        {!props.hideArrows && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10  bg-white/60 hover:bg-white text-gray-800 p-1 rounded-full   bg-opacity-90     
          
              sm:p-2  shadow transition text-base sm:text-xl"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Scrollable Product List */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide py-5"
        >
          <div className="inline-flex gap-4">
            {similarProducts?.length !== 0 &&
              similarProducts?.slice(0, 10).reverse().map((prd, index) => (
                <div
                  key={index}
                  className="min-w-[256px] sm:min-w-[240px] bg-white rounded-xl shadow-md flex flex-col p-2 gap-3 transition-transform duration-300 group cursor-pointer hover:scale-[1.02]"
                  onClick={() => router.push(`/product/${prd?._id}`)}
                >
                  {/* Product Image */}
                  <div className="w-full aspect-[4/3] relative overflow-hidden rounded-md">
                    <Image
                      src={prd?.images?.[0] || "/images/placeholder.png"}
                      alt={prd?.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col items-center text-center gap-1 px-2 flex-grow">
                    <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {prd?.name}
                    </h2>
                  </div>
                
                </div>

              ))}
          </div>
        </div>

        {/* Right Arrow */}
        {!props.hideArrows && (
          <button
            onClick={() => scroll("right")}
            className=" absolute right-0  bg-white   bg-opacity-90 
          
         top-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-white text-gray-800 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Similar;
