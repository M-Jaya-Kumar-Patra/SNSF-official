"use client";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function PrivacyPolicyPage() {
   const { isCheckingToken } = useAuth()
      if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-700 my-12">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 italic mb-8">Last updated: June 24, 2025</p>

      <p className="text-gray-700 mb-6">
        Welcome to <strong>S N Steel Fabrication</strong>. We respect your privacy and
        are committed to protecting your personal information. This Privacy Policy explains how
        we collect, use, and safeguard your data when you use our services.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Personal information:</strong> name, email address, phone number, and address</li>
          <li><strong>Payment information:</strong> details necessary to process your payments securely</li>
          <li><strong>Technical information:</strong> IP address, device information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">2. How We Collect Information</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Registration and contact forms you fill out on our website</li>
          <li>Payment gateways when you make purchases or payments</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Provide and deliver our products and services to you</li>
          <li>Send newsletters and updates about our products and offers (only if you opt in)</li>
          <li>Process payments securely and efficiently</li>
          <li>Improve and enhance our website and services</li>
          <li>Conduct marketing to inform you about promotions and new products</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">4. Sharing Your Information</h2>
        <p className="text-gray-700">
          We <strong>do not share your personal data with third parties</strong>. Your information is used solely by S N Steel Fabrication.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">5. Cookies</h2>
        <p className="text-gray-700">
          We do <strong>not</strong> use cookies or tracking technologies on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">6. Data Security</h2>
        <p className="text-gray-700">
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">7. Your Data Rights</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>Access your personal data we hold</li>
          <li>Request correction or deletion of your data</li>
          <li>Opt-out of receiving marketing communications</li>
        </ul>
        <p className="text-gray-700">
          To exercise these rights, please contact us using the information below.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">8. Changes to This Policy</h2>
        <p className="text-gray-700 mb-8">
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted here with an updated revision date.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">9. Contact Us</h2>
        <address className="not-italic text-gray-700 space-y-1">
          <p><strong>S N Steel Fabrication</strong></p>
          <p>New Burupada, Near Hanuman Temple</p>
          <p>Via - Hinjilicut, Ganjam, Odisha - 761102</p>
          <p>Phone: +91 9776501230</p>
          <p>Email: <a href="mailto:snsteelfabrication010@gmail.com" className="text-blue-600 underline">snsteelfabrication010@gmail.com</a></p>
        </address>
      </section>
    </main>
  );
}
