"use client"

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { usePrd } from '@/app/context/ProductContext';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { IoMdStar } from "react-icons/io";
import { fetchDataFromApi, postData } from '@/utils/api';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { useWishlist } from '@/app/context/WishlistContext';
import Image from 'next/image';
import Loading from '@/components/Loading';
import SidebarWrapper from '@/components/SidebarWrapper';
import { FaFilter, FaSortAmountDown } from "react-icons/fa"; // Import icons
import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";




const ProductListing = () => {
    const { prdData, productsData, setProductsData, getProductsData } = usePrd()
    const { userData, isLogin, setIsLogin, setUserData, loading, setLoading, login, logout, isCheckingToken } = useAuth()
    const router = useRouter()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;




    const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z")


    const handleSortBy = async (name, order, products, value) => {
        setIsLoading(true);
        setSelectedSortVal(value);
        try {
            const res = await postData(`/api/product/sortBy`, {
                products,
                sortBy: name,
                order,
            }, false);
            setProductsData(res?.products);
        } finally {
            setIsLoading(false);
            setAnchorEl(null);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        Promise.all([getProductsData()]).finally(() => setIsLoading(false));
    }, []);


    //useWishlist

    const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist()

    const [quantity, setQuantity] = useState(1)




    const [filterCount, setFilterCount] = useState(0)

    const [showFilterPannel, setShowFilterPannel] = useState(false)




    return (
        <div className='w-full relative bg-slate-100'>
            {isLoading && <Loading />}
            {/* Main Container */}
            <div className='flex  min-h-screen justify-center bg-slate-100 border border-slate-100'>
                <div className="container w-full  sm:w-[90%]     sm:my-4 mx-auto flex gap-4 justify-between">

                    {/* Sidebar */}


                    {/* Filter Panel */}
                    <div
                        className={`sm:hidden fixed top-0 left-0 h-full w-[280px] z-50 bg-white shadow-lg pr-1 pt-1  sm:p-5 text-black transition-transform duration-300 ease-in-out
    ${showFilterPannel ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0 sm:block  z-[300] sm:z-0`}
                    >
                        {/* Close Button for Mobile */}
                        <div className="sm:hidden flex justify-end mb-4 mr-3">
                            <button
                                onClick={() => setShowFilterPannel(false)}
                                className="text-xl text-gray-500 hover:text-red-600 font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Scrollable content for mobile */}
                        <div className="h-[calc(100%-40px)] overflow-y-auto pr-2 sm:overflow-visible sm:h-auto">
                            <SidebarWrapper
                                productsData={productsData}
                                setProductsData={setProductsData}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                setTotalPages={setTotalPages}
                                setShowFilterPannel={setShowFilterPannel}
                                setFilterCount={setFilterCount}
                            />
                        </div>
                    </div>



                    {/* Main Product Content */}
                    <div className="flex-grow w-full h-full bg-white p-2 sm:p-3  shadow-lg text-black overflow-x-hidden">




                        {/* Product Grid */}
                        <div className="flex  justify-center items-center mt-0 sm:mt-1 ">
                            <div className="w-full max-w-[100vw] sm:px-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-5 place-items-center relative z-0 overflow-visible">

                                {
                                    productsData?.length !== 0 && productsData?.map((prd, index) => (
                                        <div key={prd?._id || index} className="relative group w-full">
                                            {/* Product Card */}
                                            <div
                                                onClick={() => router.push(`/product/${prd?._id}`)}

                                                className="w-full min-h-[260px] shadow-md   flex flex-col items-center justify-between p-3 bg-white hover:shadow-[rgba(0,0,0,0.3)] hover:shadow-xl transition duration-300 "
                                            >
                                                <div className="w-full flex flex-col items-center" >
                                                    <div className="w-full aspect-[4/3] relative overflow-hidden rounded-md">
                                                        <Image
                                                            src={prd?.images[0] || prd?.images}
                                                            alt={prd?.name}
                                                            fill
                                                            unoptimized
                                                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                        />
                                                    </div>

                                                    <div
                                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-4 right-3 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // ✅ prevents parent click

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

                                                                        // ✅ Also update local userData context
                                                                        setUserData((prev) => ({
                                                                            ...prev,
                                                                            wishlist: (prev?.wishlist || []).filter(id => id !== String(prd._id)),
                                                                        }));
                                                                    }
                                                                } else {
                                                                    addToWishlist(e, prd, userData._id);

                                                                    // ✅ Update local userData context
                                                                    setUserData((prev) => ({
                                                                        ...prev,
                                                                        wishlist: [...(prev?.wishlist || []), String(prd._id)],
                                                                    }));
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
                                                        <h1 className="text-black sm:text-[19px] text-[23px] mt-3 font-medium font-sans">
                                                            {prd?.name}
                                                        </h1>
                                                    </div>

                                                    <div className='w-full justify-between items-center'>
                                                        <div className='w-full flex flex-col items-start'>
                                                            <h1 className="text-gray-500 text-[16px] mt-1 font-sans">
                                                                {prd?.brand}
                                                            </h1>


                                                        </div>


                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Dropdown Buttons */}
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
                                                                        name: userData?.name,
                                                                        email: userData?.email,
                                                                        phone: userData?.phone,
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
                                                                        contactInfo: {
                                                                            name: userData?.name,
                                                                            email: userData?.email,
                                                                            phone: userData?.phone,
                                                                        },
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
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductListing;  