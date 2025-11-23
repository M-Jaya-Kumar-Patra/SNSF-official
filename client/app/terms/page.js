"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

export default function TermsPage() {
  const {isCheckingToken}=useAuth()

   if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-700 my-12">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6">Terms of Use</h1>
      <section className="text-gray-700 space-y-4">
        <p>
          Welcome to S N Steel Fabrication’s website. By accessing or using this site, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">Use of Content</h2>
        <p>
          All content on this website is for informational purposes only and is owned by S N Steel Fabrication. You may not copy, distribute, or use any materials without our explicit permission.
        </p>
        <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">User Conduct</h2>
        <p>
          You agree not to use this website for any unlawful or prohibited activities and to respect intellectual property rights.
        </p>
        <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">Limitation of Liability</h2>
        <p>
          S N Steel Fabrication is not responsible for any damages arising from the use or inability to use this website or its content.
        </p>
        <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">Changes to Terms</h2>
        <p>
          We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the site means you accept those changes.
        </p>
        <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">Contact Us</h2>
        <p>
          If you have questions about these terms, please contact us at: <a href="mailto:support@snsteelfabrication.com" className="text-blue-600 underline">support@snsteelfabrication.com</a>
        </p>
      </section>
    </main>
  );
}
