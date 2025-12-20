// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";

const PrdContext = createContext();

const PrdProvider = ({ children }) => {
  const [prdData, setPrdData] = useState([]);

  const [productsData, setProductsData] = useState([]);

  const [showLarge, setShowLarge] = useState(null);

  const getProductsData = () => {
    if ((prdData?.length ?? 0) > 0 || (productsData?.length ?? 0) > 0) return;

    fetchDataFromApi("/api/product/gaps", false).then((response) => {
      if (!response.error) {
        setPrdData(response?.data);
        setProductsData(response?.data);
      }
    });
  };

  useEffect(() => {
    getProductsData();
  }, []);

  return (
    <PrdContext.Provider
      value={{
        prdData,
        setPrdData,
        productsData,
        setProductsData,
        getProductsData,
        showLarge,
        setShowLarge,
      }}
    >
      {children}
    </PrdContext.Provider>
  );
};

export { PrdProvider };

export const usePrd = () => useContext(PrdContext);
