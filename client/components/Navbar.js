"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineMessage } from "react-icons/md";
import {
  BedDouble,
  Bell,
  Boxes,
  Heart,
  Home,
  LampDesk,
  Laptop,
  MapPin,
  Menu,
  Package,
  PhoneCall,
  Sofa,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useCat } from "@/app/context/CategoryContext";
import { useNotice } from "@/app/context/NotificationContext";
import { usePrd } from "@/app/context/ProductContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import LogoutBTN from "./LogoutBTN";
import Search from "./Search";

const primaryLinks = ["Sofas", "Living Room", "Bedroom", "Dining"];

const categoryIcons = {
  sofas: Sofa,
  "living room": Home,
  bedroom: BedDouble,
  dining: UtensilsCrossed,
  "study & office": Laptop,
  "home decor": LampDesk,
  accessories: Boxes,
};

const getCategoryIcon = (name, className = "h-6 w-6 text-slate-800") => {
  const Icon = categoryIcons[name?.toLowerCase()] || Package;
  return <Icon className={className} strokeWidth={1.9} />;
};

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const dropdownRef = useRef(null);

  const { catData } = useCat();
  const { userData, isLogin, isCheckingToken } = useAuth();
  const { getNotifications } = useNotice();
  const { showLarge } = usePrd();
  const { deskSearch } = useScreen();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathName === "/";

  useEffect(() => {
    if (isLogin) getNotifications();
  }, [getNotifications, isLogin]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (showLarge) return null;

  const sortedCatData = [...(catData || [])].sort((a, b) => a.sln - b.sln);
  const showTopCategories = (!isHome || isScrolled) && !deskSearch;
  const showBottomCategories = isHome && !isScrolled;

  const goCategory = (name) => {
    const catId = catData?.find((category) => category.name === name)?._id;
    if (catId) router.push(`/ProductListing?catId=${catId}`);
  };

  const findCategoryByName = (name) =>
    catData?.find((category) => category.name === name);

  return (
    <nav className="fixed left-0 top-0 z-[1000] w-full bg-slate-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]">
      <div className="relative border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-[1600px] items-center justify-between gap-2 px-3 sm:h-[88px] sm:px-6">
          <button
            type="button"
            aria-label="Go to home page"
            onClick={() => router.push("/")}
            className="flex min-w-0 flex-shrink-0 items-center gap-1 rounded-full pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Image
              src="/images/logo.png"
              alt="S N Steel Fabrication logo"
              width={62}
              height={62}
              className="h-[50px] w-[50px] object-contain sm:h-[62px] sm:w-[62px]"
              priority
            />

            <Image
              src="/images/snsf-text.png"
              alt="S N Steel Fabrication"
              width={172}
              height={64}
              className="h-[48px] w-[132px] object-contain sm:h-[60px] sm:w-[172px]"
              priority
            />
          </button>

          <div
            className={`hidden min-w-0 flex-1 items-center justify-center transition duration-300 lg:flex ${
              showTopCategories
                ? "opacity-100 translate-y-0"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1">
              <button
                type="button"
                onClick={() => router.push("/")}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                  isHome
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </button>

              {primaryLinks.map((name, index) => {
                const category = findCategoryByName(name);

                return (
                  <div key={name} className="group/category relative">
                    <button
                      type="button"
                      onClick={() => goCategory(name)}
                      className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                    >
                      {name}
                    </button>

                    <CategoryFlyout
                      category={category}
                      align={index > primaryLinks.length - 3 ? "right" : "left"}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <div
              className={`hidden justify-end overflow-visible transition-[width] duration-300 md:flex ${
                deskSearch
                  ? "md:w-[260px] lg:w-[300px] xl:w-[320px] 2xl:w-[360px]"
                  : showBottomCategories
                  ? "md:w-[300px] lg:w-[360px] xl:w-[460px] 2xl:w-[540px]"
                  : "md:w-[48px] lg:w-[48px] xl:w-[48px] 2xl:w-[48px]"
              }`}
            >
              <Search navScrolled={isScrolled} />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Open notifications"
                onClick={() => router.push("/notifications")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-100 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Bell className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Call S N Steel Fabrication"
                onClick={() => (window.location.href = "tel:+919776501230")}
                className="hidden min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100 xl:inline-flex"
              >
                <PhoneCall className="h-4 w-4" />
                Call
              </button>

              <button
                type="button"
                aria-label="Call S N Steel Fabrication"
                onClick={() => (window.location.href = "tel:+919776501230")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-100 transition hover:bg-white/15 xl:hidden"
              >
                <PhoneCall className="h-5 w-5" />
              </button>

              <div
                className="group/account relative z-[2600] hidden sm:block"
                ref={dropdownRef}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  type="button"
                  aria-label="Open account menu"
                  aria-expanded={menuOpen}
                  onClick={() => router.push(isLogin ? "/profile" : "/login")}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] p-1.5 pr-3 text-slate-100 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {isCheckingToken ? (
                    <span className="block h-8 w-8 shrink-0 animate-pulse rounded-full bg-slate-300" />
                  ) : (
                    <Image
                      src={userData?.avatar || "/images/emptyAccount.png"}
                      alt="Account"
                      width={34}
                      height={34}
                      className="h-8 w-8 shrink-0 rounded-full border border-white/40 object-cover"
                    />
                  )}
                  <Menu className="h-4 w-4" />
                </button>

                <div
                  className={`absolute right-0 top-full z-[3000] w-[248px] pt-3 transition duration-200 group-hover/account:visible group-hover/account:translate-y-0 group-hover/account:opacity-100 ${
                    menuOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible translate-y-2 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
                    <AccountMenu
                      isLogin={isLogin}
                      userData={userData}
                      onClose={() => setMenuOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-[2600] sm:hidden" ref={dropdownRef}>
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08]"
              >
                <Image
                  src={userData?.avatar || "/images/emptyAccount.png"}
                  alt="Account"
                  width={34}
                  height={34}
                  className="h-8 w-8 rounded-full border border-white/40 object-cover"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-[3000] mt-3 w-[248px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
                  <AccountMenu
                    isLogin={isLogin}
                    userData={userData}
                    onClose={() => setMenuOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative hidden border-b border-slate-200/70 bg-white text-slate-900 shadow-sm transition-[max-height,opacity,transform] duration-300 md:block ${
          showBottomCategories
            ? "max-h-[92px] overflow-visible opacity-100 translate-y-0"
            : "max-h-0 -translate-y-2 overflow-hidden opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-4 py-3">
          <ul className="flex items-center justify-center gap-3 overflow-visible">
            {sortedCatData.length === 0
              ? Array.from({ length: 7 }).map((_, index) => (
                  <li key={`category-skeleton-${index}`}>
                    <div className="h-[62px] w-[118px] animate-pulse rounded-2xl bg-slate-100" />
                  </li>
                ))
              : sortedCatData.map((cat, index) => (
                  <li key={cat._id} className="group/category relative">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/ProductListing?catId=${cat._id}`)
                      }
                      className="group flex h-[62px] min-w-[118px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-slate-900">
                        {getCategoryIcon(
                          cat.name,
                          "h-5 w-5 text-slate-800 transition group-hover:text-white",
                        )}
                      </span>
                      <span className="max-w-[92px] truncate text-sm font-semibold text-slate-800">
                        {cat.name}
                      </span>
                    </button>

                    <CategoryFlyout
                      category={cat}
                      align={index > sortedCatData.length - 3 ? "right" : "left"}
                    />
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

function AccountMenu({ isLogin, userData, onClose }) {
  return (
    <div className="p-2 text-sm">
      {!isLogin ? (
        <>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="font-semibold text-slate-900">Welcome, Guest</p>
            <p className="mt-1 text-xs text-slate-500">
              Login to save products and enquiries.
            </p>
          </div>

          <div className="mt-2 grid gap-1">
            <Link
              href="/login"
              onClick={onClose}
              className="rounded-xl px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="rounded-xl px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Register
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="truncate font-semibold text-slate-900">
              {userData?.name || "User"}
            </p>
            {userData?.email && (
              <p className="mt-1 truncate text-xs text-slate-500">
                {userData.email}
              </p>
            )}
          </div>

          <div className="mt-2 grid gap-1">
            <MenuLink href="/profile" onClose={onClose} icon={<User size={18} />}>
              Profile
            </MenuLink>
            <MenuLink
              href="/enquires"
              onClose={onClose}
              icon={<MdOutlineMessage size={18} />}
            >
              My Enquiries
            </MenuLink>
            <MenuLink
              href="/wishlist"
              onClose={onClose}
              icon={<Heart size={18} />}
            >
              Wishlist
            </MenuLink>
            <MenuLink
              href="/notifications"
              onClose={onClose}
              icon={<Bell size={18} />}
            >
              Notifications
            </MenuLink>
            <MenuLink
              href="/address"
              onClose={onClose}
              icon={<MapPin size={18} />}
            >
              Manage Address
            </MenuLink>
          </div>

          <div className="mt-2 border-t border-slate-100 pt-2">
            <LogoutBTN onLogout={onClose} />
          </div>
        </>
      )}
    </div>
  );
}

function CategoryFlyout({ category, align = "left" }) {
  const children = [...(category?.children || [])].sort((a, b) => a.sln - b.sln);

  if (!category || children.length === 0) return null;

  return (
    <div
      className={`invisible absolute top-full z-[1900] w-[520px] translate-y-2 pt-3 text-slate-900 opacity-0 transition duration-200 group-hover/category:visible group-hover/category:translate-y-0 group-hover/category:opacity-100 ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Browse
            </p>
            <p className="text-base font-semibold text-slate-950">
              {category.name}
            </p>
          </div>
          <Link
            href={`/ProductListing?catId=${category._id}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            View all
          </Link>
        </div>

        <div className="grid max-h-[360px] grid-cols-2 gap-2 overflow-y-auto pr-1 scrollbar-hide">
          {children.map((subCat) => {
            const thirdChildren = [...(subCat.children || [])].sort(
              (a, b) => a.sln - b.sln,
            );

            return (
              <div key={subCat._id} className="rounded-xl p-2 hover:bg-slate-50">
                <Link
                  href={`/ProductListing?subCatId=${subCat._id}`}
                  className="block truncate text-sm font-semibold text-slate-800 hover:text-slate-950"
                >
                  {subCat.name}
                </Link>

                {thirdChildren.length > 0 && (
                  <div className="mt-2 grid gap-1">
                    {thirdChildren.slice(0, 4).map((thirdSubCat) => (
                      <Link
                        key={thirdSubCat._id}
                        href={`/ProductListing?thirdSubCatId=${thirdSubCat._id}`}
                        className="truncate rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-900"
                      >
                        {thirdSubCat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MenuLink({ href, onClose, icon, children }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
    >
      {icon}
      {children}
    </Link>
  );
}

export default Navbar;
