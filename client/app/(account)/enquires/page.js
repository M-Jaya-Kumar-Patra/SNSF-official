"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { getUserEnquiries } from "@/utils/api"; // ✅ import the API function
import { MdOutlineMessage } from "react-icons/md";
import { trackVisitor } from "@/lib/tracking";
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Heart,
  RefreshCcw,
  Bell,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { useScreen } from "@/app/context/ScreenWidthContext";
import AccountPageShell from "@/components/AccountPageShell";

const Account = () => {
  const router = useRouter();
  const { userData, isLogin, isCheckingToken } = useAuth();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isSm, isMd, isLg, isXl } = useScreen();

  useEffect(() => {
    if (!userData?._id) return;
    setLoading(true);
    getUserEnquiries(userData._id)
      .then((res) => {
        if (res.success) {
          setEnquiries(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [userData?._id]);

  useEffect(() => {
    trackVisitor("enquires");
  }, []);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url; // Don't touch local images
    return url.replace("/upload/", "/upload/w_800,h_800,c_fill,f_auto,q_90/");
  };

  if (isCheckingToken)
    return <div className="text-center mt-10">Checking session...</div>;

  return (
    <AccountPageShell
      activePath="/enquires"
      title="My Enquiries"
      description="Track the products you contacted SNSF about through WhatsApp or call."
    >
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="w-full">
              {loading ? (
                <p className="rounded-2xl bg-slate-50 py-12 text-center text-slate-500">
                  Loading enquiries...
                </p>
              ) : enquiries.length === 0 ? (
                <>
                  <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                    <h2 className="text-lg font-bold text-slate-950 sm:text-2xl">
                      No Enquiries Yet
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-slate-500 sm:text-base">
                      You haven't received any customer enquiries yet. Once
                      someone contacts you, you'll see it here.
                    </p>

                    <Link
                      href="/"
                      className="mt-6 rounded-xl bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 sm:px-6 sm:text-base"
                    >
                      Back to Home
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  {enquiries
                    .slice()
                    .reverse()
                    .map((enq) => (
                      <div
                        key={enq._id}
                        onClick={() => router.push(`/product/${enq.prdId}`)}
                        className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                      >
                        {/* User message */}
                        <p className="text-md font-bold text-slate-950">
                          {enq?.userMsg?.includes("WhatsApp") && "📱"}{" "}
                          {enq?.userMsg?.includes("Call") && "📞"} {enq.userMsg}
                        </p>

                        {/* Date */}
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                          {new Date(enq.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
      </section>
    </AccountPageShell>
  );
};

export default Account;
