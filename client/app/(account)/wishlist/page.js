"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdOutlineMessage } from "react-icons/md";
import { User, Package, CreditCard, Bell, Heart } from "lucide-react";

import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { MdDelete } from "react-icons/md";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { trackVisitor } from "@/lib/tracking";
import { useScreen } from "@/app/context/ScreenWidthContext";
import AccountPageShell from "@/components/AccountPageShell";

const Account = () => {
  const router = useRouter();
  const { userData, isLogin, isCheckingToken, setIsCheckingToken } = useAuth();
  const { wishlistData, removeFromWishlist } = useWishlist();
  const { isSm, isMd, isLg, isXl } = useScreen();

  if (isCheckingToken)
    return <div className="text-center mt-10">Checking session...</div>;

  useEffect(() => {
    if (isCheckingToken || !isLogin) {
      router.push("/login");
      return;
    }
  }, [isLogin, router]);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url; // Don't touch local images
    return url.replace("/upload/", "/upload/w_800,h_800,c_fill,f_auto,q_90/");
  };

  return (
    <AccountPageShell
      activePath="/wishlist"
      title="Wishlist"
      description="Review saved products and continue enquiries whenever you are ready."
    >
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="list-section min-h-[520px] space-y-3">
            {wishlistData?.length > 0 ? (
              wishlistData.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-4"
                >
                  {/* Product Image */}
                  <div
                    className="relative h-[110px] w-[130px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-slate-100"
                    onClick={() => router.push(`/product/${item?.productId}`)}
                  >
                    <Image
                      src={getOptimizedCloudinaryUrl(item.image)}
                      alt={item.title || "Product"}
                      fill
                      sizes="130px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div
                      className="cursor-pointer"
                      onClick={() => router.push(`/product/${item?.productId}`)}
                    >
                      <h3 className="text-lg font-bold text-slate-950">
                        {item?.productTitle}
                      </h3>
                      <p
                        className={
                          item?.brand !== "Unknown Brand"
                            ? "text-slate-500 text-sm"
                            : "hidden"
                        }
                      >
                        {item?.brand}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex items-start">
                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={(e) =>
                        removeFromWishlist(e, item?._id, item?.productId)
                      }
                    >
                      <MdDelete className="text-2xl" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-[200px] sm:w-[260px] mb-4">
                  <DotLottieReact
                    src="https://lottie.host/3083b307-7cfd-4fcd-9d3d-76299b402a46/P13OnArBCk.lottie"
                    loop
                    autoplay
                  />
                </div>
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  Your Wishlist is Empty
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-500 sm:text-base">
                  Looks like you haven’t added anything to your wishlist yet.
                  Start exploring and add your favorite items!
                </p>
                <Link
                  href="/"
                  className="mt-6 rounded-xl bg-slate-950 px-6 py-2 text-sm font-bold text-white transition hover:bg-blue-700 sm:text-base"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>
      </section>
    </AccountPageShell>
  );
};

export default Account;
