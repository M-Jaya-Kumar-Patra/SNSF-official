// context/WishlistContext.js
"use client";
import { Club } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";
import { fetchDataFromApi, postData, deleteItem  } from "@/utils/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const alert = useAlert()
  const [wishlistData, setWishlistData] = useState([])
  const {isLogin, userData, setUserData} = useAuth()

  // useEffect(() => {
  //   const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  //   setWishlistItems(storedWishlist);
  // }, []);

  // // Sync to localStorage when wishlist changes
  // useEffect(() => {
  //   localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  // }, [wishlistItems]);

   useEffect(()=>{
    console.log("Wishlist")
  },[])



  useEffect(() => {
    getWishlistItems();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ", )
  }, []); // Only once on component mount





  const addToWishlist = (prd, userId) => {
  if (!userId) {
    alert.alertBox({ type: "error", msg: "Please login first" });
    return;
  }

  const data = {
    productTitle: prd?.name,
    image: prd?.images[0],
    price: prd?.price,
    productId: prd?._id,
    countInStock: prd?.countInStock,
    userId: userId,
    brand: prd?.brand
  };

  postData(`/api/wishlist/add`, data, true).then((res) => {
    if (!res.error) {
      alert.alertBox({ type: "success", msg: res?.message });

      // ✅ Update wishlist locally
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
        
        setWishlistData(res?.data)
        console.log("--------------------------------------", res?.data)
      }
    })

  }

const removeFromWishlist = (e, _id, productId) => {
    e.preventDefault()
  deleteItem(`/api/wishlist/delete-wishlist-item`, { _id, productId }).then((res) => {
    if (!res.error) {
        
        // ✅ Update wishlist locally
        setUserData((prev) => ({
            ...prev,
            wishlist: prev.wishlist.filter((item) => item !== String(productId)),
        }));
        alert.alertBox({ type: "success", msg: res?.message });

      getWishlistItems();
    } else {
      alert.alertBox({ type: "error", msg: res?.message });
    }
  });
};



  return (
    <WishlistContext.Provider value={{  addToWishlist, getWishlistItems, removeFromWishlist, wishlistData, setWishlistData }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Export both provider and hook
export { WishlistProvider };

// Custom hook
export const useWishlist = () => useContext(WishlistContext);
