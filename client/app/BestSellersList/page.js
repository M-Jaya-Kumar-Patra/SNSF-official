"use client"

import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import { usePrd } from '@/app/context/ProductContext';
import { postData } from '@/utils/api';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useWishlist } from '../context/WishlistContext';
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import Image from "next/image";
import Skeleton from '@mui/material/Skeleton';


import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";

const ProductListing = () => {
    const { prdData, productsData, setProductsData, getProductsData } = usePrd()
    const { userData, isLogin, setIsLogin, setUserData, loading, setLoading, login, logout, isCheckingToken } = useAuth()
    const router = useRouter()


    useEffect(() => {
        setLoading(false)
        getProductsData()
    }, [isLogin, userData, getProductsData])

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist()

    const getOptimizedCloudinaryUrl = (url) => {
  if (!url?.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
};


    return (
        <div className='w-full bg-slate-100 '>

            <div className='flex w-full min-h-screen justify-center bg-slate-100'>
                <div className="container w-full sm:w-[90%]  sm:my-4 mx-auto ">
                    <div className='flex-grow h-full bg-white p-2  sm:p-3 shadow-lg text-black'>


                        <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-5 place-items-center relative z-0 overflow-visible">
                            {(isCheckingToken || loading || !prdData)
                                ? Array.from({ length: 8 }).map((_, idx) => (
                                    <div key={idx} className="w-full min-h-[260px] shadow-md flex flex-col items-start justify-between p-3 bg-white ">
                                        <Skeleton variant="rectangular" width="100%" height={260} className=" !bg-slate-300/50" />
                                        <Skeleton variant="text" width="90%" height={25} sx={{ mt: 2 }} className=" !bg-slate-300/50" />
                                        <Skeleton variant="text" width="60%" height={20} className=" !bg-slate-300/50" />
                                    </div>
                                ))
                                : prdData
                                    ?.filter(prd => prd?.isFeatured)
                                    .reverse()
                                    .map((prd, index) => (
                                        <div key={prd?._id || index} className="relative group w-full">
                                            <div className="w-full min-h-[260px] shadow-md flex flex-col items-center justify-between p-3 bg-white hover:shadow-[rgba(0,0,0,0.3)] sm:hover:shadow-xl transition duration-300">
                                                <div className="w-full flex flex-col items-center">
                                                    {prd?.images?.length > 0 && prd.images[0] && (
                                                        <div className="w-full aspect-[4/3] relative overflow-hidden cursor-pointer rounded-md" onClick={() => router.push(`/product/${prd?._id}`)}>
                                                            <Image
  src={getOptimizedCloudinaryUrl(prd.images[0])}
  alt={prd?.name || "Product"}
  fill
  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
/>
                                                        </div>

                                                    )}

                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-4 right-3 cursor-pointer"
                                                        onClick={(e) => {
                                                            if (!isLogin) {
                                                                router.push("/login");
                                                            } else {
                                                                const isAlreadyInWishlist = userData?.wishlist?.some(
                                                                    (item) => item === String(prd._id)
                                                                );

                                                                if (isAlreadyInWishlist) {
                                                                    const wishItem = wishlistData?.find(
                                                                        (itemInWishData) => itemInWishData.productId === prd._id
                                                                    );
                                                                    const itemId = wishItem?._id;

                                                                    if (itemId) {
                                                                        removeFromWishlist(e, itemId, prd._id);
                                                                    }
                                                                } else {
                                                                    addToWishlist(prd, userData._id);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {isLogin && userData?.wishlist?.some(item => item === String(prd._id)) ? (
                                                            <MdFavorite className="!text-rose-600 text-[22px]" />
                                                        ) : (
                                                            <MdFavoriteBorder className="text-slate-600 text-[22px]" />
                                                        )}
                                                    </div>

                                                    <div className='w-full '>
                                                        <h1 className="text-black sm:text-[18px] text-[18px] mt-3 font-medium font-sans">
                                                            {prd?.name}
                                                        </h1>
                                                    </div>

                                                    <div className='w-full justify-between items-center'>
                                                        <div className='w-full flex flex-col items-start'>
                                                            <h1 className={prd?.brand ? "text-gray-500 text-[16px] mt-1" : "text-white text-[16px] mt-1 cursor-default"}>
                                                                {prd?.brand||"--- Not mentioned ---"}
                                                            </h1>


                                                        </div>


                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute left-0 top-full w-full z-50  pointer-events-none opacity-0 sm:group-hover:opacity-100 
          sm:group-hover:pointer-events-auto transition-opacity duration-300 sm:group-hover:shadow-[rgba(0,0,0,0.3)] sm:group-hover:shadow-xl">
                                                <div className="bg-white sm:shadow-lg p-2 flex gap-2 justify-center sm:justify-between flex-wrap">
                                                    {/* WhatsApp Button */}
                                                    <Button
                                                        variant="outlined"
                                                        className="!capitalize !text-[#1e40af] !border-[#1e40af] bg-gray-600 rounded-md px-3 py-[6px] text-sm sm:text-base w-[48%] flex items-center justify-center gap-2"
                                                        onClick={async () => {
                                                            if (!isLogin) {
                                                                router.push("/login");
                                                            } else {
                                                                try {
                                                                    await postData("/api/enquiries/", {
                                                                        userId: userData?._id,
                                                                        contactInfo: {
                                                                            name: userData?.name,
                                                                            email: userData?.email,
                                                                            phone: userData?.phone,
                                                                        },
                                                                        productId: prd?._id,
                                                                        message: `Customer opened WhatsApp for "${prd?.name}"`,
                                                                        userMsg: `Enquiry for ${prd?.name} via WhatsApp`,
                                                                        image: prd?.images[0],
                                                                    });

                                                                    const whatsappURL = `https://wa.me/919776501230?text=Hi, I'm interested in *${prd?.name}*.\nHere's the product image:\n${prd?.images[0]}`;
                                                                    window.open(whatsappURL, "_blank");
                                                                } catch (err) {
                                                                    console.error("Enquiry failed:", err);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <WhatsappIcon className="w-5 h-5" />
                                                        <span className="hidden sm:inline">WhatsApp</span>
                                                    </Button>

                                                    {/* Call Button */}
                                                    <Button
                                                        variant="contained"
                                                        className="!capitalize !bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-3 py-[6px] text-sm sm:text-base w-[48%] flex items-center justify-center gap-2"
                                                        onClick={async () => {
                                                            if (!isLogin) {
                                                                router.push("/login");
                                                            } else {
                                                                try {
                                                                    await postData("/api/enquiries/", {
                                                                        userId: userData?._id,
                                                                        name: userData?.name,
                                                                        email: userData?.email,
                                                                        phone: userData?.phone,
                                                                        productId: prd?._id,
                                                                        message: `Direct call initiated for "${prd?.name}"`,
                                                                        userMsg: `Enquiry for ${prd?.name} via Call`,
                                                                        image: prd?.images[0],
                                                                    });

                                                                    window.open("tel:+919776501230");
                                                                } catch (err) {
                                                                    console.error("Enquiry failed:", err);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <IoCall className="w-5 h-5" />
                                                        <span className="hidden sm:inline">Call</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                        </div>




                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductListing;
