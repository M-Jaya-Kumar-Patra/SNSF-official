"use client";

import React, { useState, useEffect } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { usePrd } from '@/app/context/ProductContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { postData } from '@/utils/api';
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Image from 'next/image';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Loading from '@/components/Loading';
import { useWishlist } from '@/app/context/WishlistContext';
import { IoCall } from "react-icons/io5";
import WhatsappIcon from '@/components/WhatsappIcon';

const ProductListing = () => {
  const { productsData, setProductsData, getProductsData } = usePrd();
  const { userData, isLogin, setUserData, isCheckingToken } = useAuth();
  const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [showFilterPannel, setShowFilterPannel] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getProductsData().finally(() => setIsLoading(false));
  }, []);

  if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;

  return (
    <div className='w-full relative bg-slate-100'>
      {isLoading && <Loading />}
      <div className='flex min-h-screen justify-center bg-slate-100 border border-slate-100'>
        <div className="container w-full sm:w-[90%] sm:my-4 mx-auto flex gap-4 justify-between">

          {/* Sidebar */}
          <div className={`sm:hidden fixed top-0 left-0 h-full w-[280px] z-[300] bg-white shadow-lg pr-1 pt-1 sm:relative sm:translate-x-0 sm:block transition-transform duration-300 ease-in-out ${showFilterPannel ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="sm:hidden flex justify-end mb-4 mr-3">
              <button
                onClick={() => setShowFilterPannel(false)}
                className="text-xl text-gray-500 hover:text-red-600 font-bold"
              >
                &times;
              </button>
            </div>
            <div className="h-[calc(100%-40px)] overflow-y-auto pr-2 sm:overflow-visible sm:h-auto">
              <SidebarWrapper
                productsData={productsData}
                setProductsData={setProductsData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setTotalPages={() => {}} // Dummy if not using pagination yet
                setShowFilterPannel={setShowFilterPannel}
                setFilterCount={setFilterCount} // ✅ IMPORTANT
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow w-full h-full bg-white p-2 sm:p-3 shadow-lg text-black overflow-x-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
              {productsData?.map((prd) => (
                <div key={prd?._id} className="relative group w-full">
                  <div
                    onClick={() => router.push(`/product/${prd._id}`)}
                    className="w-full min-h-[260px] shadow-md flex flex-col items-center justify-between p-3 bg-white hover:shadow-xl transition duration-300"
                  >
                    <div className="w-full flex flex-col items-center">
                      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-md">
                        <Image
                          src={prd.images[0]}
                          alt={prd.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                      </div>

                      <div
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border absolute top-4 right-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const isFav = userData?.wishlist?.includes(prd._id);
                          if (!isLogin) return router.push("/login");

                          if (isFav) {
                            const wishItem = wishlistData?.find(i => i.productId === prd._id);
                            if (wishItem?._id) {
                              removeFromWishlist(e, wishItem._id, prd._id);
                              setUserData(prev => ({
                                ...prev,
                                wishlist: prev.wishlist.filter(id => id !== prd._id)
                              }));
                            }
                          } else {
                            addToWishlist(e, prd, userData._id);
                            setUserData(prev => ({
                              ...prev,
                              wishlist: [...prev.wishlist, prd._id]
                            }));
                          }
                        }}
                      >
                        {isLogin && userData?.wishlist?.includes(prd._id) ? (
                          <MdFavorite className="text-rose-600 text-xl" />
                        ) : (
                          <MdFavoriteBorder className="text-slate-600 text-xl" />
                        )}
                      </div>

                      <h1 className="text-black text-lg mt-3 font-medium">
                        {prd.name}
                      </h1>
                      <p className="text-gray-500 text-sm">{prd.brand}</p>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  <div className="absolute left-0 top-full w-full z-50 pointer-events-none opacity-0 sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto transition-opacity duration-300">
                    <div className="bg-white shadow-lg p-2 flex gap-2 justify-between">
                      <Button
                        variant="outlined"
                        className="!text-blue-900 !border-blue-900 w-1/2"
                        onClick={async () => {
                          if (!isLogin) return router.push("/login");
                          await postData("/api/enquiries/", {
                            userId: userData._id,
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            productId: prd._id,
                            message: `Whatsapp Enquiry: ${prd.name}`,
                            image: prd.images[0],
                          });
                          window.open(`https://wa.me/919776501230?text=Hi, I'm interested in *${prd.name}*`, "_blank");
                        }}
                      >
                        <WhatsappIcon className="w-5 h-5" /> WhatsApp
                      </Button>
                      <Button
                        variant="contained"
                        className="!bg-rose-600 hover:!bg-rose-700 w-1/2"
                        onClick={async () => {
                          if (!isLogin) return router.push("/login");
                          await postData("/api/enquiries/", {
                            userId: userData._id,
                            contactInfo: {
                              name: userData.name,
                              email: userData.email,
                              phone: userData.phone,
                            },
                            productId: prd._id,
                            message: `Call Enquiry: ${prd.name}`,
                            image: prd.images[0],
                          });
                          window.open("tel:+919776501230");
                        }}
                      >
                        <IoCall className="w-5 h-5" /> Call
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
  );
};

export default ProductListing;
