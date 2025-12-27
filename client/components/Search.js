"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { fetchDataFromApi, searchAPI } from "@/utils/api";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useScreen } from "@/app/context/ScreenWidthContext";
import CloseIcon from "@mui/icons-material/Close";
import SearchDropdownPortal from "./SearchDropdownPortal";
import { searchWithTracking } from "@/utils/searchWithTracking";



const Search = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();

  const inputWrapperRef = useRef(null);
const [dropdownStyle, setDropdownStyle] = useState({});



const justNavigatedRef = useRef(false); 
  const containerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const { isXs, isSm, isMd, isLg, isXl, isXl1440, is2Xl, isGELg, screenWidth, deskSearch, setDeskSearch } = useScreen(); 


  const inputRef = useRef(null);

  useEffect(() => {
  if (isDropdownVisible && inputWrapperRef.current) {
    const rect = inputWrapperRef.current.getBoundingClientRect();

    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    });
  }
}, [isDropdownVisible]);




useEffect(() => {
  if (deskSearch) containerRef.current?.focus();
}, [deskSearch]);



  const expandedWidth = is2Xl
  ? "w-[520px] "
  : isXl1440
  ? "w-[420px] "
  : isXl
  ? "w-[360px] "
  : isLg
  ? "w-[300px] "
  : isMd
  ? "w-[260px] "
  : "w-full";


  const shouldShowSearch = true;


  const collapsedWidth = pathName === "/" ? isScrolled ?
isSm?"hidden" : isMd? "w-[37.2px] ": isLg? "w-[37.2px]" : isXl? "w-[110px]": isXl1440? "w-[110px]":is2Xl? "w-[110px]":"hidden":
 isSm?"hidden " : isMd? "w-[200px]" : isGELg? "w-[200px] "  :    "hidden"
:isMd?"w-[37.2px]":isLg?"w-[37.2px]":  isXl? "w-[110px]":isXl1440 || is2Xl?"w-[200px]":"hidden";

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
    if (!pathname.startsWith("/ProductListing")) {
      setSearchQuery("");
      setResults([]);
      setIsDropdownVisible(false);
    }
  }, [pathname]);
   useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  

  // Update debounced query after 300ms of no typing
useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 500);

  return () => clearTimeout(handler);
}, [searchQuery]);


useEffect(() => {
  if (justNavigatedRef.current) {
    justNavigatedRef.current = false;
    return;
  }

  if (!debouncedQuery.trim()) return resetSearch();

  const fetchResults = async () => {
    try {
      const res = await searchWithTracking(debouncedQuery, "desktop");
      setResults(res?.products ?? []);
      setIsDropdownVisible(true);
    } catch {
      setResults([]);
    }
  };

  fetchResults();
}, [debouncedQuery]);


 const onChangeInput = (e) => {
  setSearchQuery(e.target.value);
};


const handleClickResult = (item) => {
  justNavigatedRef.current = true; // 🔒 lock search

  setSearchQuery("");
  setResults([]);
  setIsDropdownVisible(false);
  setDeskSearch(false);

  if (onClose) onClose();

  if (item.thirdSubCatId) {
    router.push(`/ProductListing?thirdSubCatId=${item.thirdSubCatId}`);
  } else if (item.subCatId) {
    router.push(`/ProductListing?subCatId=${item.subCatId}`);
  } else if (item.catId) {
    router.push(`/ProductListing?catId=${item.catId}`);
  }
};


  // 🔹 Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length) handleClickResult(results[0]);
      else setIsDropdownVisible(false);
    }
  };

useEffect(() => {
  const handleOutsideClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setDeskSearch(false);        // ✅ collapse bar
      setIsDropdownVisible(false);
      resetSearch();
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);
  return () => document.removeEventListener("mousedown", handleOutsideClick);
}, []);



  const toggleDeskSearch = ()=>{
    setDeskSearch(prev => !prev);
  };

  // 🔹 Optimize Cloudinary images
  const getOptimizedCloudinaryUrl = (url) =>
    url?.includes("res.cloudinary.com") ? url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/") : url;


  


  return (

<div
  ref={containerRef}
  className="relative flex items-center w-full cursor-text z-[1200]"
  onClick={() => {
    if (!deskSearch) setDeskSearch(true);
  }}
>

   <div
  ref={containerRef}
  className={`
    relative transition-all duration-300 ease-out
    ${shouldShowSearch ? "block" : "hidden"}
    ${deskSearch ? expandedWidth : collapsedWidth}
  `}
>




{/* 
  
const isXs = screenWidth < 640;// < sm
const isSm = screenWidth >= 640 && screenWidth < 768;
const isMd = screenWidth >= 768 && screenWidth < 1024;
const isLg = screenWidth >= 1024 && screenWidth < 1280;
const isXl = screenWidth >= 1280 && screenWidth < 1440;
const isXl1440 = screenWidth >= 1440 && screenWidth < 1536;
const is2Xl = screenWidth >= 1536;
const isGELg = screenWidth>=1024;
//


*/}





      {/* max-w-[1800px] mx-auto px-4 flex items-center justify-between
        ${isScrolled ? "h-[70px]" : "h-[80px]"}
 */}


      {/* Search Box */}
      <div

      ref={inputWrapperRef}
  className={`
    flex items-center w-full sm:bg-white
    px-2 py-[6px]   /* height locked */
    border border-slate-400
    focus-within:ring-[0.5px] focus-within:ring-slate-200

    transition-[border-radius,box-shadow,transform,background-color]
    duration-100
    ease-[cubic-bezier(0.22,1,0.36,1)]
    will-change-[transform]
rounded-full
bg-white shadow-md
  `}
>
  <SearchOutlinedIcon
    width={20}
    height={20}
    className={`
      mr-3 select-none text-slate-900
      transition-transform duration-300
    `}
  />

{/* 
  
const isXs = screenWidth < 640;// < sm
const isSm = screenWidth >= 640 && screenWidth < 768;
const isMd = screenWidth >= 768 && screenWidth < 1024;
const isLg = screenWidth >= 1024 && screenWidth < 1280;
const isXl = screenWidth >= 1280 && screenWidth < 1440;
const isXl1440 = screenWidth >= 1440 && screenWidth < 1536;
const is2Xl = screenWidth >= 1536;
const isGELg = screenWidth>=1024;
//


*/}

{/* 

${ pathName === "/" ? isScrolled ?
isSm?"hidden" : isMd? "w-[200px] ": isLg? "w-[110px]" : isXl1440? "w-[110px]":is2Xl? "w-[110px]":"hidden":
 isSm?"hidden " : isMd? "w-[200px]"   :    "hidden"
:isLg?"w-[37.2px]":  isXl? "w-[110px]":isXl1440 || is2Xl?"w-[200px]":"hidden"
 */}


 <input
 ref={inputRef}
 
  type="text"
  placeholder={
    pathName === "/" ? isScrolled ? 
    
   isMd?"" :isLg?"": isXl? "Search":isXl1440? "Search":is2Xl? "Search":""// '/' scrolled                   //// if any error  seach-->""

    :  isMd ?"Search Products": isSm? "" :"Search Products"// '/' not scrolled -------

    :  
    
    isMd ? " " :isLg ? " " : isXl?"Search" : isXl1440 || is2Xl?"Search Products":""//not '/' scrolled

    
  }
  value={searchQuery}
  onChange={onChangeInput}
  onKeyDown={handleKeyDown}
  className=" w-full
    flex-grow bg-transparent outline-none
    card-title text-black
    placeholder-slate-500
  "
  autoComplete="off"
  spellCheck="false"
/>

{deskSearch && (
  <button
    onClick={(e) => {
      e.stopPropagation();   // 🔥 VERY IMPORTANT
      setDeskSearch(false);
      setIsDropdownVisible(false);
    }}
    className="ml-2 p-1 text-slate-500 hover:text-slate-800"
  >
    <CloseIcon fontSize="small" />
  </button>
)}


</div>


      {/* Dropdown */}
     {isDropdownVisible && searchQuery.trim() && (
  <SearchDropdownPortal>
    <ul
      style={dropdownStyle}
      className="
        bg-white
        rounded-xl
        shadow-2xl
        max-h-[320px]
        overflow-y-auto
        border border-gray-200
        scrollbar-hide
      "
    >
      {results.length ? (
        results.map((item) => (
          <li
            key={item._id}
            onMouseDown={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleClickResult(item);
    setIsDropdownVisible(false);
  }}
            className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-indigo-50"
          >
            {item.images && (
              <Image
                src={getOptimizedCloudinaryUrl(item.images[0] || item.images) || "/images/placeholder.jpg"}
                alt={item.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            )}
            <span className="text-indigo-900 font-medium text-sm truncate">
              {item.name}
            </span>
          </li>
        ))
      ) : (
        <li className="py-4 px-4 text-gray-500 text-sm italic">
          No products found
        </li>
      )}
    </ul>
  </SearchDropdownPortal>
)}

    </div>
    </div>

  );
};

export default Search;
