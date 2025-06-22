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
import GlobalLoader from "@/components/GlobalLoader"; // ✅ import loader component

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });
const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
const righteous = Righteous({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "SNSF",
  description: "Steel Furniture Manufacturer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
      </head>
      <body className={`${inter.className} w-full `}>
        <AlertProvider>
          <AuthWrapper>
            <AuthProvider>
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
                          </main>

                          <Footer />
                          <Toaster position="top-right" />
                        </CartProvider>
                      </PrdProvider>
                    </WishlistProvider>
                  </CatProvider>
                </ItemProvider>
              </OrdersProvider>
            </AuthProvider>
          </AuthWrapper>
        </AlertProvider>
      </body>
    </html>
  );
}
