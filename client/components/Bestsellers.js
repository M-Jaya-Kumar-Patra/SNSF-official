"use client";

import React, { useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import { usePrd } from "@/app/context/ProductContext";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/context/AlertContext";
import { useItem } from "@/app/context/ItemContext";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Bestsellers = () => {
  const { prdData } = usePrd();
  const router = useRouter();
  const alert = useAlert();
  const { item, setItem } = useItem();
  const { addToCart, buyNowItem, setBuyNowItem } = useCart();
  const { userData, setUserData, isLogin, setLoading, isCheckingToken } = useAuth();

  const [quantity] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const addToCartFun = (prd, userId, quantity) => {
    addToCart(prd, userId, quantity);
    setUserData((prev) => ({
      ...prev,
      shopping_cart: [...(prev?.shopping_cart || []), String(prd._id)],
    }));
  };

  if (!hydrated || isCheckingToken) return null;

  return (
    <div className="flex flex-col items-center mt-2 sm:mt-5 w-full pb-4 sm:pb-8">
      <h1
        className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}
      >
        Best sellers
      </h1>

      <div className="flex justify-center items-center">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-5 mb-5">
          {prdData
            ?.filter((prd) => prd?.isFeatured)
            .slice(0, 6)
            .map((prd, index) => (
              <div
                key={prd?._id || index}
                className="group w-100 h-[370px] sm:w-[260px] sm:min-h-[400px] flex flex-col items-center justify-between p-3 gap-2 transition duration-300 hover:scale-105 hover:shadow-xl border sm:border-none"
              >
                <div
                  className="w-full flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    setLoading(true);
                    router.push(`/product/${prd?._id}`);
                  }}
                >
                  <div className="w-full h-[200px] sm:h-[220px] md:h-[230px] lg:h-[240px] relative rounded-md overflow-hidden">
                    <Image
                      src={prd?.images?.[0] || "/images/placeholder.png"}
                      alt={prd?.name}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      priority
                    />
                  </div>

                  <h1 className="text-black text-[19px] mt-3 font-medium font-sans text-center">
                    {prd?.name}
                  </h1>
                  <h1 className="text-gray-500 text-[16px] mt-1 font-sans text-center">
                    {prd?.brand}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {prd?.oldPrice && (
                      <p className="text-sm line-through text-gray-400">
                        ₹{prd?.oldPrice}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-black">
                      ₹{prd?.price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full mt-2 opacity-100 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outlined"
                    className="text-white bg-gray-600 rounded-md px-1 py-1 text-xs w-1/2 text-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLogin) {
                        if (
                          userData?.shopping_cart?.includes(String(prd._id))
                        ) {
                          setLoading(true);
                          router.push("/cart");
                        } else {
                          addToCartFun(prd, userData._id, quantity);
                        }
                      } else {
                        setLoading(true);
                        router.push("/login");
                      }
                    }}
                  >
                    {isLogin &&
                    userData?.shopping_cart?.includes(String(prd._id))
                      ? "Go to cart"
                      : "Add to cart"}
                  </Button>

                  <Button
                    variant="contained"
                    className="!bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-0 py-2 w-1/2 text-xs text-nowrap"
                    onClick={() => {
                      setBuyNowItem({ ...prd, quantity: 1 });
                      setLoading(true);
                      router.push("/checkOut");
                    }}
                  >
                    Shop now
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Button
        variant="contained"
        className="!bg-blue-900 hover:!bg-blue-950 text-white rounded-md px-6 py-2"
        onClick={() => {
          setLoading(true);
          router.push("/BestSellersList");
        }}
      >
        Explore Now
      </Button>
    </div>
  );
};

export default Bestsellers;
