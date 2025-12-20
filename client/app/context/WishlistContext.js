// context/WishlistContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";
import { fetchDataFromApi, postData, deleteItem } from "@/utils/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const alert = useAlert();
  const [wishlistData, setWishlistData] = useState([]);
  const { isLogin, userData, setUserData } = useAuth();

 

  useEffect(() => {
    getWishlistItems();
  }, []);

  const addToWishlist = (e, prd, userId) => {
    e.preventDefault();
    if (!isLogin) {
      alert.alertBox({ type: "error", msg: "Please login first" });
      return;
    }

    const data = {
      productTitle: prd?.name,
      image: prd?.images[0],
      productId: prd?._id,
      userId: userId,
      brand: prd?.brand || "Unknown Brand",
    };

    postData(`/api/wishlist/add`, data, true).then((res) => {
      if (!res.error) {
        alert.alertBox({ type: "success", msg: res?.message });

        setUserData((prev) => ({
          ...prev,
          wishlist: [...(prev?.wishlist || []), String(prd._id)],
        }));

        getWishlistItems();
      } else {
        alert.alertBox({ type: "error", msg: res?.message });
      }
    });
  };

  const getWishlistItems = () => {
    fetchDataFromApi(`/api/wishlist/get`).then((res) => {
      if (!res.error) {
        setWishlistData(res?.data);
      }
    });
  };

  const removeFromWishlist = (e, _id, productId) => {
    e.preventDefault();
    deleteItem(`/api/wishlist/delete-wishlist-item`, { _id, productId }).then(
      (res) => {
        if (!res.error) {
          setUserData((prev) => ({
            ...prev,
            wishlist: prev.wishlist.filter(
              (item) => item !== String(productId)
            ),
          }));
          alert.alertBox({ type: "success", msg: res?.message });

          getWishlistItems();
        } else {
          alert.alertBox({ type: "error", msg: res?.message });
        }
      }
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        addToWishlist,
        getWishlistItems,
        removeFromWishlist,
        wishlistData,
        setWishlistData,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export { WishlistProvider };

export const useWishlist = () => useContext(WishlistContext);
