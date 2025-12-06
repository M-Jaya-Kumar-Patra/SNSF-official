"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { fetchDataFromApi } from "@/utils/api";
import { useEffect, useState } from "react";

const Footer = () => {
  const { setLoading } = useAuth();
  const[ totalVisitors, setTotalVisitors] = useState(0)

  const handleTelClick = () => {
    window.location.href = "tel:+919776501230";
  };

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  useEffect(() => {
  const fetchVisitCount = async () => {
    try {
      const res = await fetchDataFromApi("/api/visit/getVisit", false);
      if (res?.success) {
        setTotalVisitors(res.count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch visit count:", err);
    }
  };

  fetchVisitCount();
}, []);


  return (
    <footer className="bg-black text-white px-6 md:px-16 pt-10 pb-6 font-sans">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">
        {/* Company */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/about" className="hover:text-white">About Us</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
            </li>
            <li>
              <Link href="/copyright" className="hover:text-white">Copyright Notice</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/profile" className="hover:text-white">My Account</Link>
            </li>
            <li className="cursor-pointer hover:text-white" onClick={handleTelClick}>
              Contact Us
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Social Accounts */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Social Accounts</h4>
          <div className="flex gap-5 mb-4">
            <a
              href="https://youtube.com/@snsteelfabrication6716?si=v4pPQmEDtKmacpmN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={getOptimizedCloudinaryUrl("/images/youtube.png")}
                alt="YouTube"
                width={30}
                height={30}
                priority
              />

            </a>
            <a
              href="https://wa.me/919776501230"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={getOptimizedCloudinaryUrl("/images/whatsapp.png")}
                width={30}
                height={30}
                alt="WhatsApp"
              />
            </a>
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Showroom Location</h4>
          <p className="text-gray-400 text-sm mb-3">
            S N Steel Fabrication,<br />
            New Burupada, Near Hanuman Temple,<br />
            Via - Hinjilicut, Ganjam, Odisha - 761102, India
          </p>
          <h5 className="font-semibold text-white">Working Hours</h5>
          <p className="text-gray-400 text-sm">Sun – Sat: 9:00 AM – 8:00 PM</p>
        </div>

        {/* Map */}
        <div className="w-full h-[180px] md:h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2218.4493224998296!2d84.72751407521596!3d19.49520888179757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a22b3adb3fc343d%3A0x40ef673d768faef8!2sS%20N%20Steel%20Fabrication!5e1!3m2!1sen!2sin!4v1750775983485!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="S N Steel Fabrication Location"
          ></iframe>
        </div>
      </div>

     {/* Bottom Footer */}
<footer className="w-full  border-t border-gray-300">
  <div className="   py-4 
                  grid grid-cols-1 sm:grid-cols-3 
                  items-center text-sm text-gray-300 gap-2">

    {/* Left: Copyright */}
    <p className="text-center sm:text-left">
      © {new Date().getFullYear()} S N Steel Fabrication. All rights reserved.
    </p>

    {/* Middle: Credits */}
    <p className="text-center">
      Designed & Developed by <span className="font-bold">Jaya Kumar</span>
    </p>

    {/* Right: Visitor Count */}
    <p className="text-center sm:text-right">
      Total Visitors: 
      <span className="font-bold "> {totalVisitors}</span>
    </p>

  </div>
</footer>


    </footer>
  );
};

export default Footer;
