"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useWishlist } from "@/app/context/WishlistContext";
import Image from "next/image";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
const ListingLoading = () => (
  <div className="min-h-screen bg-slate-100 px-4 py-[110px] sm:px-6">
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 h-8 w-64 rounded bg-slate-200 animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-md bg-white p-3 shadow-md"
          >
            <div className="aspect-[4/3] w-full bg-slate-200 animate-pulse" />
            <div className="mt-4 h-5 w-[80%] rounded bg-slate-200 animate-pulse" />
            <div className="mt-2 h-4 w-[45%] rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);



const ProductListingContent = () => {
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
    window.scrollTo(0,0)
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
            

        setProducts(res?.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [catId, subCatId, thirdSubCatId]);


  const onClickHandler = (e, prdid, prd)=>{
    if (!isLogin) return router.push("/login");
                        const isInWishlist = userData?.wishlist?.includes(String(prdid));
                        const wishItem = wishlistData?.find((item) => item.productId === prdid);
                        const itemId = wishItem?._id;
                        if (isInWishlist && itemId) {
                          removeFromWishlist(e, itemId, prdid);
                        } else {
                          addToWishlist(e, prd, userData._id);
                        }
  }

  if (isCheckingToken || loadingProducts) return <ListingLoading />;

  return (
    <div className="flex min-h-screen w-full justify-center bg-slate-100 px-3 pb-10 pt-[104px] sm:px-6 sm:pt-[120px]">
      <div className="container mx-auto w-full sm:w-[90%]">
        <div className="min-h-screen bg-white p-2 text-black shadow-lg sm:p-3">
          <div className="relative z-0 mb-5 grid grid-cols-1 place-items-center gap-4 overflow-visible sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
           

            {(  isCheckingToken || loadingProducts)
  ? Array.from({ length: 8 }).map((_, idx) => (
      <div key={idx} className="flex min-h-[260px] w-full flex-col items-start justify-between bg-white p-3 shadow-md">
        <div className="h-[260px] w-full bg-slate-200 animate-pulse" />
        <div className="mt-4 h-5 w-[90%] rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-4 w-[60%] rounded bg-slate-200 animate-pulse" />
      </div>
    ))
  : products.length > 0 && products.slice().reverse().map((prd, index) => (
                <article key={prd?._id || index} className="group relative w-full">
                <div className="flex min-h-[260px] w-full flex-col items-center justify-between bg-white p-3 shadow-md transition duration-300 hover:shadow-xl">
                  <div className="w-full flex flex-col items-center">
                    {prd?.images?.[0] && (
                      <div
                        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-md"
                        onClick={() => router.push(`/product/${prd?._id}`)}
                      >
                        <Image
                          src={getCloudinaryImageUrl(prd.images[0] || "/images/placeholder.jpg", {
                            width: 520,
                            height: 390,
                          })}
                          alt={prd.name || "Product"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label="Toggle wishlist"
                      className="absolute right-3 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-md"
                      onClick={(e) =>
                        onClickHandler (e, prd._id, prd)
                      }
                    >
                      {isLogin && userData?.wishlist?.includes(String(prd._id)) ? (
                        <MdFavorite className="text-rose-600 text-[22px]" />
                      ) : (
                        <MdFavoriteBorder className="text-slate-600 text-[22px]" />
                      )}
                    </button>
                    <div className="w-full mt-3">
                      <h2 className="truncate text-[18px] font-medium text-black">{prd?.name}</h2>
                      <p className={(prd?.brand)?`text-gray-500 text-[16px] mt-1`:`text-white text-[16px] mt-1 cursor-default`}>{prd?.brand || "Not mentioned"}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute left-0 top-full z-50 w-full opacity-100 transition-opacity duration-300 sm:pointer-events-none sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100">
                  <div className="flex flex-wrap justify-center gap-2 bg-white p-2 shadow-lg sm:justify-between">
                    <button
                      type="button"
                      className="flex w-[48%] items-center justify-center gap-2 rounded-md border border-slate-900 px-3 py-[6px] text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white sm:text-base"
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

                          const whatsappURL = `https://wa.me/919776501230?text=Hi, I'm interested in *${prd?.name}*.\nHere is the product link:\nhttps://snsteelfabrication.com/product/${prd?._id}`;
                          
                          window.open(whatsappURL, "_blank");
                        } catch {
                          return;
                        }
                      }}
                    >
                      <WhatsappIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      className="flex w-[48%] items-center justify-center gap-2 rounded-md bg-rose-600 px-3 py-[6px] text-sm font-medium text-white transition hover:bg-rose-700 sm:text-base"
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
                        } catch {
                          return;
                        }
                      }}
                    >
                      <IoCall className="w-5 h-5" />
                      <span className="hidden sm:inline">Call</span>
                    </button>
                  </div>
                </div>
              </article>
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

export default function ProductListing() {
  return (
    <Suspense fallback={<ListingLoading />}>
      <ProductListingContent />
    </Suspense>
  );
}
