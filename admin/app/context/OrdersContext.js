// context/OrdersContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const alert = useAlert();
  const { isLogin, adminData } = useAuth();

  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      getOrders(); // Run only on client
    }
  }, []);

  const addToOrders = (product, userId, quantity = 1) => {
    if (!userId) {
      alert.alertBox({ type: "error", msg: "Please login first" });
      return;
    }

    const data = {
      productTitle: product?.name,
      image: product?.images?.[0],
      rating: product?.rating,
      price: product?.price,
      quantity,
      subTotal: parseInt(product?.price * quantity),
      productId: product?._id,
      countInStock: product?.countInStock,
      userId,
      brand: product?.brand,
    };

    postData("/api/order/create", data, true).then((res) => {
      if (!res.error) {
        alert.alertBox({ type: "success", msg: res?.message || "Order placed" });
        getOrders(); // Refresh orders
      } else {
        alert.alertBox({ type: "error", msg: res?.message || "Order failed" });
      }
    });
  };

  const getOrders = () => {
    let adminId;

    if (typeof window !== "undefined") {
      adminId = localStorage.getItem("adminId");
    }

    if (!adminId) {
      console.warn("No adminId found in localStorage");
      return;
    }

    fetchDataFromApi("/api/order/get").then((res) => {
      if (!res.error) {
        setOrdersData(res?.data || []);
        console.log("Fetched orders:", res?.data);
      } else {
        console.error("Failed to fetch orders:", res.message);
      }
    });
  };

  return (
    <OrdersContext.Provider
      value={{
        ordersData,
        addToOrders,
        getOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export { OrdersProvider };
export const useOrders = () => useContext(OrdersContext);
