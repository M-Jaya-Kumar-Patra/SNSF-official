// app/layout.js
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import SessionGuard from "@/components/SessionGuard";
import { CatProvider } from "./context/CategoryContext";
import { Inter } from "next/font/google";
import { PrdProvider } from "./context/ProductContext";
import { OrdersProvider } from "./context/OrdersContext";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

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
      <body className={inter.className}>
          <SessionGuard>
            <AuthProvider>
              <PrdProvider>
                <CatProvider>
                  <OrdersProvider>
                    <AlertProvider>
                  <CartProvider>
                    <Navbar />
                    <main className="min-h-screen flex flex-col">
                      <Toaster position="top-right" reverseOrder={false} />
                      {children}
                    </main>
                  </CartProvider>
                </AlertProvider>
                  </OrdersProvider>
              </CatProvider>
              </PrdProvider>
            </AuthProvider>
          </SessionGuard>
      </body>
    </html>
  );
}
