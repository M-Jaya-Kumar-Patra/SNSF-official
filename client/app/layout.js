import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthWrapper from "@/components/AuthWrapper";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ remove hook
import { Toaster } from "react-hot-toast";
import { Inter, Geist, Geist_Mono, Righteous } from "next/font/google";

import { CatProvider } from "./context/CategoryContext";
import { PrdProvider } from "./context/ProductContext";
import { ItemProvider } from "./context/ItemContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrdersProvider } from "./context/OrdersContext";
import { NoticeProviders } from "./context/NotificationContext";
import GlobalLoader from "@/components/GlobalLoader"; // ✅ import loader component
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });
const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
const righteous = Righteous({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "SNSF",
  description: "Steel Furniture Manufacturer",
};

export default function RootLayout({ children }) {
  if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("SW Registered"))
      .catch(err => console.error("SW Failed", err));
  });
}

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} w-full `}>
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

                            {/* ✅ Global loader (client-only) */}
                            <GlobalLoader />

                            <main className="min-h-screen flex flex-col">
                              {children}
                              <PWAInstallPrompt />
                            </main>

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
