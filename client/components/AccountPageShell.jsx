"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, MapPin, MessageSquareText, User } from "lucide-react";
import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const accountLinks = [
  { href: "/profile", label: "Profile Information", icon: User },
  { href: "/address", label: "Manage Address", icon: MapPin },
  { href: "/enquires", label: "My Enquiries", icon: MessageSquareText },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const getAvatarUrl = (url) =>
  url ? getCloudinaryImageUrl(url, { width: 320, height: 320 }) : "/images/account.png";

export default function AccountPageShell({
  activePath,
  title,
  eyebrow = "Client account",
  description,
  children,
}) {
  const { userData } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-slate-950 px-5 py-7 text-white sm:px-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                {description}
              </p>
            )}
          </div>

          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[310px_1fr]">
            <aside className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-slate-200 bg-white shadow">
                  <Image
                    src={getAvatarUrl(userData?.avatar)}
                    alt="User profile"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-950">
                  {userData?.name || "User"}
                </h2>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {userData?.email || "No email available"}
                </p>
              </div>

              <nav className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                {accountLinks.map(({ href, label, icon: Icon }) => {
                  const active = href === activePath;

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-semibold last:border-b-0 ${
                        active
                          ? "bg-slate-950 text-white"
                          : "text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  );
                })}

                <div className="border-t border-slate-100 px-1 py-1">
                  <LogoutBTN className="!pl-3" />
                </div>
              </nav>
            </aside>

            <section className="space-y-5">{children}</section>
          </div>
        </section>
      </div>
    </main>
  );
}
