"use client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDataFromApi, postData } from "@/utils/api";
import { Button } from "@mui/material";
import Similar from "./Similar";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Image from "next/image";
import { useWishlist } from '@/app/context/WishlistContext';
import ProductSpecs from "@/components/ProductSpecs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { RxCross2 } from "react-icons/rx";
import { Navigation, Pagination, A11y } from 'swiper/modules';
import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";

import Skeleton from "@mui/material/Skeleton";


import "swiper/css/navigation";
import "swiper/css/pagination";

import { PiShareFat } from "react-icons/pi";






const ProductPageClient = ({ prdId, initialProduct }) => {
  const [productImages, setProductImages] = useState([]);
  const [openedProduct, setOpenedProduct] = useState(initialProduct || null);
  const [selectedImage, setSelectedImage] = useState();
  const [quantity, setQuantity] = useState(1);

  const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist()
  const { userData, setUserData, isLogin, isCheckingToken } = useAuth();
  const [showLarge, setShowLarge] = useState(null); // null means no modal, otherwise holds image src
  const [hideArrows, setHideArrows] = useState(null)

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Only fetch if initialProduct is not provided
    if (!initialProduct) {
      fetchDataFromApi(`/api/product/${prdId}`).then((res) => {
        setOpenedProduct(res?.product);
        setProductImages(res?.product?.images);
        setSelectedImage(res?.product?.images[0]);
      window.scrollTo(0, 0);

      });
    }
  }, [prdId, initialProduct]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowLarge(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };


  if (isCheckingToken || !openedProduct || !productImages) {
    return (
      <div className="flex flex-col w-full min-h-screen sm:py-4 items-center bg-slate-100">
        <div className="w-full sm:w-[1020px] min-h-screen p-4 sm:flex justify-between bg-white">
          {/* Left Skeleton: Image */}
          <div className="w-full flex gap-2 sm:w-[420px] p-1">
            <div className="hidden sm:flex flex-col gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={64} height={74} />
              ))}
            </div>
            <Skeleton variant="rectangular" width="100%" height={310} />
          </div>

          {/* Right Skeleton: Details */}
          <div className="sm:w-[600px] sm:p-5 sm:pl-6">
            <Skeleton variant="text" width="80%" height={40} className="sm:!mb-3" />
            <Skeleton variant="text" width="60%" height={25} className="!mb-4 sm:!mb-8" />
            <div className="flex gap-[8px]">
              <Skeleton variant="rectangular" width="50%" height={35} className="!mb-8" />
              <Skeleton variant="rectangular" width="50%" height={35} className="!mb-8" />
            </div>
            <Skeleton variant="rectangular" width="100%" height={200} className="!mb-8" />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Actual JSX rendering
  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-slate-100">
      {/* Structured Data Head Tag */}
      {openedProduct && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: openedProduct?.name,
                image: openedProduct?.images,
                description: openedProduct?.description,
                sku: openedProduct?._id,
                brand: {
                  "@type": "Brand",
                  name: openedProduct?.brand || "-",
                },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  price: openedProduct?.price || undefined,
                  availability:
                    openedProduct?.countInStock > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  url: `https://snsteelfabrication.com/product/${openedProduct?._id}`,
                }
              }),
            }}
          />
        </Head>
      )}

      <div className="w-full sm:w-[1020px] mb-2 sm:my-3 pt-2 sm:p-2 mx-auto sm:flex justify-between bg-white">
        {/* Left: Image Section */}
        <div className="image sm:sticky top-[50px] w-full sm:w-[400px] sm:h-[310px] sm:p-[2px] sm:border sm:border-slate-400 sm:m-3 mr-4 flex gap-[2px] flex-col sm:flex-row">
          {/* Mobile Carousel */}
          {/* Mobile Carousel */}
          <div className="block sm:hidden w-full relative">
            <Swiper cssMode={true} spaceBetween={10} slidesPerView={1} className="w-full h-auto">
              {productImages?.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <Image
                    src={getOptimizedCloudinaryUrl(src)}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-[300px] object-contain"
                    width={500}
                    height={300}
                    onClick={() => {
                      setShowLarge(src); // You still want to show original in modal
                      setHideArrows(true);
                    }}
                    loading="lazy"
                  />

                </SwiperSlide>
              ))}
            </Swiper>

            {/* Wishlist Button for mobile */}
            <div
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-3 right-3 cursor-pointer z-[90]"
              onClick={(e) => {
                if (!isLogin) {
                  router.push("/login");
                } else {
                  const isAlreadyInWishlist = userData?.wishlist?.some(item => item === String(openedProduct?._id));
                  if (isAlreadyInWishlist) {
                    const wishItem = wishlistData?.find(itemInWishData => itemInWishData.productId === openedProduct?._id);
                    const itemId = wishItem?._id;
                    if (itemId) removeFromWishlist(e, itemId, openedProduct?._id);
                  } else {
                    addToWishlist(e, openedProduct, userData?._id);
                  }
                }
              }}
            >
              {isLogin && userData?.wishlist?.some(item => item === String(openedProduct?._id)) ? (
                <MdFavorite className="!text-rose-600 text-[22px] z-10" />
              ) : (
                <MdFavoriteBorder className="text-slate-600 text-[22px]" />
              )}
            </div>

            {/* Share Button for mobile (below Wishlist) */}
            <div
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-12 right-3 cursor-pointer z-[90]"
              onClick={async () => {
                const shareData = {
                  title: openedProduct?.name,
                  text: `Check out this product: ${openedProduct?.name}\n`,
                  url: window.location.href,
                };

                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch (err) {
                    console.error("Error sharing:", err);
                  }
                } else {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Product URL copied to clipboard!");
                  } catch (err) {
                    alert("Share not supported and failed to copy URL.");
                  }
                }
              }}

              title="Share product"
            >
              <PiShareFat className="text-slate-600 text-[21px]" />
            </div>
          </div>



          {/* Fullscreen Modal for Mobile Large View */}
          {showLarge && (
            <div
              className="fixed inset-0 bg-slate-100 bg-opacity-80 z-[999] flex flex-col items-center justify-center px-4"
              style={{ touchAction: "pinch-zoom", overflow: "auto" }}
            >
              <div className="w-full flex justify-end">
                <button
                  onClick={() => {
                    setShowLarge(null)
                    setHideArrows(false)
                  }}
                  className="!text-black text-3xl p-2"
                >
                  <RxCross2 />
                </button>
              </div>

              <div className="w-full max-w-[500px] h-[80vh] flex justify-center items-center">
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={10}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  navigation
                  className="w-full h-full"
                  initialSlide={productImages.findIndex(img => img === showLarge) || 0}
                >
                  {productImages.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <Image
                        src={getOptimizedCloudinaryUrl(img)}
                        alt={`Slide ${idx + 1}`}
                        width={500}
                        height={500}
                        className="object-contain w-full h-full touch-auto"
                        loading="lazy"
                      />

                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}




          {/* Desktop Thumbnail + Main Image */}
          <div className="hidden sm:flex gap-2 h-auto">
            <div className="w-[75px] overflow-y-auto h-full p-[2px] border scrollbar-hide">
              <ul className="space-y-1">
                {productImages?.map((src, idx) => (
                  <li
                    key={idx}
                    className={`border rounded cursor-pointer ${selectedImage === src ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedImage(src)}
                  >
                    <Image
                    src={getOptimizedCloudinaryUrl(src)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-[128px] h-[64px] object-contain"
                      width={100}
                      height={100}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full relative">
              <div className="w-full sm:w-[319px] bg-gray-100 sm:h-full flex justify-center items-center relative">
                <Image
                  className="h-full w-full object-contain border cursor-zoom-in"
                    src={getOptimizedCloudinaryUrl(selectedImage || productImages?.[0] || "/")}

                  alt="Selected Product"
                  unoptimized
                  width={300}
                  height={300}
                  onClick={() => {
                    setShowLarge(selectedImage);
                    setHideArrows(true);
                  }}
                />

                {/* Wishlist Button */}
                <div
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-4 right-3 cursor-pointer z-[500]"
                  onClick={(e) => {
                    if (!isLogin) {
                      router.push("/login");
                    } else {
                      const isAlreadyInWishlist = userData?.wishlist?.some(item => item === String(openedProduct?._id));
                      if (isAlreadyInWishlist) {
                        const wishItem = wishlistData?.find(itemInWishData => itemInWishData.productId === openedProduct?._id);
                        const itemId = wishItem?._id;
                        if (itemId) removeFromWishlist(e, itemId, openedProduct?._id);
                      } else {
                        addToWishlist(e, openedProduct, userData?._id);
                      }
                    }
                  }}
                >
                  {isLogin && userData?.wishlist?.some(item => item === String(openedProduct?._id)) ? (
                    <MdFavorite className="!text-rose-600 text-[22px] z-10" />
                  ) : (
                    <MdFavoriteBorder className="text-slate-600 text-[22px]" />
                  )}
                </div>

                {/* Share Button (below Wishlist) */}
                <div
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-14 right-3 cursor-pointer z-[500]"
                  onClick={async () => {
                    const shareData = {
                      title: openedProduct?.name,
                      text: `Check out this product: ${openedProduct?.name}\n`,
                      url: window.location.href,
                    };

                    if (navigator.share) {
                      try {
                        await navigator.share(shareData);
                      } catch (err) {
                        console.error("Error sharing:", err);
                      }
                    } else {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert("Product URL copied to clipboard!");
                      } catch (err) {
                        alert("Share not supported and failed to copy URL.");
                      }
                    }
                  }}

                  title="Share product"
                >
                  <PiShareFat className="text-slate-600 text-[21px]" />
                </div>
              </div>

              {/* Buttons */}
            </div>
          </div>



          {/* Fullscreen Modal for Large Image View */}
          {showLarge && (
            <div className="fixed inset-0 bg-slate-100 bg-opacity-80 z-[999] flex flex-col items-center justify-center px-4">
              <div className="w-full flex justify-end">
                <button
                  onClick={() => {
                    setShowLarge(null)
                    setHideArrows(false)
                  }}
                  className="text-black text-3xl p-2"
                >
                  <RxCross2 />
                </button>
              </div>

              <div className="w-full max-w-[800px] h-[80vh] flex justify-center items-center">
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={10}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  navigation
                  className="w-full h-full"
                  initialSlide={productImages.findIndex(img => img === showLarge) || 0}
                >
                  {productImages.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <Image
                        src={getOptimizedCloudinaryUrl(img)}
                        alt={`Slide ${idx + 1}`}
                        width={800}
                        height={800}
                        className="object-contain w-full h-full"
                        unoptimized
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}


        </div>

        {/* Right: Product Details */}
        <div className="details sm:w-[600px] px-3 sm:p-4 sm:pt-6">
          <h2 className="text-[18px] sm:text-[20px] font-medium mt-2 am:mt-0 mb-1 sm:mb-3 text-gray-800">
            {openedProduct?.name}
          </h2>

          <h2 className="text-[14px] sm:text-[16px] font-medium mb-2 sm:mb-3 text-gray-500">
            {openedProduct?.brand}
          </h2>






          {!hideArrows && (
            <>
              <div className=" flex justify-around my-2 mt-10 gap-2">



                <Button
                  variant="outlined"
                  className="!capitalize !text-[#1e40af] !border-[#1e40af] bg-gray-600 rounded-md px-1 py-1 text-base w-auto sm:!w-1/2 !text-nowrap flex items-center gap-2"
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
                          productId: openedProduct?._id,
                          message: `Customer opened WhatsApp for "${openedProduct?.name}"`,
                          userMsg: `Enquiry for ${openedProduct?.name} via WhatsApp`,
                          image: openedProduct?.images?.[0],
                        });

                        const whatsappURL = `https://wa.me/919776501230?text=Hi, I'm interested in *${openedProduct?.name}*.\nHere is the product link:\nhttps://snsteelfabrication.com/product/${openedProduct?._id}`;
                        window.open(whatsappURL, "_blank");
                      } catch (err) {
                        console.error("Enquiry failed:", err);
                      }
                    }
                  }}
                >
                  <WhatsappIcon className="!w-5 !h-5" />
                  <span className="hidden sm:block">Get Price on WhatsApp</span>
                </Button>

                <Button
                  variant="contained"
                  className="!capitalize !bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-2 py-1 text-base w-full
   sm:w-1/2 text-nowrap flex items-center gap-2"
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
                          productId: openedProduct?._id,
                          message: `Direct call initiated for "${openedProduct?.name}"`,
                          userMsg: `Enquiry for ${openedProduct?.name} via Call`,
                          image: openedProduct?.images[0]
                        });

                        window.open("tel:+919776501230");
                      } catch (err) {
                        console.error("Call log failed:", err);
                      }
                    }
                  }}
                >
                  <IoCall className="w-6 h-6 mx-2" />
                  <span  >Call to Get Best Price</span>

                </Button>

              </div>
            </>
          )}








          {/* Description */}
          {openedProduct?.description &&
            <div className="flex gap-4 mt-4">
              <h1 className="text-gray-500 font-semibold">Description</h1>
              <p className="text-black">
                {openedProduct?.description}
              </p>
            </div>
          }

          {/* Product Specs */}
          <ProductSpecs specs={openedProduct?.specifications} />

        </div>

      </div>


      {/* similar products */}
      <div className=" w-full mx-10">
        <Similar prdId={prdId} hideArrows={hideArrows} />
      </div>
    </div>
  );
};

export default ProductPageClient;