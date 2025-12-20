"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { useAlert } from "./AlertContext";
import { useAuth } from "./AuthContext";

const NoticeContext = createContext();

const NoticeProviders = ({ children }) => {
  const alert = useAlert();
  const [notices, setNotices] = useState([]);
  const { isLogin, setIsCheckingToken } = useAuth();

  useEffect(() => {
    if (isLogin) {
      setIsCheckingToken(false);
      getNotifications();
    }
  }, [isLogin]);

  const getNotifications = async () => {
    try {
      const res = await fetchDataFromApi(`/api/notice/get`);
      if (!res.error) {
        setNotices(res.data);
      } else {
        console.log(res.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.log("Error fetching notifications");
      console.error(error);
    }
  };

  const markAllUnreadAsRead = async () => {
    try {
      await fetch("/api/notice/markUnreadRead", {
        method: "PUT",
      });

      setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  return (
    <NoticeContext.Provider
      value={{ notices, getNotifications, markAllUnreadAsRead }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export { NoticeProviders };
export const useNotice = () => useContext(NoticeContext);
