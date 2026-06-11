"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Loader2, Search as SearchIcon, X } from "lucide-react";
import { useScreen } from "@/app/context/ScreenWidthContext";
import SearchDropdownPortal from "./SearchDropdownPortal";
import { searchWithTracking } from "@/utils/searchWithTracking";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

const Search = ({ onClose, navScrolled = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const containerRef = useRef(null);
  const inputWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const justNavigatedRef = useRef(false);

  const router = useRouter();
  const pathname = usePathname();
  const pathName = usePathname();

  const {
    isMd,
    isLg,
    isXl,
    isXl1440,
    is2Xl,
    deskSearch,
    setDeskSearch,
  } = useScreen();

  const effectiveScrolled =
    typeof navScrolled === "boolean" ? navScrolled : isScrolled;
  const isTopExpanded = pathName === "/" && !effectiveScrolled;
  const isSearchExpanded = deskSearch || isTopExpanded;

  const largeExpandedWidth = is2Xl
    ? "w-[520px]"
    : isXl1440
    ? "w-[440px]"
    : isXl
    ? "w-[380px]"
    : isLg
    ? "w-[320px]"
    : isMd
    ? "w-[280px]"
    : "w-full";

  const mediumExpandedWidth = is2Xl
    ? "w-[360px]"
    : isXl1440
    ? "w-[340px]"
    : isXl
    ? "w-[320px]"
    : isLg
    ? "w-[300px]"
    : isMd
    ? "w-[260px]"
    : "w-full";

  const expandedWidth = effectiveScrolled
    ? mediumExpandedWidth
    : largeExpandedWidth;

  const collapsedWidth =
    isMd || isLg || isXl || isXl1440 || is2Xl ? "w-[42px]" : "hidden";

  const currentWidth = isSearchExpanded ? expandedWidth : collapsedWidth;

  const updateDropdownPosition = () => {
    if (!inputWrapperRef.current) return;

    const rect = inputWrapperRef.current.getBoundingClientRect();
    const desiredWidth = Math.min(
      Math.max(rect.width, 380),
      window.innerWidth - 24,
    );
    const left = Math.min(
      Math.max(12, rect.left),
      window.innerWidth - desiredWidth - 12,
    );

    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 10,
      left,
      width: desiredWidth,
      zIndex: 99999,
    });
  };

  const resetSearch = () => {
    setIsDropdownVisible(false);
    setIsSearching(false);

    if (!pathname.startsWith("/ProductListing")) {
      setSearchQuery("");
      setResults([]);
    }
  };

  useEffect(() => {
    if (deskSearch) inputRef.current?.focus();
  }, [deskSearch]);

  useEffect(() => {
    if (!pathname.startsWith("/ProductListing")) {
      setSearchQuery("");
      setResults([]);
      setIsDropdownVisible(false);
      setIsSearching(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (justNavigatedRef.current) {
      justNavigatedRef.current = false;
      return;
    }

    if (!debouncedQuery) {
      resetSearch();
      return;
    }

    let ignore = false;

    const fetchResults = async () => {
      try {
        setIsSearching(true);
        const res = await searchWithTracking(debouncedQuery, "desktop");
        if (ignore) return;

        setResults(res?.products ?? []);
        setIsDropdownVisible(true);
        updateDropdownPosition();
      } catch {
        if (!ignore) setResults([]);
      } finally {
        if (!ignore) setIsSearching(false);
      }
    };

    fetchResults();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isDropdownVisible) return;

    updateDropdownPosition();

    const handleResize = () => updateDropdownPosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isDropdownVisible, isSearchExpanded]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDeskSearch(false);
        setIsDropdownVisible(false);
        resetSearch();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleClickResult = (item) => {
    justNavigatedRef.current = true;

    setSearchQuery("");
    setResults([]);
    setIsDropdownVisible(false);
    setDeskSearch(false);

    if (onClose) onClose();

    router.push(getProductPath(item));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length) handleClickResult(results[0]);
      else setIsDropdownVisible(false);
    }

    if (e.key === "Escape") {
      setIsDropdownVisible(false);
      setDeskSearch(false);
      inputRef.current?.blur();
    }
  };

  const handleClearOrClose = (e) => {
    e.stopPropagation();

    if (searchQuery) {
      setSearchQuery("");
      setResults([]);
      setIsDropdownVisible(false);
      inputRef.current?.focus();
      return;
    }

    setDeskSearch(false);
    setIsDropdownVisible(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative z-[1200] flex w-full cursor-text items-center justify-end overflow-visible"
      onClick={() => {
        if (!deskSearch) setDeskSearch(true);
        inputRef.current?.focus();
      }}
    >
      <div
        className={`relative ml-auto transition-[width] duration-300 ease-out ${currentWidth}`}
      >
        <div
          ref={inputWrapperRef}
          className={`group flex min-h-11 w-full items-center gap-2 rounded-full border bg-white px-3 shadow-sm transition duration-200 ${
            isSearchExpanded
              ? "border-slate-200 shadow-[0_10px_28px_rgba(15,23,42,0.16)] focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-white/60"
              : "border-white/20 hover:border-white/40 hover:bg-slate-50"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition group-focus-within:bg-slate-950 group-focus-within:text-white">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </span>

          <input
            ref={inputRef}
            type="text"
            aria-label="Search products"
            placeholder={
              isSearchExpanded
                ? "Search products, sofas, beds..."
                : ""
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setDeskSearch(true);
              if (searchQuery.trim()) {
                setIsDropdownVisible(true);
                updateDropdownPosition();
              }
            }}
            onKeyDown={handleKeyDown}
            className={`min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 ${
              isSearchExpanded ? "opacity-100" : "opacity-0"
            }`}
            autoComplete="off"
            spellCheck="false"
          />

          {(deskSearch || searchQuery) && (
            <button
              type="button"
              aria-label={searchQuery ? "Clear search" : "Close search"}
              onClick={handleClearOrClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isDropdownVisible && searchQuery.trim() && (
          <SearchDropdownPortal>
            <div
              style={dropdownStyle}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-2xl shadow-slate-950/20"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Search results
                  </p>
                  <p className="mt-1 max-w-[280px] truncate text-sm font-semibold text-slate-900">
                    {searchQuery}
                  </p>
                </div>
                {isSearching && (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                )}
              </div>

              <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-hide">
                {results.length ? (
                  <ul className="space-y-1">
                    {results.slice(0, 8).map((item) => (
                      <li key={item._id}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClickResult(item);
                          }}
                          className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50"
                        >
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            {item.images && (
                              <Image
                                src={getCloudinaryImageUrl(
                                  item.images[0] ||
                                    item.images ||
                                    "/images/placeholder.jpg",
                                  { width: 120, height: 120 },
                                )}
                                alt={item.name || "Product"}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                              {item.brand || "SNSF"}
                            </span>
                            <span className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                              {item.name}
                            </span>
                          </span>

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-slate-950 group-hover:text-white">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-slate-900">
                      No products found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try a shorter product name or category keyword.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SearchDropdownPortal>
        )}
      </div>
    </div>
  );
};

export default Search;
