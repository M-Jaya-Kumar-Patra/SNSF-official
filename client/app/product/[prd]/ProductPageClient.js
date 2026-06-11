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
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const Suggestions = dynamic(() => import("@/components/Suggestions"), {
  ssr: false,
});

const Recommendations = dynamic(() => import("@/components/Recommendations"), {
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
      <div className="flex min-h-screen w-full flex-col items-center bg-slate-100 px-3 py-4 sm:px-6">
        <div className="w-full max-w-[1280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70 sm:grid sm:grid-cols-[54%_46%] sm:p-5">
          <div className="flex w-full gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="hidden flex-col gap-2 sm:flex">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[86px] w-[78px] rounded-xl bg-slate-200/80 animate-pulse"
                />
              ))}
            </div>
            <div className="h-[360px] w-full rounded-2xl bg-slate-200/80 animate-pulse sm:h-[520px]" />
          </div>

          <div className="p-2 sm:p-6">
            <div className="mb-3 h-6 w-32 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="mb-3 h-10 w-4/5 rounded bg-slate-200/80 animate-pulse" />
            <div className="mb-4 h-6 w-3/5 rounded bg-slate-200/80 animate-pulse sm:mb-8" />
            <div className="flex gap-[8px]">
              <div className="mb-8 h-[46px] w-1/2 rounded-xl bg-slate-200/80 animate-pulse" />
              <div className="mb-8 h-[46px] w-1/2 rounded-xl bg-slate-200/80 animate-pulse" />
            </div>
            <div className="mb-8 h-[220px] w-full rounded-2xl bg-slate-200/80 animate-pulse" />
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
    <div className="flex min-h-screen w-full flex-col items-center bg-slate-100 px-0 pb-10 sm:px-6 sm:py-4">
      <div className="mx-auto w-full max-w-[1280px] overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/70 sm:rounded-2xl lg:grid lg:grid-cols-[54%_46%]">
        {/* Left: Image Section */}
        <div className="image flex w-full flex-col gap-3 border-b border-slate-200 bg-slate-50 p-3 sm:sticky sm:top-[110px] sm:p-5 lg:h-[calc(100vh-140px)] lg:min-h-[620px] lg:border-b-0 lg:border-r">
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
                  className="min-w-full snap-center rounded-2xl bg-white"
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
                    className="h-[330px] w-full rounded-2xl object-contain p-3"
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
              className="absolute right-4 top-4 z-[90] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:scale-105"
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
                <MdFavorite className="!text-slate-950 text-[22px] z-10" />
              ) : (
                <MdFavoriteBorder className="text-slate-600 text-[22px]" />
              )}
            </button>

            {/* Share Button for mobile (below Wishlist) */}
            <button
              type="button"
              aria-label="Share product"
              className="absolute right-4 top-16 z-[90] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:scale-105"
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
          <div className="hidden h-full gap-3 md:flex">
            <div className="h-full w-[92px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 scrollbar-hide">
              <ul className="space-y-2">
                {productImages?.map((src, idx) => (
                  <li
                    key={idx}
                    className={`cursor-pointer overflow-hidden rounded-xl border bg-white transition ${
                      selectedImage === src
                        ? "border-slate-900 ring-2 ring-slate-900/10"
                        : "border-slate-200 hover:border-slate-400"
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
                      className="h-[78px] w-full object-contain p-1"
                      width={100}
                      height={100}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative min-w-0 flex-1">
              <div className="relative flex h-full min-h-[560px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  className="h-full w-full cursor-zoom-in object-contain p-5 transition duration-300 hover:scale-[1.02]"
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
                  width={720}
                  height={720}
                  priority
                 onClick={() => openLargeView(selectedImage)}
                />

                {/* Wishlist Button */}
                <button
                  type="button"
                  aria-label="Toggle wishlist"
                  className="absolute right-4 top-4 z-[500] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:scale-105"
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
                    <MdFavorite className="!text-slate-950 text-[22px] z-10" />
                  ) : (
                    <MdFavoriteBorder className="text-slate-600 text-[22px]" />
                  )}
                </button>

                {/* Share Button (below Wishlist) */}
                <button
                  type="button"
                  aria-label="Share product"
                  className="absolute right-4 top-16 z-[500] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:scale-105"
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
        <div className="details px-4 py-5 text-slate-950 sm:p-7 lg:py-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              Verified SNSF
            </span>
            {openedProduct?.catName && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                {openedProduct.catName}
              </span>
            )}
          </div>

          <h1 className="max-w-[620px] text-[28px] font-semibold leading-tight text-slate-950 sm:text-[38px]">
            {openedProduct?.name}
          </h1>

          <p className="mt-3 text-[15px] font-medium text-slate-500 sm:text-[16px]">
            {openedProduct?.brand
              ? `${openedProduct.brand} collection`
              : "Premium steel furniture collection"}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Ruler,
                title: "Custom fit",
                text: "Size support",
              },
              {
                icon: ShieldCheck,
                title: "Built strong",
                text: "Steel quality",
              },
              {
                icon: Headphones,
                title: "Direct help",
                text: "Quick enquiry",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <Icon className="mb-2 h-5 w-5 text-slate-700" />
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          {!hideArrows && (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
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
                <WhatsappIcon className="!h-5 !w-5" />
                <span>Get Price on WhatsApp</span>
              </button>

              <button
                type="button"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
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
                <IoCall className="h-5 w-5" />
                <span>Call to Get Best Price</span>
              </button>
            </div>
          )}

          {openedProduct?.description && (
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-[17px] font-semibold text-slate-900">
                Product Description
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-slate-600">
                {openedProduct?.description}
              </p>
            </section>
          )}

          <ProductSpecs specs={openedProduct?.specifications} />
        </div>
      </div>

      {/* similar products */}
      {!showLarge && showSuggestions && (
        <div className="mt-6 flex w-full max-w-[1280px] flex-col gap-5 px-3 sm:px-0">
          <Recommendations
            title="Suggested for You"
            subtitle="Picked from your browsing signals and nearby product styles."
            eyebrow="Personal picks"
            limit={10}
            fallbackProductId={openedProduct?._id}
            excludeProductId={openedProduct?._id}
            catId={openedProduct?.catId}
            subCatId={openedProduct?.subCatId}
            thirdSubCatId={openedProduct?.thirdSubCatId}
            brand={openedProduct?.brand}
          />

          <Suggestions
            productId={openedProduct?._id}
            catId={openedProduct?.catId}
            subCatId={openedProduct?.subCatId}
            thirdSubCatId={openedProduct?.thirdSubCatId}
            brand={openedProduct?.brand}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPageClient;
