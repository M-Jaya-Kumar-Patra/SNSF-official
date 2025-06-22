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
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { useWishlist } from '@/app/context/WishlistContext';
import Image from 'next/image';
import Loading from '@/components/Loading';
import SidebarWrapper from '@/components/SidebarWrapper';

const ProductListing = () => {
    const { prdData, productsData, setProductsData, getProductsData } = usePrd()
    const { userData, isLogin, setIsLogin, setUserData, loading, setLoading, login, logout } = useAuth()
    const { addToCart, buyNowItem, setBuyNowItem, cartItems, getCartItems } = useCart()
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
  Promise.all([getCartItems(), getProductsData()]).finally(() => setIsLoading(false));
}, []);


    //useWishlist

    const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist()

    const [quantity, setQuantity] = useState(1)




    const addToCartFun = async (prd, userId, quantity) => {
        try {
            const added = await addToCart(prd, userId, quantity);
            if (added?.success || true) { // Optional: check your `addToCart` return type
                // Manually update userData.shopping_cart
                setUserData(prev => ({
                    ...prev,
                    shopping_cart: [...(prev?.shopping_cart || []), String(prd._id)]
                }));
            }
        } catch (err) {
            console.error("Error adding to cart", err);
        }
    };





    return (
        <div className='w-full relative bg-slate-100'>
             {isLoading && <Loading />}
            {/* Breadcrumb */}  
                <div role="presentation" className='sticky top-[28px] z-[90] bg-slate-100 py-1 border border-slate-100 w-full text-center'>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="" href="/">Home</Link>
                        <Link underline="hover" color="inherit" href="/ProductListing">Products</Link>
                        <Link underline="hover" color="inherit" href="/Sofas">Sofas</Link>
                    </Breadcrumbs>
                </div>

            {/* Main Container */}
            <div className='flex  min-h-screen justify-center bg-slate-100 border border-slate-100'>
                <div className="container w-[90%]  mx-auto flex gap-4 justify-between">

                    {/* Sidebar */}
                    <div className='w-[240px]  shrink-0 bg-white p-5 shadow-lg text-black '>
               
                        <SidebarWrapper
                            productsData={productsData}
                            setProductsData={setProductsData}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setTotalPages={setTotalPages}

                        />
                    </div>

                    {/* Main Product Content */}
                    <div className='flex-grow h-full bg-white p-5 shadow-lg text-black'>

                        {/* Sort Header */}
                        <div className='w-full bg-slate-100 p-2 flex justify-between items-center rounded'>
                            <p className='pl-3 text-gray-600 text-base'>{`${productsData?.length} Products found`}</p>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-gray-600 font-medium text-[18px]'>Sort By</h1>
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    className='!bg-white px-2 py-1 rounded !text-black   hover:shadow-md uppercase font-medium font-sans text-sm'
                                >
                                    {selectedSortVal}
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
                                >
                                    <MenuItem
                                        onClick={() => handleSortBy('name', 'asc', productsData, 'Name, A to Z')}
                                    >
                                        Name, A to Z
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => handleSortBy('name', 'desc', productsData, 'Name, Z to A')}
                                    >
                                        Name, Z to A
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => handleSortBy('price', 'asc', productsData, 'Price, low to high')}
                                    >
                                        Price, Low to High
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => handleSortBy('price', 'desc', productsData, 'Price, high to low')}
                                    >
                                        Price, High to Low
                                    </MenuItem>

                                </Menu>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex justify-center items-center mt-5">
                            <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-5 place-items-center relative z-0 overflow-visible">
                              
                                {
                                    productsData?.length !== 0 && productsData?.map((prd, index) => (
                                        <div key={prd?._id || index} className="relative group w-full">
                                            {/* Product Card */}
                                            <div

                                                className="w-full min-h-[260px] shadow-md   flex flex-col items-center justify-between p-3 bg-white hover:shadow-[rgba(0,0,0,0.3)] hover:shadow-xl transition duration-300 "
                                            >
                                                <div className="w-full flex flex-col items-center" >
                                                    <Image
                                                        src={prd?.images[0] || prd?.images}
                                                        alt={prd?.name}
                                                        width={250} height={100}
                                                        className="h-[250px] w-auto object-cover"
                                                        onClick={() => router.push(`/product/${prd?._id}`)}
                                                    />
                                                    <div
                                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-4 right-3 cursor-pointer"
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
                                                                        removeFromWishlist(e, itemId, prd._id); // Assuming this function is defined and takes these args
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
                                                        <h1 className="text-black text-[20px] mt-3 font-medium font-sans">
                                                            {prd?.name}
                                                        </h1>
                                                    </div>

                                                    <div className='w-full justify-between items-center'>
                                                        <div className='w-full flex flex-col items-start'>
                                                            <h1 className="text-gray-500 text-[16px] mt-1 font-sans">
                                                                {prd?.brand}
                                                            </h1>

                                                            <div className='mt-2'>

                                                                <div
                                                                    className={`flex justify-center items-center gap-[2px] text-white text-sm font-semibold px-[6px] rounded ${prd?.rating > 4.5
                                                                        ? 'bg-green-600'
                                                                        : prd?.rating > 3.5
                                                                            ? 'bg-green-500'
                                                                            : prd?.rating > 2.5
                                                                                ? 'bg-amber-500'
                                                                                : prd?.rating > 1.5
                                                                                    ? 'bg-orange-500'
                                                                                    : 'bg-red-500'
                                                                        }`}
                                                                >
                                                                    {parseFloat(prd?.rating).toFixed(1)} <IoMdStar />

                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="flex justify-start items-center   gap-2 mt-1">
                                                            <p className="text-[20px] font-semibold text-violet-900">₹{prd?.price}</p>
                                                            {prd?.oldPrice && (
                                                                <p className="text-[18px] line-through text-gray-400">₹{prd?.oldPrice}</p>
                                                            )}
                                                            <p className="text-[20px] font-semibold text-green-700">{prd?.discount}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Dropdown Buttons */}
                                            <div className="absolute left-0 top-full w-full z-50 opacity-0 pointer-events-none group-hover:opacity-100 
          group-hover:pointer-events-auto transition-opacity duration-300 group-hover:shadow-[rgba(0,0,0,0.3)] group-hover:shadow-xl">


                                                <div className="bg-white  shadow-lg p-2 flex gap-2 justify-center">
                                   
                                                    <Button
                                                        variant="outlined"
                                                        className="text-white bg-gray-600 rounded-md px-1 py-1 text-xs w-1/2 text-nowrap"
                                                        onClick={() => {
                                                            if (isLogin) {
                                                                if (cartItems?.some(item => item === String(prd._id))) {
                                                                    router.push("/cart");
                                                                } else {
                                                                    addToCartFun(prd, userData._id, quantity);
                                                                }
                                                            } else {
                                                                router.push("/login");
                                                            }
                                                        }}
                                                    >
                                                        {isLogin
                                                            ? cartItems?.includes(String(prd._id))
                                                                ? 'Go to cart'
                                                                : 'Add to cart'
                                                            : 'Add to cart'}
                                                    </Button>





                                                    <Button
                                                        variant="contained"

                                                        className="!bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-2 py-1 text-xs w-1/2 text-nowrap"
                                                        onClick={() => {
                                                            setBuyNowItem({ ...prd, quantity: 1 });
                                                            router.push("/checkOut");
                                                        }}
                                                        
                                                    >
                                                        Shop now
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