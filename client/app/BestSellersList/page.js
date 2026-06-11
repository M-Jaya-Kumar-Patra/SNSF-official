"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import WhatsappIcon from "@/components/WhatsappIcon";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const BestSellerSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, idx) => (
      <div
        key={idx}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        <div className="aspect-[4/3] rounded-xl bg-slate-200 animate-pulse" />
        <div className="mt-4 h-5 w-[80%] rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-4 w-[48%] rounded bg-slate-200 animate-pulse" />
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const ProductListing = () => {
  const { userData, isLogin, loading, setLoading, isCheckingToken } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);

  const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist();

  const loadCustomerFavorites = async () => {
    try {
      const res = await fetchDataFromApi(
        "/api/home-sections?sectionName=bestsellers",
        false,
      );

      if (!res.error) setData(res?.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerFavorites();
  }, []);

  const toggleWishlist = (e, product) => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    const isAlreadyInWishlist = userData?.wishlist?.some(
      (item) => item === String(product?._id),
    );

    if (isAlreadyInWishlist) {
      const wishItem = wishlistData?.find(
        (itemInWishData) => itemInWishData.productId === product?._id,
      );
      const itemId = wishItem?._id;

      if (itemId) {
        removeFromWishlist(e, itemId, product?._id);
      }
    } else {
      addToWishlist(e, product, userData._id);
    }
  };

  const handleWhatsApp = async (product) => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    try {
      await postData("/api/enquiries/", {
        userId: userData?._id,
        contactInfo: {
          name: userData?.name,
          email: userData?.email,
          phone: userData?.phone,
        },
        productId: product?._id,
        message: `Customer opened WhatsApp for "${product?.name}"`,
        userMsg: `Enquiry for ${product?.name} via WhatsApp`,
        image: product?.images?.[0],
      });

      const whatsappURL = `https://wa.me/919776501230?text=Hi, I'm interested in *${product?.name}*.\nHere is the product link:\nhttps://snsteelfabrication.com/product/${product?._id}`;
      window.open(whatsappURL, "_blank");
    } catch {
      return;
    }
  };

  const handleCall = async (product) => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    try {
      await postData("/api/enquiries/", {
        userId: userData?._id,
        name: userData?.name,
        email: userData?.email,
        phone: userData?.phone,
        productId: product?._id,
        message: `Direct call initiated for "${product?.name}"`,
        userMsg: `Enquiry for ${product?.name} via Call`,
        image: product?.images?.[0],
      });

      window.open("tel:+919776501230");
    } catch {
      return;
    }
  };

  const bestSellers = data?.filter((item) => item?.enabled && item?.product);

  return (
    <main className="min-h-screen bg-slate-100 px-3 pb-12 pt-4 text-slate-950 sm:px-6 sm:pt-6">
      <div className="mx-auto w-full max-w-[1320px]">
        <section className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Customer favorites
              </p>
              <h1 className="mt-2 text-[28px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Best Sellers
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-6 text-slate-600">
                The pieces customers keep choosing for strength, finish, and
                everyday use.
              </p>
            </div>
          </div>
        </section>

        {isCheckingToken || loading || !data ? (
          <BestSellerSkeleton />
        ) : bestSellers.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {bestSellers.map((item, index) => {
              const product = item?.product;
              const isWishlisted =
                isLogin && userData?.wishlist?.some(
                  (wishlistItem) => wishlistItem === String(product?._id),
                );

              return (
                <article
                  key={product?._id || index}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
                >
                  <div className="relative p-3">
                    <button
                      type="button"
                      aria-label={`View ${product?.name || "product"}`}
                      className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100"
                      onClick={() => router.push(`/product/${product?._id}`)}
                    >
                      <Image
                        src={getCloudinaryImageUrl(
                          product?.images?.[0] || "/images/placeholder.jpg",
                          { width: 560, height: 420 },
                        )}
                        alt={product?.name || "Product"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>

                    {index < 3 && (
                      <span className="absolute left-5 top-5 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white shadow">
                        Top {index + 1}
                      </span>
                    )}

                    <button
                      type="button"
                      aria-label={
                        isWishlisted
                          ? `Remove ${product?.name || "product"} from wishlist`
                          : `Add ${product?.name || "product"} to wishlist`
                      }
                      className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:scale-105"
                      onClick={(e) => toggleWishlist(e, product)}
                    >
                      {isWishlisted ? (
                        <MdFavorite className="text-[23px] text-slate-950" />
                      ) : (
                        <MdFavoriteBorder className="text-[23px]" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {product?.brand || "SNSF"}
                    </p>
                    <h2 className="mt-2 line-clamp-2 min-h-[52px] text-[18px] font-semibold leading-snug text-slate-950">
                      {product?.name}
                    </h2>

                    <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
                      <button
                        type="button"
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        onClick={() => handleWhatsApp(product)}
                      >
                        <WhatsappIcon className="h-5 w-5" />
                        <span>Enquire</span>
                      </button>

                      <button
                        type="button"
                        aria-label={`Call about ${product?.name || "product"}`}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                        onClick={() => handleCall(product)}
                      >
                        <IoCall className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div>
              <p className="text-[22px] font-semibold text-slate-900">
                No best sellers available
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add products to the bestsellers section from admin to show them
                here.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductListing;
