// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";

const CatContext = createContext();
const CATEGORY_CACHE_KEY = "snsf.categories.v1";
const CATEGORY_CACHE_TTL = 5 * 60 * 1000;

let categoryRequest = null;
let categoryMemoryCache = null;

const readCachedCategories = () => {
  if (categoryMemoryCache && Date.now() - categoryMemoryCache.cachedAt < CATEGORY_CACHE_TTL) {
    return categoryMemoryCache.data;
  }

  if (typeof window === "undefined") return undefined;

  try {
    const cached = JSON.parse(sessionStorage.getItem(CATEGORY_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.cachedAt < CATEGORY_CACHE_TTL) {
      categoryMemoryCache = cached;
      return cached.data;
    }
  } catch {
    sessionStorage.removeItem(CATEGORY_CACHE_KEY);
  }

  return undefined;
};

const writeCachedCategories = (data) => {
  categoryMemoryCache = { data, cachedAt: Date.now() };

  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(categoryMemoryCache));
  } catch {
    // Ignore storage failures; the live request result is still used.
  }
};

const fetchCategoriesOnce = () => {
  if (!categoryRequest) {
    categoryRequest = fetchDataFromApi("/api/category/getCategories", false).finally(() => {
      categoryRequest = null;
    });
  }

  return categoryRequest;
};

const CatProvider = ({ children }) => {
  const [catData, setCatData] = useState();

  useEffect(() => {
    const cachedCategories = readCachedCategories();
    if (cachedCategories) {
      setCatData(cachedCategories);
    }

    fetchCategoriesOnce().then((response) => {
      if (!response.error) {
        const categories = response?.data || [];
        writeCachedCategories(categories);
        setCatData(categories);
      }
    });
  }, []);

  return (
    <CatContext.Provider value={{ catData, setCatData }}>
      {children}
    </CatContext.Provider>
  );
};

export { CatProvider };

export const useCat = () => useContext(CatContext);
