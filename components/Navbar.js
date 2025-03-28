"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // ✅ Correct import
import { Righteous } from "next/font/google";

const righteous = Righteous({ subsets: ["latin"], weight: "400" }); // ✅ Correct import


const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter(); // ✅ Moved inside the component

  return (
    <nav>
      <div className="px-8 py-2 flex items-center justify-between bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30]">
        {/* Logo Section */}
        <div className="flex gap-2 items-center">
          <Image
            className="w-16 h-16 rounded-full"
            src="/images/logo.png"
            alt="S N Steel Fabrication Logo"
            width={64}
            height={64}
            priority={true}
          />
          <div className={`text-3xl font-bold bg-gradient-to-b from-[#adc6d7] via-[#597794] to-[#a3bfd2] bg-clip-text text-transparent drop-shadow-xs w-40 ${righteous.className}`}>
            <h1>S N Steel Fabrication</h1>
          </div>

        </div>

        {/* Search Box */}
        <div className="Search w-[30vw] border border-gray-500 h-[35px] px-1 flex items-center active:backdrop-blur-3xl rounded-full">
          <Image
            className="w-6 h-5 mr-1 invert"
            src="/images/search.png"
            alt="Search Icon"
            width={20}
            height={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none font-sans"
            aria-label="Search for products"
          />
        </div>

        {/* Contact, Account, and Cart */}
        <div className="contact-account-cart w-[15%] flex justify-between items-center gap-3">
          <Image
            className="w-8 h-8 invert"
            src="/images/call.png"
            alt="Contact Us"
            width={32}
            height={32}
          />

          <Image
            className={`w-8 h-8 cursor-pointer rounded-full ${session?.user?.image ? "" : "invert"
              }`}
            src={session?.user?.image || "/images/account.png"}
            alt="User Account"
            width={32}
            height={32}
            onClick={() => router.push(session ? "/profile" : "/login")}
          />


          <Image
            className="w-8 h-8"
            src="/images/cart.png"
            alt="Shopping Cart"
            width={32}
            height={32}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
