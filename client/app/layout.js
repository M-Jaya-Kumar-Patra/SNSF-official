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
import BottomNav from "@/components/BottomNav";

import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // ✅ Register Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  // ✅ Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SNSF" />
      </head>

      <body className={`${inter.className} w-full`}>
        {showInstallBtn && (
          <button
            onClick={async () => {
              if (!deferredPrompt) return;

              deferredPrompt.prompt();
              const choiceResult = await deferredPrompt.userChoice;
              console.log("User choice:", choiceResult.outcome);

              if (choiceResult.outcome === "accepted") {
                console.log("✅ App installed");
              } else {
                console.log("❌ App install dismissed");
              }

              setDeferredPrompt(null);
              setShowInstallBtn(false);
            }}
            className="fixed bottom-14 right-5 bg-primary-gradient text-white px-4 py-2 rounded-md shadow-lg z-50"
          >
            Install SNSF App
          </button>
        )}

        <AuthProvider>
          <AuthWrapper>
            <AlertProvider>
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
            </AlertProvider>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
