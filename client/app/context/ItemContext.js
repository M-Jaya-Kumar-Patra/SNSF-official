// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ItemContext = createContext();

const ItemProvider = ({ children }) => {
  
  const [item, setItem] = useState();

//    useEffect(() => {
//       fetchDataFromApi("/api/product/", false).then((response) => {
//         if (!response.error) {
//           setItem(response?.data)
//         }
//       })
//     }, [])
  

  return (
    <ItemContext.Provider value={{item, setItem }}>
      {children}
    </ItemContext.Provider>
  );
};

// Export both provider and hook
export { ItemProvider };

// Custom hook
export const useItem = () => useContext(ItemContext);
