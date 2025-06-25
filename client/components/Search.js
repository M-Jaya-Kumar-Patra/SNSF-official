"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/navigation";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  const onChangeInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query !== "") {
      setIsDropdownVisible(true);
      try {
        const res = await fetchDataFromApi(`/api/product/search/get?q=${query}`, false);
        if (res?.products?.length > 0) {
          setResults(res.products);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    } else {
      setResults([]);
      setIsDropdownVisible(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) {
        const firstItem = results[0];
        if (firstItem.thirdSubCatId) {
          router.push(`/ProductListing?thirdSubCatId=${firstItem.thirdSubCatId}`);
        } else if (firstItem.subCatId) {
          router.push(`/ProductListing?subCatId=${firstItem.subCatId}`);
        } else if (firstItem.catId) {
          router.push(`/ProductListing?catId=${firstItem.catId}`);
        }
        setIsDropdownVisible(false);
      } else {
        setIsDropdownVisible(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
    >
      {/* Search input box */}
      <div
        className="flex items-center w-full bg-indigo-50 bg-opacity-5 focus-within:bg-indigo-100 focus-within:bg-opacity-15
                   rounded-lg px-3 py-[6px] shadow-sm border border-slate-400
                   focus-within:ring-[0.5px] focus-within:ring-slate-200
                   transition duration-300"
      >
        <Image
          src="/images/search.png"
          alt="Search"
          width={20}
          height={20}
          className="invert opacity-80 mr-3 select-none"
          draggable={false}
        />
        <input
          type="text"
          placeholder="Search products..."
          className="flex-grow bg-transparent outline-none text-sm text-white placeholder-slate-200 caret-blue-400"
          onChange={onChangeInput}
          onKeyDown={handleKeyDown}
          value={searchQuery}
          spellCheck="false"
          autoComplete="off"
        />
      </div>

      {/* Dropdown */}
      {isDropdownVisible && searchQuery.trim() !== "" && (
        <ul className="absolute z-50 top-full left-0 w-full bg-white rounded-lg shadow-lg max-h-[320px] overflow-y-auto border border-gray-200 mt-2 scrollbar-hide">
          {results.length > 0 ? (
            results.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-colors duration-150 rounded-lg"
                onClick={() => {
                  if (item.thirdSubCatId) {
                    router.push(`/ProductListing?thirdSubCatId=${item.thirdSubCatId}`);
                  } else if (item.subCatId) {
                    router.push(`/ProductListing?subCatId=${item.subCatId}`);
                  } else if (item.catId) {
                    router.push(`/ProductListing?catId=${item.catId}`);
                  }
                  setIsDropdownVisible(false);
                }}
              >
                {item.images && (
                  <Image
                    src={item.images[0] || item.images}
                    alt={item.name}
                    height={40}
                    width={40}
                    className="rounded-md object-cover shadow-md"
                    draggable={false}
                  />
                )}
                <div className="text-indigo-900 font-medium text-sm truncate">
                  {item.name}
                </div>
              </li>
            ))
          ) : (
            <li className="py-4 px-4 text-gray-500 text-sm italic select-none">
              No products found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Search;
