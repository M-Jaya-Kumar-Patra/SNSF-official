"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useWishlist } from "@/app/context/WishlistContext";
import Image from "next/image";
import Button from "@mui/material/Button";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";
import Loading from "@/components/Loading";
import Skeleton from "@mui/material/Skeleton";

const ProductListing = () => {
  const searchParams = useSearchParams();
  const catId = searchParams.get("catId");
  const subCatId = searchParams.get("subCatId");
  const thirdSubCatId = searchParams.get("thirdSubCatId");
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const {
    userData,
    isLogin,
    isCheckingToken,
  } = useAuth();
  const {
    addToWishlist,
    removeFromWishlist,
    wishlistData,
  } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        let url = null;
        if (catId) {
          url = `/api/product/gapsByCatId/${catId}`;
        } else if (subCatId) {
          url = `/api/product/gapsBySubCatId/${subCatId}`;
        } else if (thirdSubCatId) {
          url = `/api/product/gapsByThirdCatId/${thirdSubCatId}`;
        }
        if (!url) {
          setProducts([]);
          return;
        }
        const res = await fetchDataFromApi(url, false);
                console.log("Product:", res?.data);

        setProducts(res?.data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
    window.scrollTo(0,0)
  }, [catId, subCatId, thirdSubCatId]);

  if (isCheckingToken || loadingProducts) return <Loading />;

  return (
    <div className="w-full bg-slate-100 min-h-screen flex justify-center">
      <div className="container w-full sm:w-[90%]  sm:my-4 mx-auto">
        <div className="bg-white min-h-screen p-2 sm:p-3 shadow-lg text-black">
          <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 l g:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-5 place-items-center relative z-0">
           

            {(  isCheckingToken || loadingProducts)
  ? Array.from({ length: 8 }).map((_, idx) => (
      <div key={idx} className="w-full min-h-[260px] shadow-md flex flex-col items-start justify-between p-3 bg-white ">
        <Skeleton variant="rectangular" width="100%" height={260}  className="rounded-md !bg-slate-300/50"/>
        <Skeleton variant="text" width="90%" height={25} sx={{ mt: 2 }} className=" !bg-slate-300/50" />
        <Skeleton variant="text" width="60%" height={20} className=" !bg-slate-300/50" />
      </div>
    ))
  : products.length > 0 && products.slice().reverse().map((prd, index) => (
                <div key={prd?._id || index} className="relative group w-full">
                <div className="w-full min-h-[260px] shadow-md flex flex-col items-center justify-between p-3 bg-white hover:shadow-xl transition duration-300">
                  <div className="w-full flex flex-col items-center">
                    {prd?.images?.[0] && (
                      <div
                        className="w-full aspect-[4/3] relative overflow-hidden cursor-pointer rounded-md"
                        onClick={() => router.push(`/product/${prd?._id}`)}
                      >
                        <Image
                          src={prd.images[0]}
                          alt={prd.name || "Product"}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-md absolute top-4 right-3 cursor-pointer"
                      onClick={(e) => {
                        if (!isLogin) return router.push("/login");
                        const isInWishlist = userData?.wishlist?.includes(String(prd._id));
                        const wishItem = wishlistData?.find((item) => item.productId === prd._id);
                        const itemId = wishItem?._id;
                        if (isInWishlist && itemId) {
                          removeFromWishlist(e, itemId, prd._id);
                        } else {
                          addToWishlist(prd, userData._id);
                        }
                      }}
                    >
                      {isLogin && userData?.wishlist?.includes(String(prd._id)) ? (
                        <MdFavorite className="text-rose-600 text-[22px]" />
                      ) : (
                        <MdFavoriteBorder className="text-slate-600 text-[22px]" />
                      )}
                    </div>
                    <div className="w-full mt-3">
                      <h1 className="text-black text-[18px] font-medium">{prd?.name}</h1>
                      <p className="text-gray-500 text-[16px] mt-1">{prd?.brand}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute left-0 top-full w-full z-50 pointer-events-none opacity-0 sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto transition-opacity duration-300">
                  <div className="bg-white shadow-lg p-2 flex gap-2 justify-center sm:justify-between flex-wrap">
                    <Button
                      variant="outlined"
                      className="!capitalize !text-[#1e40af] !border-[#1e40af] bg-gray-600 rounded-md px-3 py-[6px] text-sm sm:text-base w-[48%] flex items-center justify-center gap-2"
                      onClick={async () => {
                        if (!isLogin) return router.push("/login");
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
                          const whatsappURL = `https://wa.me/919776501230?text=Hi, I'm interested in *${prd?.name}*.%0AHere's the product image:%0A${prd?.images[0]}`;
                          window.open(whatsappURL, "_blank");
                        } catch (err) {
                          console.error("Enquiry failed:", err);
                        }
                      }}
                    >
                      <WhatsappIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </Button>

                    <Button
                      variant="contained"
                      className="!capitalize !bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-3 py-[6px] text-sm sm:text-base w-[48%] flex items-center justify-center gap-2"
                      onClick={async () => {
                        if (!isLogin) return router.push("/login");
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
                      }}
                    >
                      <IoCall className="w-5 h-5" />
                      <span className="hidden sm:inline">Call</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="text-center col-span-full min-h-screen mt-10 text-gray-500">
                No products found for this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;