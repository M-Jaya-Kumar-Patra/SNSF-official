"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Image from "next/image";
import { useWishlist } from "@/app/context/WishlistContext";
import ProductSpecs from "@/components/ProductSpecs";
import { RxCross2 } from "react-icons/rx";
import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";
import { PiShareFat } from "react-icons/pi";
import { trackProductEvent } from "@/lib/tracking";
import { usePrd } from "@/app/context/ProductContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const Suggestions = dynamic(() => import("@/components/Suggestions"), {
  ssr: false,
});

const ProductPageClient = ({ initialProduct = null, prdId }) => {
  const [productImages, setProductImages] = useState(initialProduct?.images || []);
  const [openedProduct, setOpenedProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState(
    initialProduct?.images?.[0] || null
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist();
  const { userData, isLogin, isCheckingToken } = useAuth();
  const { showLarge, setShowLarge } = usePrd();

  const [hideArrows, setHideArrows] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (initialProduct?._id) {
      setOpenedProduct(initialProduct);
      setProductImages(initialProduct.images || []);
      setSelectedImage(initialProduct.images?.[0] || null);

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      return;
    }

    fetchDataFromApi(`/api/product/${prdId}`, false).then((res) => {
      setOpenedProduct(res?.product);
      setProductImages(res?.product?.images || []);
      setSelectedImage(res?.product?.images?.[0] || null);

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  }, [initialProduct, prdId]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSuggestions(true), 2500);
    return () => clearTimeout(timer);
  }, [prdId]);

  useEffect(() => {
    if (!openedProduct?._id) return;

    let start = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - start) / 1000); // in seconds
      trackProductEvent(
        openedProduct._id,
        "view",
        duration,
        userData?._id || null,
      );
    };
  }, [openedProduct, userData?._id]);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && showLarge) {
      window.history.back();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [showLarge]);


  useEffect(() => {
    if (!openedProduct?._id) return;
    if (typeof window === "undefined") return;

    try {
      const viewedKey = "recentlyViewed";
      let viewed = JSON.parse(localStorage.getItem(viewedKey)) || [];

      viewed = viewed.filter((id) => id !== openedProduct._id);
      viewed.unshift(openedProduct._id);
      viewed = viewed.slice(0, 20);

      localStorage.setItem(viewedKey, JSON.stringify(viewed));
    } catch {
      return;
    }
  }, [openedProduct]);
  useEffect(() => {
    const handlePopState = () => {
      setShowLarge(null);
      setHideArrows(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openLargeView = (src) => {
    setShowLarge(src);
    setHideArrows(true);

      if (!window.history.state?.largeView) {
        window.history.pushState({ largeView: true }, "");
      }
  };

  const getOptimizedCloudinaryUrl = (url, options = {}) =>
    getCloudinaryImageUrl(url, {
      width: 800,
      height: 800,
      crop: "fit",
      ...options,
    });

  if (isCheckingToken || !openedProduct) {
    return (
      <div className="flex flex-col w-full min-h-screen sm:py-4 items-center bg-slate-100">
        <div className="w-full sm:w-[1020px] min-h-screen p-4 sm:flex justify-between bg-white">
          <div className="w-full flex gap-2 sm:w-[420px] p-1">
            <div className="hidden sm:flex flex-col gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[74px] w-16 bg-slate-200/80 animate-pulse"
                />
              ))}
            </div>
            <div className="h-[310px] w-full bg-slate-200/80 animate-pulse" />
          </div>

          <div className="sm:w-[600px] sm:p-5 sm:pl-6">
            <div className="mb-3 h-10 w-4/5 rounded bg-slate-200/80 animate-pulse" />
            <div className="mb-4 h-6 w-3/5 rounded bg-slate-200/80 animate-pulse sm:mb-8" />
            <div className="flex gap-[8px]">
              <div className="mb-8 h-[35px] w-1/2 rounded bg-slate-200/80 animate-pulse" />
              <div className="mb-8 h-[35px] w-1/2 rounded bg-slate-200/80 animate-pulse" />
            </div>
            <div className="mb-8 h-[200px] w-full rounded bg-slate-200/80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const initialIndex = Math.max(
    0,
    productImages.findIndex((img) => img === showLarge),
  );

  const showImageByOffset = (offset) => {
    if (!productImages.length) return;

    const nextIndex =
      (initialIndex + offset + productImages.length) % productImages.length;
    setShowLarge(productImages[nextIndex]);
  };

  // Actual JSX rendering
  return (
    <div className="flex w-full min-h-screen flex-col items-center bg-slate-100">
      <div className="mx-auto mb-2 w-full justify-between bg-white pt-2 sm:my-3 sm:w-[1020px] sm:p-2 lg:flex">
        {/* Left: Image Section */}
        <div className="image mr-4 flex w-full flex-col gap-[2px] sm:sticky sm:m-3 sm:h-[310px] sm:w-[400px] sm:flex-row sm:border sm:border-slate-400 sm:p-[2px] lg:top-[110px]">
          {/* Mobile Carousel */}
          <div className="block md:hidden w-full relative">
            <div
              className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide"
              aria-label="Product images"
            >
              {productImages?.map((src, idx) => (
                <button
                  key={src || idx}
                  type="button"
                  aria-label={`Open product image ${idx + 1}`}
                  className="min-w-full snap-center bg-white"
                  onClick={() => {
                    openLargeView(src);
                    setHideArrows(true);
                  }}
                >
                  <Image
                    src={
                      getOptimizedCloudinaryUrl(src, {
                        width: 700,
                        height: 420,
                      }) ||
                      "/images/placeholder.jpg"
                    }
                    alt={`${openedProduct?.name || "Product"} image ${idx + 1}`}
                    className="w-full h-[300px] object-contain"
                    width={500}
                    height={300}
                    priority={idx === 0}
                  />
                </button>
              ))}
            </div>

            {/* Wishlist Button for mobile */}
            <button
              type="button"
              aria-label="Toggle wishlist"
              className="absolute right-3 top-3 z-[90] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 border-opacity-50 bg-white shadow-md hover:shadow-inner"
              onClick={(e) => {
                if (!isLogin) {
                  router.push("/login");
                } else {
                  const isAlreadyInWishlist = userData?.wishlist?.some(
                    (item) => item === String(openedProduct?._id),
                  );
                  if (isAlreadyInWishlist) {
                    const wishItem = wishlistData?.find(
                      (itemInWishData) =>
                        itemInWishData.productId === openedProduct?._id,
                    );
                    const itemId = wishItem?._id;
                    if (itemId)
                      removeFromWishlist(e, itemId, openedProduct?._id);
                  } else {
                    addToWishlist(e, openedProduct, userData?._id);
                  }
                }
              }}
            >
              {isLogin &&
              userData?.wishlist?.some(
                (item) => item === String(openedProduct?._id),
              ) ? (
                <MdFavorite className="!text-rose-600 text-[22px] z-10" />
              ) : (
                <MdFavoriteBorder className="text-slate-600 text-[22px]" />
              )}
            </button>

            {/* Share Button for mobile (below Wishlist) */}
            <button
              type="button"
              aria-label="Share product"
              className="absolute right-3 top-12 z-[90] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 border-opacity-50 bg-white shadow-md hover:shadow-inner"
              onClick={async () => {
                const shareData = {
                  title: openedProduct?.name,
                  text: `Check out this product: ${openedProduct?.name}\n`,
                  url: window.location.href,
                };

                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch {
                    return;
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
            </button>
          </div>

          {/* Fullscreen Modal for Mobile Large View */}
          {showLarge && (
            <div
              className="flex lg:hidden fixed inset-0 bg-slate-100  z-[999]  flex-col items-center justify-center px-4"
              style={{ touchAction: "pinch-zoom", overflow: "auto" }}
            >
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  aria-label="Close image view"
                  onClick={() => {
                    setShowLarge(null);
                    setHideArrows(false);

                    if (typeof window !== "undefined") {
                      window.history.back();
                    }
                  }}
                  className="!text-black text-3xl p-2"
                >
                  <RxCross2 />
                </button>
              </div>

              <div className="relative w-full max-w-[500px] h-[80vh] flex justify-center items-center">
                {productImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="absolute left-0 z-10 rounded-full bg-white/80 p-2 text-slate-800 shadow"
                    onClick={() => showImageByOffset(-1)}
                  >
                    <ChevronLeft />
                  </button>
                )}

                <Image
                  src={
                    getOptimizedCloudinaryUrl(showLarge, {
                      width: 900,
                      height: 900,
                    }) || "/images/placeholder.jpg"
                  }
                  alt={`${openedProduct?.name || "Product"} image ${initialIndex + 1}`}
                  width={900}
                  height={900}
                  className="h-full w-full object-contain"
                />

                {productImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Next image"
                    className="absolute right-0 z-10 rounded-full bg-white/80 p-2 text-slate-800 shadow"
                    onClick={() => showImageByOffset(1)}
                  >
                    <ChevronRight />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Desktop Thumbnail + Main Image */}
          <div className="hidden h-auto gap-2 md:flex">
            <div className="h-full w-[75px] overflow-y-auto border p-[2px] scrollbar-hide">
              <ul className="space-y-2">
                {productImages?.map((src, idx) => (
                  <li
                    key={idx}
                    className={`cursor-pointer rounded border bg-white ${
                      selectedImage === src ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedImage(src)}
                  >
                    <Image
                      src={
                        getOptimizedCloudinaryUrl(src, {
                          width: 160,
                          height: 120,
                        }) ||
                        "/images/placeholder.jpg"
                      }
                      alt={`${openedProduct?.name || "Product"} thumbnail ${idx + 1}`}
                      className="h-[64px] w-[128px] object-contain"
                      width={100}
                      height={100}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative w-full">
              <div className="relative flex w-full items-center justify-center bg-gray-100 sm:h-full sm:w-[319px]">
                <Image
                  className="h-full w-full cursor-zoom-in border object-contain"
                  src={getOptimizedCloudinaryUrl(
                    selectedImage ||
                      productImages?.[0] ||
                      "/images/placeholder.jpg",
                    {
                      width: 640,
                      height: 640,
                    },
                  )}
                  alt="Selected Product"
                  width={300}
                  height={300}
                  priority
                 onClick={() => openLargeView(selectedImage)}
                />

                {/* Wishlist Button */}
                <button
                  type="button"
                  aria-label="Toggle wishlist"
                  className="absolute right-3 top-4 z-[500] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 border-opacity-50 bg-white shadow-md hover:shadow-inner"
                  onClick={(e) => {
                    if (!isLogin) {
                      router.push("/login");
                    } else {
                      const isAlreadyInWishlist = userData?.wishlist?.some(
                        (item) => item === String(openedProduct?._id),
                      );
                      if (isAlreadyInWishlist) {
                        const wishItem = wishlistData?.find(
                          (itemInWishData) =>
                            itemInWishData.productId === openedProduct?._id,
                        );
                        const itemId = wishItem?._id;
                        if (itemId)
                          removeFromWishlist(e, itemId, openedProduct?._id);
                      } else {
                        addToWishlist(e, openedProduct, userData?._id);
                      }
                    }
                  }}
                >
                  {isLogin &&
                  userData?.wishlist?.some(
                    (item) => item === String(openedProduct?._id),
                  ) ? (
                    <MdFavorite className="!text-rose-600 text-[22px] z-10" />
                  ) : (
                    <MdFavoriteBorder className="text-slate-600 text-[22px]" />
                  )}
                </button>

                {/* Share Button (below Wishlist) */}
                <button
                  type="button"
                  aria-label="Share product"
                  className="absolute right-3 top-14 z-[500] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 border-opacity-50 bg-white shadow-md hover:shadow-inner"
                  onClick={async () => {
                    const shareData = {
                      title: openedProduct?.name,
                      text: `Check out this product: ${openedProduct?.name}\n`,
                      url: window.location.href,
                    };

                    if (navigator.share) {
                      try {
                        await navigator.share(shareData);
                      } catch {
                        return;
                      }
                    } else {
                      try {
                        await navigator.clipboard.writeText(
                          window.location.href,
                        );
                        alert("Product URL copied to clipboard!");
                      } catch (err) {
                        alert("Share not supported and failed to copy URL.");
                      }
                    }
                  }}
                  title="Share product"
                >
                  <PiShareFat className="text-slate-600 text-[21px]" />
                </button>
              </div>

              {/* Buttons */}
            </div>
          </div>

          {/* Fullscreen Modal for Large Image View */}
          {showLarge && (
            <div className="hidden sm:flex fixed  inset-0 bg-slate-100  z-[999]  flex-col items-center justify-center px-4">
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  aria-label="Close image view"
                  onClick={() => {
                    setShowLarge(null);

                    setHideArrows(false);

                    if (typeof window !== "undefined") {
                      window.history.back();
                    }
                  }}
                  className="text-black text-3xl p-2"
                >
                  <RxCross2 />
                </button>
              </div>

              <div className="relative w-full max-w-[800px] h-[80vh] flex justify-center items-center">
                {productImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="absolute left-0 z-10 rounded-full bg-white/80 p-3 text-slate-800 shadow"
                    onClick={() => showImageByOffset(-1)}
                  >
                    <ChevronLeft />
                  </button>
                )}

                <Image
                  src={
                    getOptimizedCloudinaryUrl(showLarge, {
                      width: 1000,
                      height: 1000,
                    }) || "/images/placeholder.jpg"
                  }
                  alt={`${openedProduct?.name || "Product"} image ${initialIndex + 1}`}
                  width={1000}
                  height={1000}
                  className="h-full w-full object-contain"
                />

                {productImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Next image"
                    className="absolute right-0 z-10 rounded-full bg-white/80 p-3 text-slate-800 shadow"
                    onClick={() => showImageByOffset(1)}
                  >
                    <ChevronRight />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="details px-3 sm:w-[600px] sm:p-4 sm:pt-6">
          <h1 className="am:mt-0 mb-1 mt-2 text-[18px] font-medium text-gray-800 sm:mb-3 sm:text-[20px]">
            {openedProduct?.name}
          </h1>

          <p className="mb-2 text-[14px] font-medium text-gray-500 sm:mb-3 sm:text-[16px]">
            {openedProduct?.brand}
          </p>

          {!hideArrows && (
            <>
              <div className="my-2 mt-10 flex justify-around gap-2">
                <button
                  type="button"
                  className="flex w-auto items-center justify-center gap-2 rounded-md border border-slate-900 px-1 py-1 text-base font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white sm:w-1/2"
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
                      } catch {
                        return;
                      }
                    }
                  }}
                >
                  <WhatsappIcon className="!w-5 !h-5" />
                  <span className="hidden sm:block">Get Price on WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-2 py-1 text-base font-medium text-white transition hover:bg-rose-700 sm:w-1/2"
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
                          image: openedProduct?.images[0],
                        });

                        window.open("tel:+919776501230");
                      } catch {
                        return;
                      }
                    }
                  }}
                >
                  <IoCall className="w-6 h-6 mx-2" />
                  <span>Call to Get Best Price</span>
                </button>
              </div>
            </>
          )}

          {/* Description */}
          {openedProduct?.description && (
            <div className="mt-4 flex gap-4">
              <h2 className="font-semibold text-gray-500">Description</h2>
              <p className="text-black">{openedProduct?.description}</p>
            </div>
          )}

          {/* Product Specs */}
          <ProductSpecs specs={openedProduct?.specifications} />
        </div>
      </div>

      {/* similar products */}
      {!showLarge && showSuggestions && (
        <div className="w-full mx-10">
          <Suggestions
            productId={openedProduct?._id}
            catId={openedProduct.catId}
            subCatId={openedProduct.subCatId}
            thirdSubCatId={openedProduct.thirdSubCatId}
            brand={openedProduct.brand}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPageClient;
