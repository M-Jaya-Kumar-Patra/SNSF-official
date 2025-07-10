
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import CloseIcon from '@mui/icons-material/Close';
import { useCat } from '@/app/context/CategoryContext';
import Link from 'next/link';

import Search from './Search';

const BottomNav = () => {
  const [value, setValue] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedSubCat, setExpandedSubCat] = useState(null);

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
    { label: 'Alerts', value: 'alerts', icon: <NotificationsIcon sx={{ fontSize: 20 }} /> },
    { label: 'Support', value: 'support', icon: <ContactSupportIcon sx={{ fontSize: 20 }} /> }
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full z-50 md:hidden">
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
          color: '#1e40af'
        },
        '.MuiBottomNavigationAction-label': {
          fontSize: '10px',
          '&.Mui-selected': {
            color: '#1e40af'
          }
        }
      }}
    />
  );
})}

        </BottomNavigation>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[300] bg-white/80 backdrop-blur-sm flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 backdrop-blur-sm bg-white/60 shadow-md">
            <h2 className="text-xl font-semibold text-indigo-900 tracking-tight">Search Products</h2>
            <button
              onClick={() => {
                setShowSearch(false);
                setValue("home");

              }}
              className="text-gray-500 hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-100"
              aria-label="Close search"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input & Results */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-10">
            <div className="max-w-2xl mx-auto">
              <Search onClose={() => setShowSearch(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Category Menu with toggle sub-category and third-sub-category */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-48 bottom-14 left-[10%] transform -translate-x-1/2 w-4/5 px-6 sm:hidden z-[999] overflow-y-auto rounded-xl backdrop-blur-xl bg-white/70 shadow-2xl border border-slate-200 p-5 space-y-4 animate-slideIn no-scrollbar"
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
