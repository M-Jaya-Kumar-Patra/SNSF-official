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
import Loading from "./Loading";


const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Bestsellers = () => {
    const { prdData } = usePrd();
    const router = useRouter();
    const alert = useAlert();
    const { item, setItem } = useItem();
    const { addToCart, buyNowItem, setBuyNowItem } = useCart();
    const { userData, setUserData, isLogin, setLoading, isCheckingToken } = useAuth();
    const [localLoading, setLocalLoading] = useState(false);


    const [quantity] = useState(1);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        if (!prdData) {
            setLocalLoading(false)
        }
        setHydrated(true);
    }, []);

    const addToCartFun = (prd, userId, quantity) => {
        addToCart(prd, userId, quantity);
        setUserData((prev) => ({
            ...prev,
            shopping_cart: [...(prev?.shopping_cart || []), String(prd._id)],
        }));
    };

    if (!hydrated || isCheckingToken || localLoading) return <Loading />;


    return (
        <div className="flex flex-col items-center mt-2 sm:mt-5 w-full pb-4 sm:pb-8">
            <h1
                className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}
            >
                Best Sellers
            </h1>

            <div className="flex justify-center items-center">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-5 mb-5">
                    {prdData
                        ?.filter((prd) => prd?.isFeatured)
                        .slice(0, 6)
                        .map((prd, index) => (
                            <div
                                key={prd?._id || index}
                                className="group w-[290px] sm:w-[260px] bg-white h-auto flex flex-col justify-between p-4 border hover:shadow-lg transition-transform duration-300 hover:scale-[1.03]"
                            >
                                {/* Product Clickable Section */}
                                <div
                                    className="w-full cursor-pointer"
                                    onClick={() => router.push(`/product/${prd?._id}`)}
                                >
                                    {/* Image */}
                                    <div className="w-full aspect-[4/3] relative overflow-hidden rounded-md">
                                        <Image
                                            src={prd?.images?.[0] || "/images/placeholder.png"}
                                            alt={prd?.name}
                                            fill
                                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                            priority
                                        />
                                    </div>

                                    {/* Text Info */}
                                    <div className="mt-3 text-center">
                                        <h2 className="text-black text-lg font-medium truncate">{prd?.name}</h2>
                                        <p className="text-gray-500 text-sm mt-1 truncate">{prd?.brand}</p>

                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            {prd?.oldPrice && (
                                                <span className="text-sm line-through text-gray-400">₹{prd.oldPrice}</span>
                                            )}
                                            <span className="text-sm font-semibold text-black">₹{prd.price}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 w-full mt-4 opacity-100 sm:group-hover:opacity-100 transition-opacity duration-300">
                                    <Button
                                        variant="outlined"
                                        className="!text-[#1e40af] !border-[#1e40af] bg-white text-nowrap rounded-md px-2 py-2 text-xs w-1/2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isLogin) {
                                                if (userData?.shopping_cart?.includes(String(prd._id))) {
                                                    router.push("/cart");
                                                } else {
                                                    addToCartFun(prd, userData._id, quantity);
                                                }
                                            } else {
                                                router.push("/login");
                                            }
                                        }}
                                    >
                                        {isLogin && userData?.shopping_cart?.includes(String(prd._id))
                                            ? "Go to cart"
                                            : "Add to cart"}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        className="!bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-2 py-2 text-xs w-1/2"
                                        onClick={() => {
                                            setBuyNowItem({ ...prd, quantity: 1 });
                                            router.push("/checkOut");
                                        }}
                                    >
                                        Book Now
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
                    router.push("/BestSellersList");
                }}
            >
                Explore Now
            </Button>
        </div>
    );
};

export default Bestsellers;
