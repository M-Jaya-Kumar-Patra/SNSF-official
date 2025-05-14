import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SessionWrapper from "./components/SessionWrapper";
import { CartProvider } from "./context/CartContext";

import { Inter, Geist, Geist_Mono, Righteous } from "next/font/google";

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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${righteous.className} ${inter.className} ${geistSans.className} ${geistMono.className}  antialiased`}>
        <SessionWrapper>
          <Navbar />
          <CartProvider>      
          <main className=" font-sans min-h-screen flex flex-col">
            <section>{children}</section>
          </main>
          <Footer />
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
  