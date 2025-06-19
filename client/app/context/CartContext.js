// context/CartContext.js
"use client";
import { Club } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const alert = useAlert()
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([])
  const { isLogin } = useAuth()
  const [buyNowItem, setBuyNowItem] = useState([]);



  useEffect(() => {
    getCartItems();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ")
  }, []); // Only once on component mount





  const addToCart = (prd, userId, quantity) => {
    // setCartItems((prev) => [...prev, product]);
    console.log("efrtrtythg                  ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddhgh" , prd, userId, quantity)
    
    if (userId === undefined || userId === null) {
      alert.alertBox({ type: "error", msg: "Please login first" })
      return false
    }
    
    
    const data = {
      productTitle: prd?.name,
      image: prd?.images[0],
      rating: prd?.rating,
      price: prd?.price,
      quantity: quantity,
      subTotal: parseInt(prd?.price * quantity),
      productId: prd?._id,
      countInStock: prd?.countInStock,
      userId: userId,
      brand: prd?.brand
    }
    
    postData(`/api/cart/add`, data, true).then((res) => {
      console.log(prd, userId, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
      if (!res.error) {
        alert.alertBox({ type: "success", msg: res?.message });
        getCartItems();
      } else {
        alert.alertBox({ type: "error", msg: res?.message });

      }
    })
  };


  const getCartItems = () => {
  fetchDataFromApi(`/api/cart/get`).then((res) => {
    if (!res.error) {
      setCartData(res?.data);

      // ✅ Extract product IDs for easy checks like "Go to cart"
      const ids = res?.data?.map((item) => item.productId);
      setCartItems(ids || []);

      console.log("--------------------------------------", res?.data);
    }
  });
};


  return (
    <CartContext.Provider value={{ cartItems, addToCart, getCartItems, cartData, buyNowItem, setBuyNowItem }}>
      {children}
    </CartContext.Provider>
  );
};

// Export both provider and hook
export { CartProvider };

// Custom hook
export const useCart = () => useContext(CartContext);
