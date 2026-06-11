"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useWishlist } from "@/app/context/WishlistContext";
import WhatsappIcon from "@/components/WhatsappIcon";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const ListingLoading = () => (
  <div className="min-h-screen bg-slate-100 px-3 pb-12 pt-4 sm:px-6 sm:pt-6">
    <div className="mx-auto w-full max-w-[1320px]">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-4 w-28 rounded-full bg-slate-200 animate-pulse" />
        <div className="mt-4 h-9 w-72 rounded bg-slate-200 animate-pulse" />
        <div className="mt-3 h-4 w-full max-w-[520px] rounded bg-slate-200 animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="aspect-[4/3] w-full rounded-xl bg-slate-200 animate-pulse" />
            <div className="mt-4 h-5 w-[80%] rounded bg-slate-200 animate-pulse" />
            <div className="mt-2 h-4 w-[45%] rounded bg-slate-200 animate-pulse" />
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
            </div>
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

  const { userData, isLogin, isCheckingToken } = useAuth();
  const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);

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

  const onClickHandler = (e, prdid, prd) => {
    if (!isLogin) return router.push("/login");

    const isInWishlist = userData?.wishlist?.includes(String(prdid));
    const wishItem = wishlistData?.find((item) => item.productId === prdid);
    const itemId = wishItem?._id;

    if (isInWishlist && itemId) {
      removeFromWishlist(e, itemId, prdid);
    } else {
      addToWishlist(e, prd, userData._id);
    }
  };

  const handleWhatsApp = async (prd) => {
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
        image: prd?.images?.[0],
      });

      const whatsappURL = `https://wa.me/919776501230?text=Hi, I'm interested in *${prd?.name}*.\nHere is the product link:\nhttps://snsteelfabrication.com/product/${prd?._id}`;
      window.open(whatsappURL, "_blank");
    } catch {
      return;
    }
  };

  const handleCall = async (prd) => {
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
        image: prd?.images?.[0],
      });

      window.open("tel:+919776501230");
    } catch {
      return;
    }
  };

  if (isCheckingToken || loadingProducts) return <ListingLoading />;

  return (
    <main className="min-h-screen bg-slate-100 px-3 pb-12 pt-4 text-slate-950 sm:px-6 sm:pt-6">
      <div className="mx-auto w-full max-w-[1320px]">
        <section className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Catalogue
              </p>
              <h1 className="mt-2 text-[28px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Explore Products
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-6 text-slate-600">
                Browse durable steel furniture, compare styles quickly, and
                contact SNSF directly for current pricing.
              </p>
            </div>
          </div>
        </section>

        {products.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {products
              .slice()
              .reverse()
              .map((prd, index) => {
                const isWishlisted =
                  isLogin && userData?.wishlist?.includes(String(prd?._id));

                return (
                  <article
                    key={prd?._id || index}
                    className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
                  >
                    <div className="relative p-3">
                      <button
                        type="button"
                        aria-label={`View ${prd?.name || "product"}`}
                        className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100"
                        onClick={() => router.push(`/product/${prd?._id}`)}
                      >
                        <Image
                          src={getCloudinaryImageUrl(
                            prd?.images?.[0] || "/images/placeholder.jpg",
                            { width: 560, height: 420 },
                          )}
                          alt={prd?.name || "Product"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </button>

                      <button
                        type="button"
                        aria-label={
                          isWishlisted
                            ? `Remove ${prd?.name || "product"} from wishlist`
                            : `Add ${prd?.name || "product"} to wishlist`
                        }
                        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:scale-105"
                        onClick={(e) => onClickHandler(e, prd?._id, prd)}
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
                        {prd?.brand || "SNSF"}
                      </p>
                      <h2 className="mt-2 line-clamp-2 min-h-[52px] text-[18px] font-semibold leading-snug text-slate-950">
                        {prd?.name}
                      </h2>

                      <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
                        <button
                          type="button"
                          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                          onClick={() => handleWhatsApp(prd)}
                        >
                          <WhatsappIcon className="h-5 w-5" />
                          <span>Enquire</span>
                        </button>

                        <button
                          type="button"
                          aria-label={`Call about ${prd?.name || "product"}`}
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                          onClick={() => handleCall(prd)}
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
                No products found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try another category or come back later for new additions.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default function ProductListing() {
  return (
    <Suspense fallback={<ListingLoading />}>
      <ProductListingContent />
    </Suspense>
  );
}
