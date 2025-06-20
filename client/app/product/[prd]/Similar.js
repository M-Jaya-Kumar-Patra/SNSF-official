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




const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const New = (props) => {
  const { prdData } = usePrd();
  const scrollRef = useRef(null);
  const router = useRouter()

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
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-400 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-90"
        >
          <ChevronLeft />
        </button>

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
                  className="min-w-[256px] min-h-[320px] p-3 bg-white rounded-md shadow-md 
                  flex flex-col items-center justify-start gap-3 
                   transition-transform duration-300 group cursor-pointer"
                  onClick={() => router.push(`/product/${prd?._id}`)}

                >
                  {/* Product Image */}
                  <div className="w-full h-[220px] overflow-hidden rounded-md">
                    <Image
                      src={prd?.images[0]||prd?.images}
                      alt={prd?.name}
                      className="w-full h-full object-cover transition-transform duration-300 "
                                width={100} height={100}

                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col items-center text-center gap-1 px-2">
                    <h2 className="text-sm font-semibold text-gray-800 truncate w-full">{prd?.name}</h2>

                  </div>

                  {/* Shop Now Button */}
                  <Button
                    size="small"
                    variant="contained"
                    className="!bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-3 py-1 text-xs mt-auto"
                  >
                    Shop Now
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-400 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 bg-opacity-90"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default New;
