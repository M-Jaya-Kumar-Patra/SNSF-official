"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [showMap, setShowMap] = useState(false);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  return (
    <footer className="w-full bg-slate-900">
      <div className="max-w-[1600px] mx-auto  text-white px-6  pt-10 pb-6 font-sans">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">
          {/* Company */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Company</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="hover:text-white">
                  Copyright Notice
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Support</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/profile" className="hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <a href="tel:+919776501230" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Accounts */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Social Accounts</h2>
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
              <a
                href="https://www.instagram.com/snsteelfabrication"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={getOptimizedCloudinaryUrl("/images/instagram.png")}
                  width={30}
                  height={30}
                  alt="Instagram"
                />
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Showroom Location</h2>
            <p className="text-gray-400 text-sm mb-3">
              S N Steel Fabrication,
              <br />
              New Burupada, Near Hanuman Temple,
              <br />
              Via - Hinjilicut, Ganjam, Odisha - 761102, India
            </p>
            <h3 className="font-semibold text-white">Working Hours</h3>
            <p className="text-gray-400 text-sm">
              Sun – Sat: 9:00 AM – 8:00 PM
            </p>
          </div>

          {/* Map */}
          <div className="w-full h-[180px] md:h-full">
            {showMap ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2218.4493224998296!2d84.72751407521596!3d19.49520888179757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a22b3adb3fc343d%3A0x40ef673d768faef8!2sS%20N%20Steel%20Fabrication!5e1!3m2!1sen!2sin!4v1750775983485!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="S N Steel Fabrication Location"
              />
            ) : (
              <button
                type="button"
                aria-label="Load showroom map"
                onClick={() => setShowMap(true)}
                className="w-full h-full min-h-[180px] rounded-md border border-slate-600 bg-slate-800 text-sm font-semibold text-white hover:bg-slate-700 transition"
              >
                View map
              </button>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="w-full  border-t border-gray-400">
          <div
            className="   py-4 
                  grid grid-cols-1 sm:grid-cols-2 
                  items-center text-sm text-gray-400 gap-2"
          >
            {/* Left: Copyright */}
            <p
              className="text-center
     sm:text-left"
            >
              © {new Date().getFullYear()} S N Steel Fabrication. All rights
              reserved.
            </p>

            {/* Middle: Credits */}
            <a
              href="https://jaya-portfolio-five.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-center sm:text-right">
                Designed & Developed by{" "}
                <span className="font-bold text-nowrap">Jaya Kumar</span>
              </p>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
