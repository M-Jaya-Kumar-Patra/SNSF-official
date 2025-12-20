// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";

const ScreenWidth = createContext();

const ScreenWidthProvider = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(0);

  const [deskSearch, setDeskSearch] = useState(false);

  const isXs = screenWidth < 640;
  const isSm = screenWidth >= 640 && screenWidth < 768;
  const isMd = screenWidth >= 768 && screenWidth < 1024;
  const isLg = screenWidth >= 1024 && screenWidth < 1280;
  const isXl = screenWidth >= 1280 && screenWidth < 1440;
  const isXl1440 = screenWidth >= 1440 && screenWidth < 1536;
  const is2Xl = screenWidth >= 1536;
  const isGELg = screenWidth >= 1024;

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <ScreenWidth.Provider
      value={{
        isXs,
        isSm,
        isMd,
        isLg,
        isXl,
        isXl1440,
        is2Xl,
        isGELg,
        screenWidth,
        deskSearch,
        setDeskSearch,
      }}
    >
      {children}
    </ScreenWidth.Provider>
  );
};

export { ScreenWidthProvider };

export const useScreen = () => useContext(ScreenWidth);
