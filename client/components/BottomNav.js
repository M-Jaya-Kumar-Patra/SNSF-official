"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  Bell as BellIcon,
  Boxes,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Home as HomeIcon,
  LampDesk,
  Laptop,
  Package,
  Phone as PhoneIcon,
  Search as SearchIcon,
  Sofa,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useCat } from "@/app/context/CategoryContext";
import { searchWithTracking } from "@/utils/searchWithTracking";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

const categoryIcons = {
  sofas: Sofa,
  "living room": HomeIcon,
  bedroom: BedDouble,
  dining: UtensilsCrossed,
  "study & office": Laptop,
  "home decor": LampDesk,
  accessories: Boxes,
};

const getCategoryIcon = (name, className = "h-5 w-5 text-slate-900") => {
  const Icon = categoryIcons[name?.toLowerCase()] || Package;
  return <Icon className={className} strokeWidth={1.9} />;
};

const sortByOrder = (items = []) => items.slice().sort((a, b) => a.sln - b.sln);

const BottomNav = () => {
  const [value, setValue] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedSubCat, setExpandedSubCat] = useState(null);
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const searchInputRef = useRef(null);
  const { catData } = useCat();
  const router = useRouter();

  const sortedCategories = useMemo(() => sortByOrder(catData || []), [catData]);

  useEffect(() => {
    if (!showSearch && !mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen, showSearch]);

  useEffect(() => {
    if (!showSearch) return;

    const timer = setTimeout(() => searchInputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [showSearch]);

  useEffect(() => {
    if (!showSearch) return;

    const query = mobileQuery.trim();

    if (!query) {
      setMobileResults([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);

    const timer = setTimeout(async () => {
      try {
        const res = await searchWithTracking(query, "mobile");
        setMobileResults(res?.products || []);
      } catch {
        setMobileResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [mobileQuery, showSearch]);

  const closeSearch = () => {
    setShowSearch(false);
    setValue("home");
    setMobileQuery("");
    setMobileResults([]);
    setLoadingSearch(false);
  };

  const closeCategory = () => {
    setMobileMenuOpen(false);
    setExpandedCat(null);
    setExpandedSubCat(null);
    setValue("home");
  };

  const openSearch = () => {
    setMobileMenuOpen(false);
    setExpandedCat(null);
    setExpandedSubCat(null);
    setShowSearch(true);
    setValue("search");
  };

  const toggleCategorySheet = () => {
    setShowSearch(false);
    setMobileQuery("");
    setMobileResults([]);
    setValue("category");
    setMobileMenuOpen((prev) => {
      if (prev) {
        setExpandedCat(null);
        setExpandedSubCat(null);
      }
      return !prev;
    });
  };

  const goTo = (href) => {
    closeSearch();
    closeCategory();
    router.push(href);
  };

  const navItems = [
    { label: "Search", value: "search", Icon: SearchIcon },
    { label: "Category", value: "category", Icon: Grid3X3 },
    { label: "Home", value: "home", Icon: HomeIcon },
    { label: "Alerts", value: "alerts", Icon: BellIcon },
    { label: "Call", value: "support", Icon: PhoneIcon },
  ];

  return (
    <>
      <div className="fixed bottom-0 z-50 w-screen border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-2px_18px_rgba(15,23,42,0.16)] backdrop-blur md:hidden">
        <nav className="grid h-[58px] grid-cols-5 gap-1" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const selected = value === item.value;
            const Icon = item.Icon;

            return (
              <button
                type="button"
                key={item.value}
                onClick={() => {
                  if (item.value === "search") {
                    openSearch();
                    return;
                  }

                  if (item.value === "category") {
                    toggleCategorySheet();
                    return;
                  }

                  closeSearch();
                  closeCategory();

                  setValue(item.value);

                  if (item.value === "home") router.push("/");
                  if (item.value === "alerts") router.push("/notifications");
                  if (item.value === "support") window.location.href = "tel:+919776501230";
                }}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-bold transition ${
                  selected
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 active:bg-slate-100"
                }`}
              >
                <Icon size={item.value === "home" ? 22 : 20} strokeWidth={2.1} />
                <span className="truncate leading-none">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-[1200] flex flex-col bg-slate-50 md:hidden">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)] shadow-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex min-h-12 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 focus-within:border-slate-900 focus-within:bg-white">
                <SearchIcon className="h-5 w-5 shrink-0 text-slate-500" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent text-[16px] font-medium text-slate-950 outline-none placeholder:text-slate-400"
                  autoComplete="off"
                  spellCheck="false"
                />
                {mobileQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setMobileQuery("");
                      setMobileResults([]);
                      searchInputRef.current?.focus();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {!mobileQuery.trim() && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Quick browse
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {sortedCategories.slice(0, 8).map((cat) => (
                    <button
                      key={`search-category-${cat._id}`}
                      type="button"
                      onClick={() => goTo(`/ProductListing?catId=${cat._id}`)}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        {getCategoryIcon(cat.name)}
                      </span>
                      <span className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {mobileQuery.trim() && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Results
                  </p>
                  {loadingSearch && (
                    <span className="text-xs font-medium text-slate-500">Searching</span>
                  )}
                </div>

                {loadingSearch ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={`mobile-search-skeleton-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                      >
                        <div className="h-16 w-16 animate-pulse rounded-xl bg-slate-200" />
                        <div className="flex-1">
                          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : mobileResults.length > 0 ? (
                  <ul className="space-y-3">
                    {mobileResults.map((item) => (
                      <li key={item._id}>
                        <button
                          type="button"
                          onClick={() => goTo(getProductPath(item))}
                          className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition active:scale-[0.99]"
                        >
                          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            {item.images?.[0] && (
                              <Image
                                src={getCloudinaryImageUrl(
                                  item.images[0] || "/images/placeholder.jpg",
                                  { width: 160, height: 160 },
                                )}
                                alt={item.name || "Product"}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">
                              {item.name}
                            </span>
                            <span className="mt-1 block text-xs font-medium text-slate-500">
                              Tap to view product
                            </span>
                          </span>
                          <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <p className="text-base font-semibold text-slate-900">
                      No products found
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Try a shorter name or browse by category.
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[980] bg-slate-950/35 backdrop-blur-[2px] md:hidden"
          onClick={closeCategory}
        />
      )}

      {mobileMenuOpen && (
        <section className="fixed inset-x-3 bottom-[82px] z-[1000] max-h-[74vh] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl md:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Browse store
              </p>
              <h2 className="text-[22px] font-semibold leading-tight text-slate-950">
                Categories
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close categories"
              onClick={closeCategory}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(74vh-78px)] overflow-y-auto px-3 py-3">
            {sortedCategories.map((cat) => {
              const isOpen = expandedCat === cat._id;
              const children = sortByOrder(cat.children || []);

              return (
                <div key={cat._id} className="border-b border-slate-100 py-2 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goTo(`/ProductListing?catId=${cat._id}`)}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-2 py-2 text-left active:bg-slate-50"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                        {getCategoryIcon(cat.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-semibold text-slate-950">
                          {cat.name}
                        </span>
                        {children.length > 0 && (
                          <span className="mt-0.5 block text-xs font-medium text-slate-500">
                            {children.length} subcategories
                          </span>
                        )}
                      </span>
                    </button>

                    {children.length > 0 && (
                      <button
                        type="button"
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${cat.name}`}
                        onClick={() => {
                          setExpandedCat(isOpen ? null : cat._id);
                          setExpandedSubCat(null);
                        }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                      >
                        <ChevronDown
                          className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {isOpen && children.length > 0 && (
                    <div className="ml-14 mt-1 space-y-2 pb-2">
                      {children.map((subCat) => {
                        const subOpen = expandedSubCat === subCat._id;
                        const thirdChildren = sortByOrder(subCat.children || []);

                        return (
                          <div
                            key={subCat._id}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-2"
                          >
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  goTo(`/ProductListing?subCatId=${subCat._id}`)
                                }
                                className="min-w-0 flex-1 px-2 py-1 text-left text-sm font-semibold text-slate-800"
                              >
                                {subCat.name}
                              </button>

                              {thirdChildren.length > 0 && (
                                <button
                                  type="button"
                                  aria-label={`${subOpen ? "Collapse" : "Expand"} ${subCat.name}`}
                                  onClick={() =>
                                    setExpandedSubCat(subOpen ? null : subCat._id)
                                  }
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-700"
                                >
                                  <ChevronDown
                                    className={`h-4 w-4 transition ${
                                      subOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {subOpen && thirdChildren.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2 px-1 pb-1">
                                {thirdChildren.map((thirdSubCat) => (
                                  <button
                                    key={thirdSubCat._id}
                                    type="button"
                                    onClick={() =>
                                      goTo(
                                        `/ProductListing?thirdSubCatId=${thirdSubCat._id}`,
                                      )
                                    }
                                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                                  >
                                    {thirdSubCat.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default BottomNav;
