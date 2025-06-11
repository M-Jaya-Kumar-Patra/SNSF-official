// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";

const PrdContext = createContext();

const PrdProvider = ({ children }) => {
  const [prdData, setPrdData] = useState();

   useEffect(() => {
      fetchDataFromApi("/api/product/gaps", false).then((response) => {
        if (!response.error) {
          setPrdData(response?.data)
        }
      })
    }, [])
  

  return (
    <PrdContext.Provider value={{ prdData, setPrdData }}>
      {children}
    </PrdContext.Provider>
  );
};

// Export both provider and hook
export { PrdProvider };

// Custom hook
export const usePrd = () => useContext(PrdContext);
