// context/CartContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
    }
  }, []);

  // ✅ Save cart to localStorage when updated
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // ✅ Add to cart with quantity check
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // ✅ Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Update quantity manually
  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // ✅ Calculate total price
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider };

// ✅ Custom Hook
export const useCart = () => useContext(CartContext);
