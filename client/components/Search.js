"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";

const Search = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const containerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // 🔹 Reset search state
  const resetSearch = () => {
    setIsDropdownVisible(false);
    if (!pathname.startsWith("/ProductListing")) {
      setSearchQuery("");
      setResults([]);
    }
  };

  // 🔹 Clear search when route changes (except /ProductListing)
  useEffect(() => {
    if (!pathname.startsWith("/ProductListing/")) {
      setSearchQuery("");
      setResults([]);
      setIsDropdownVisible(false);
    }
  }, [pathname]);

  // 🔹 Handle input changes
  const onChangeInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) return resetSearch();

    setIsDropdownVisible(true);
    try {
      const res = await fetchDataFromApi(`/api/product/search/get?q=${query}`, false);
      setResults(res?.products ?? []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  // 🔹 Navigate to product listing
  const handleClickResult = (item) => {
    resetSearch();
    if (onClose) onClose();

    if (item.thirdSubCatId) router.push(`/ProductListing?thirdSubCatId=${item.thirdSubCatId}`);
    else if (item.subCatId) router.push(`/ProductListing?subCatId=${item.subCatId}`);
    else if (item.catId) router.push(`/ProductListing?catId=${item.catId}`);
  };

  // 🔹 Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length) handleClickResult(results[0]);
      else setIsDropdownVisible(false);
    }
  };

  // 🔹 Close dropdown when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) resetSearch();
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 🔹 Optimize Cloudinary images
  const getOptimizedCloudinaryUrl = (url) =>
    url?.includes("res.cloudinary.com") ? url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/") : url;

  return (
    <div ref={containerRef} className="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      {/* Search Box */}
      <div className="flex items-center w-full bg-indigo-50 bg-opacity-5 rounded-lg px-3 py-[6px] shadow-sm border border-slate-400 focus-within:ring-[0.5px] focus-within:ring-slate-200 transition duration-300">
        <Image src="/images/search.png" alt="Search" width={20} height={20} className="sm:invert opacity-80 mr-3 select-none" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={onChangeInput}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent outline-none text-sm text-black sm:text-white sm:placeholder-slate-200"
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* Dropdown */}
      {isDropdownVisible && searchQuery.trim() && (
        <ul className="absolute z-50 top-full left-0 w-full bg-white rounded-lg shadow-lg max-h-[320px] overflow-y-auto border border-gray-200 mt-2 scrollbar-hide">
          {results.length ? (
            results.map((item) => (
              <li
                key={item._id}
                onClick={() => handleClickResult(item)}
                className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-indigo-50 rounded-lg"
              >
                {item.images && (
                  <Image
                    src={getOptimizedCloudinaryUrl(item.images[0] || item.images)}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                )}
                <span className="text-indigo-900 font-medium text-sm truncate">{item.name}</span>
              </li>
            ))
          ) : (
            <li className="py-4 px-4 text-gray-500 text-sm italic">No products found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Search;
