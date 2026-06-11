"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "./AuthContext";

const PrdContext = createContext();

const PrdProvider = ({ children }) => {
  const [prdData, setPrdData] = useState();
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const { isLogin } = useAuth();

  const getProductsData = () => {
    setLoading(true);
    fetchDataFromApi("/api/product/gaps")
      .then((response) => {
        if (!response.error) {
          setPrdData(response?.data || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isLogin) getProductsData();
    if (!isLogin) setPrdData([]);
  }, [isLogin]);
  

  return (
    <PrdContext.Provider value={{ prdData, setPrdData, productsData, setProductsData, getProductsData, loading, setLoading }}>
      {children}
    </PrdContext.Provider>
  );
};

// Export both provider and hook
export { PrdProvider };

// Custom hook
export const usePrd = () => useContext(PrdContext);
