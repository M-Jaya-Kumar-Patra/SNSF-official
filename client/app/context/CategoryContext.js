// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";

const CatContext = createContext();

const CatProvider = ({ children }) => {
  const [catData, setCatData] = useState();
   useEffect(()=>{
    console.log("category")
  },[])


   useEffect(() => {
      fetchDataFromApi("/api/category/getCategories", false).then((response) => {
        if (!response.error) {
          setCatData(response?.data)
        }
      })
    }, [])
  

  return (
    <CatContext.Provider value={{ catData, setCatData }}>
      {children}
    </CatContext.Provider>
  );
};

// Export both provider and hook
export { CatProvider };

// Custom hook
export const useCat = () => useContext(CatContext);
