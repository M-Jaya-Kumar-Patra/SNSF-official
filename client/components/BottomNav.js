
  "use client";
  import React, { useState, useEffect, useRef } from 'react';
  import { useRouter } from 'next/navigation';

  import BottomNavigation from '@mui/material/BottomNavigation';
  import BottomNavigationAction from '@mui/material/BottomNavigationAction';

  import SearchIcon from '@mui/icons-material/Search';
  import CategoryIcon from '@mui/icons-material/Category';
  import HomeIcon from '@mui/icons-material/Home';
  import NotificationsIcon from '@mui/icons-material/Notifications';
  import PhoneIcon from '@mui/icons-material/Phone';
  import CloseIcon from '@mui/icons-material/Close';
  import { useCat } from '@/app/context/CategoryContext';
  import Link from 'next/link';

  import { searchWithTracking } from "@/utils/searchWithTracking";
  import Search from './Search';

  const BottomNav = () => {
    const [value, setValue] = useState('home');
    const [showSearch, setShowSearch] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedCat, setExpandedCat] = useState(null);
    const [expandedSubCat, setExpandedSubCat] = useState(null);


    const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);




    const menuRef = useRef(null);


    const { catData } = useCat();
    const router = useRouter();

    const handleChange = (event, newValue) => {
    setValue(newValue);

    if (newValue !== "category") {
      setMobileMenuOpen(false);
      setExpandedCat(null);
      setExpandedSubCat(null);
    }

    if (newValue === "search") {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }

    switch (newValue) {
      case 'home':
        router.push('/');
        break;
      case 'alerts':
        router.push('/notifications');
        break;
      case 'support':
        window.location.href = 'tel:+919776501230';
        break;
      default:
        break;
    }
  };



    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMobileMenuOpen(false);
          setExpandedCat(null);
          setExpandedSubCat(null);
        }
      };

      if (mobileMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [mobileMenuOpen]);

    const toggleCat = (catId) => {
      setExpandedCat(prev => (prev === catId ? null : catId));
      setExpandedSubCat(null); // reset subcat when cat changes
    };

    const toggleSubCat = (subCatId) => {
      setExpandedSubCat(prev => (prev === subCatId ? null : subCatId));
    };

    const navItems = [
      { label: 'Search', value: 'search', icon: <SearchIcon sx={{ fontSize: 20 }} /> },
      { label: 'Category', value: 'category', icon: <CategoryIcon sx={{ fontSize: 20 }} /> },
      { label: 'Home', value: 'home', icon: <HomeIcon sx={{ fontSize: 24 }} /> },
      { label: 'Notifications', value: 'alerts', icon: <NotificationsIcon sx={{ fontSize: 20 }} /> },
      { label: 'Contact us', value: 'support', icon: <PhoneIcon sx={{ fontSize: 20 }} /> }
    ];


    const handleMobileSearch = async (q) => {
    setMobileQuery(q);

    if (!q.trim()) {
      setMobileResults([]);
      return;
    }

    try {
      setLoadingSearch(true);

  const res = await searchWithTracking(q, "mobile");
  setMobileResults(res?.products || []);

    } catch (err) {
      console.error("Mobile search error", err);
      setMobileResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };


    return (
      <>
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-screen z-50 md:hidden">
          <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            className="w-full !shadow-inner"
            sx={{ height: 56 }}
          >
            {navItems.map((item) => {
    const isCategory = item.value === "category";
    return (
      <BottomNavigationAction
        key={item.value}
        label={item.label}
        value={item.value}
        icon={item.icon}
        onClick={() => {
          if (isCategory) {
            // Always toggle when clicking category
            setMobileMenuOpen(prev => {
              if (prev) {
                setExpandedCat(null);
                setExpandedSubCat(null);
              }
              return !prev;
            });
            setShowSearch(false);
            setValue("category");
          } else {
            setMobileMenuOpen(false);
          }
        }}
        sx={{
          minWidth: 0,
          padding: '0 4px',
          '&.Mui-selected': {
            color: '#0f172a'
          },
          '.MuiBottomNavigationAction-label': {
            fontSize: '10px',
            '&.Mui-selected': {
              color: '#0f172a'
            }
          }
        }}
      />
    );
  })}

          </BottomNavigation>
        </div>

        {/* Search Overlay */}
      {/* Search Overlay */}
  {/* ===== MOBILE SEARCH OVERLAY (SEPARATE) ===== */}
  {showSearch && (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col md:hidden">

      {/* TOP BAR */}
      <div className="sticky top-0 bg-white z-[1100] border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => {
            setShowSearch(false);
            setValue("home");
            setMobileQuery("");
            setMobileResults([]);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <CloseIcon />
        </button>

        {/* MOBILE SEARCH INPUT */}
        <input
          type="text"
          value={mobileQuery}
          onChange={(e) => handleMobileSearch(e.target.value)}
          placeholder="Search products, categories…"
          className="
            w-full
            border border-gray-300
            rounded-full
            px-4 py-3
            text-[18px]
            outline-none
            focus:ring-1 focus:ring-indigo-400
          "
          autoFocus
        />
      </div>

      {/* RESULTS */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loadingSearch && (
          <p className="text-sm text-gray-500">Searching…</p>
        )}

        {!loadingSearch && mobileResults.length === 0 && mobileQuery && (
          <p className="text-sm text-gray-500">No products found</p>
        )}

        <ul className="space-y-3">
          {mobileResults.map((item) => (
            <li
              key={item._id}
              onClick={() => {
                setShowSearch(false);
                setValue("home");

                if (item.thirdSubCatId) {
                  router.push(`/ProductListing?thirdSubCatId=${item.thirdSubCatId}`);
                } else if (item.subCatId) {
                  router.push(`/ProductListing?subCatId=${item.subCatId}`);
                } else if (item.catId) {
                  router.push(`/ProductListing?catId=${item.catId}`);
                }
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
              )}
              <span className="text-slate-800 font-medium text-sm">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )}



        {/* Mobile Category Menu with toggle sub-category and third-sub-category */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="fixed top-48 bottom-14 left-[10%] transform -translate-x-1/2 w-4/5 px-6 lg:hidden z-[999] overflow-y-auto rounded-xl backdrop-blur-xl bg-white/70 shadow-2xl border border-slate-200 p-5 space-y-4 animate-slideIn no-scrollbar"
          >
            {(catData || [])
              .slice()
              .sort((a, b) => a.sln - b.sln)
              .map((cat) => (
                <div key={cat._id} className="space-y-2 border-b border-gray-200 pb-3">
                  {/* Main Category Row */}
                  <div className="flex justify-between items-center text-slate-800 text-[18px]">
                    <span
                      onClick={() => {
                        router.push(`/ProductListing?catId=${cat._id}`);
                        setMobileMenuOpen(false);
                        setValue("home");
                        setShowSearch(false);
                      }}
                      className="cursor-pointer font-semibold hover:text-indigo-800 transition w-full"
                    >
                      {cat.name}
                    </span>
                    {cat.children?.length > 0 && (
                      <span
                        onClick={() => toggleCat(cat._id)}
                        className="cursor-pointer text-[18px] hover:text-indigo-800"
                      >
                        {expandedCat === cat._id ? "−" : "+"}
                      </span>
                    )}
                  </div>

                  {/* Subcategories */}
                  {expandedCat === cat._id && cat.children?.length > 0 && (
                    <ul className="pl-3 mt-4 space-y-2 text-[17px] text-indigo-900 animate-fadeIn">
                      {cat.children
                        .slice()
                        .sort((a, b) => a.sln - b.sln)
                        .map((subCat) => (
                          <li key={subCat._id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span
                                onClick={() => {
                                  router.push(`/ProductListing?subCatId=${subCat._id}`);
                                  setMobileMenuOpen(false);
                                  setValue("home");
                                  setShowSearch(false);
                                }}
                                className="cursor-pointer hover:text-indigo-900 transition w-full"
                              >
                                {subCat.name}
                              </span>

                              {subCat.children?.length > 0 && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubCat(subCat._id);
                                  }}
                                  className="cursor-pointer text-[17px] hover:text-indigo-900"
                                >
                                  {expandedSubCat === subCat._id ? "−" : "+"}
                                </span>
                              )}
                            </div>

                            {/* Third Subcategories */}
                            {expandedSubCat === subCat._id &&
                              subCat.children?.length > 0 && (
                                <ul className="pl-4 space-y-2 text-[17px] text-indigo-600 animate-fadeIn">
                                  {subCat.children
                                    .slice()
                                    .sort((a, b) => a.sln - b.sln)
                                    .map((thirdSubCat) => (
                                      <li key={thirdSubCat._id}>
                                        <span
                                          onClick={() => {
                                            router.push(
                                              `/ProductListing?thirdSubCatId=${thirdSubCat._id}`
                                            );
                                            setMobileMenuOpen(false);
                                            setValue("home");
                                            setShowSearch(false);
                                          }}
                                          className="cursor-pointer hover:text-indigo-800 transition w-full"
                                        >
                                          {thirdSubCat.name}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              )}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}


      </>
    );
  };

  export default BottomNav;
