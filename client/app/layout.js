"use client";

import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthWrapper from "@/components/AuthWrapper";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

import { CatProvider } from "./context/CategoryContext";
import { PrdProvider } from "./context/ProductContext";
import { ItemProvider } from "./context/ItemContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrdersProvider } from "./context/OrdersContext";
import { NoticeProviders } from "./context/NotificationContext";
import GlobalLoader from "@/components/GlobalLoader";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import BottomNav from "@/components/BottomNav";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }) {
  // ✅ Register Service Worker inside useEffect
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} w-full`}>
        <AlertProvider>
          <AuthWrapper>
            <AuthProvider>
              <NoticeProviders>
                <OrdersProvider>
                  <ItemProvider>
                    <CatProvider>
                      <WishlistProvider>
                        <PrdProvider>
                          <CartProvider>
                            <Navbar />
                            <GlobalLoader />

                            <main className="min-h-screen flex flex-col">
                              {children}
                              <PWAInstallPrompt />
                            </main>

                            <BottomNav />
                            <Footer />
                            <Toaster position="top-right" />
                          </CartProvider>
                        </PrdProvider>
                      </WishlistProvider>
                    </CatProvider>
                  </ItemProvider>
                </OrdersProvider>
              </NoticeProviders>
            </AuthProvider>
          </AuthWrapper>
        </AlertProvider>
      </body>
    </html>
  );
}
