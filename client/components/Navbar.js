
"use client";
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Righteous } from "next/font/google";




import CallIcon from '@mui/icons-material/Call';


import Badge from '@mui/material/Badge';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


import { IoCartOutline } from "react-icons/io5";



const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const righteous = Righteous({ subsets: ["latin"], weight: "400" });

  const Navbar = ({ fontClass, cartItems = [] }) => {
  const { data: session } = useSession();
  const router = useRouter(); // 

  return (
    <nav>
      <div className="px-8 py-2 flex items-center justify-between bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30]">
        {/* Logo Section */}
        <div className="flex gap-0 items-center">
          <Image
            className="w-16 h-16 rounded-full"
            src="/images/logo.png"
            alt="S N Steel Fabrication Logo"
            width={64}
            height={64}
            priority={true}
          />
          <img src="images/snsf-text.png" alt="" className="h-[64px] ml-0" />

          {/* <h1 className={`${righteous.className} text-4xl text-white`}>
      This should be in Righteous
    </h1> */}

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
          <CallIcon  className="text-4xl"/>

          <Image
            className={`w-8 h-8 cursor-pointer rounded-full ${session?.user?.image ? "" : "invert"
              }`}
            src={session?.user?.image || "/images/account.png"}
            alt="User Account"
            width={32}
            height={32}
            onClick={() => router.push(session ? "/profile" : "/login")}
          />


         <IconButton aria-label="cart" onClick={() => router.push("/cart")}>
  <StyledBadge badgeContent={cartItems.length} showZero color="secondary">
    <IoCartOutline className="text-4xl" />
  </StyledBadge>
</IconButton>
        </div>

        {/* <ul clnassName="flex items-center gap-3  w-full">
          <li><CallIcon /></li>
          <li>
            <Image
              className={`w-8 h-8 cursor-pointer rounded-full ${session?.user?.image ? "" : "invert"
                }`}
              src={session?.user?.image || "/images/account.png"}
              alt="User Account"
              width={32}
              height={32}
              onClick={() => router.push(session ? "/profile" : "/login")}
            />
          </li>
          <li className="">
            <IconButton aria-label="cart"  onClick={() => router.push("/cart")}>
              <StyledBadge badgeContent={2} color="secondary"  >
                <IoCartOutline  className="text-3xl"/>
              </StyledBadge>
            </IconButton>

          </li>
        </ul> */}



      </div>
      <div className="bg-white border border-b-gray-300 mb-1 h-[30px] w-full font-semibold text-[#131e30] font-sans p-0 flex items-center justify-evenly">
        {/* <div className="  hover:border-red-600 hover:border-b-2 h-full p-1">
          Living Room
        </div>
        <div className="  hover:border-red-600 hover:border-b-2 h-full p-1">
          Bedroom
        </div>
        <div className="  hover:border-red-600 hover:border-b-2 h-full p-1">
          Dining Room
        </div>
        <div className="  hover:border-red-600 hover:border-b-2 h-full p-1">
          Office Furniture
        </div> */}

        <div className="group relative hover:border-0 hover:border-b-2 hover:border-[#131e30] h-full p-1 pt-0">
          <span className="cursor-pointer ">Living Room</span>
          <div className="absolute w-auto h-auto bg-white border border-gray-200  hidden group-hover:block text-gray-600 mt-[5px] top-fulll left-0 ">
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
          </div>
        </div>

        <div className="group relative hover:border-0 hover:border-b-2 hover:border-[#131e30] h-full p-1 pt-0">
          <span className="cursor-pointer ">Bedroom</span>
          <div className="absolute w-auto h-auto bg-white border border-gray-200  hidden group-hover:block text-gray-600 mt-[5px] top-fulll left-0 ">
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
          </div>
        </div>

        <div className="group relative hover:border-0 hover:border-b-2 hover:border-[#131e30] h-full p-1 pt-0">
          <span className="cursor-pointer ">Dining Room</span>
          <div className="absolute w-auto h-auto bg-white border border-gray-200  hidden group-hover:block text-gray-600 mt-[5px] top-fulll left-0 ">
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
          </div>
        </div>

        <div className="group relative hover:border-0 hover:border-b-2 hover:border-[#131e30] h-full p-1 pt-0">
          <span className="cursor-pointer ">Office furniture</span>
          <div className="absolute w-auto h-auto bg-white border border-gray-200  hidden group-hover:block text-gray-600 mt-[5px] top-fulll left-0 ">
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
          </div>
        </div>

        <div className="group relative hover:border-0 hover:border-b-2 hover:border-[#131e30] h-full p-1 pt-0">
          <span className="cursor-pointer ">Storage</span>
          <div className="absolute w-auto h-auto bg-white border border-gray-200  hidden group-hover:block text-gray-600 mt-[5px] top-fulll left-0 ">
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
            <Link href="#" className="block px-4 py-2 hover:text-black">Sofas</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

