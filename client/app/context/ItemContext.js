// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ItemContext = createContext();

const ItemProvider = ({ children }) => {
  const [item, setItem] = useState();



  return (
    <ItemContext.Provider value={{ item, setItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export { ItemProvider };

export const useItem = () => useContext(ItemContext);
