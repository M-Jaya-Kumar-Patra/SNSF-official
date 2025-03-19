import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import SessionWrapper from "./components/SessionWrapper";


const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });
const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "SNSF",
  description: "Steel Furniture Manufacturer",
};

export default function RootLayout({ children }) {
  return (
    <>
      {/* Ensure proper HTML structure */}
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <SessionWrapper>
          <body className={`${inter.className} ${geistSans.className} ${geistMono.className} antialiased`}>


            {/* Main Content */}
            <main className="min-h-screen flex flex-col">
              <section>{children}</section>
            </main>

            <Footer />
          </body>
        </SessionWrapper>  
      </html>
    </>
  );
}
