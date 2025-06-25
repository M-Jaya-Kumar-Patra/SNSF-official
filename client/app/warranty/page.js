"use client";

import React from "react";

export default function WarrantyPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-700 my-12">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6">Warranty Policy</h1>

      <section className="mb-8 text-gray-700 space-y-4">
        <p>
          At <strong>S N Steel Fabrication</strong>, we stand behind the quality and durability of our stainless steel furniture. To ensure your confidence in our products, we provide the following warranty coverage on our steel frames.
        </p>

        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Warranty Coverage</h2>
        <p>
  We provide warranty coverage <strong>exclusively for the stainless steel structure</strong> of our furniture, ensuring long-lasting strength and reliability. This includes protection against manufacturing defects such as welding failures, frame bending, or rust that may occur under normal usage conditions.
</p>
<p>
  We use two high-quality grades of stainless steel in our products:
</p>
<ul className="list-disc list-inside mb-4">
  <li><strong>202 Grade Stainless Steel:</strong> 5 years warranty</li>
  <li><strong>304 Grade Stainless Steel:</strong> 15 years warranty</li>
</ul>


        <h2 className="text-2xl font-semibold text-blue-700 mb-3">What Is <em>Not</em> Covered</h2>
        <p>
  Please note that the warranty <strong>does not cover</strong> fabrics, foam cushions, or other non-steel parts of the furniture. These components may naturally wear out or become damaged over time with regular use, especially if handled roughly or without proper care.
</p>

        <p>
          Additionally, the warranty will be voided if rust or damage occurs due to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Negligent or careless use by the customer</li>
          <li>Exposure to harsh chemicals, acids, or liquids</li>
          <li>Physical damage or accidents</li>
          <li>Improper maintenance or modifications</li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Maintenance and Care</h2>
        <p>
          To keep your furniture in the best condition and extend its life, we recommend the following simple maintenance tips:
        </p>
        <ul className="list-disc list-inside mb-4">
         <li>Clean the steel frames every 3 to 4 months by gently wiping with a dry, soft cloth</li>
          <li>Avoid using any acids, harsh chemicals, or abrasive liquids on the frames</li>
          <li>Keep the furniture in a dry environment and avoid prolonged exposure to moisture</li>
        </ul>
        <p>
          Proper care will help prevent rust and damage, ensuring your furniture stays strong and beautiful for years.
        </p>

        <h2 className="text-2xl font-semibold text-blue-700 mb-3">How to Claim Warranty</h2>
        <p>
          If you experience any manufacturing defect covered under this warranty, please contact us with:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Details of the issue</li>
          <li>Proof of purchase or invoice</li>
          <li>Photos or videos showing the defect</li>
        </ul>
        <p>
          We will inspect the issue and guide you through the repair or replacement process as per our warranty policy.
        </p>

        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Contact Us</h2>
        <p>
          For warranty claims or questions, please reach out to us:
        </p>
        <address className="not-italic text-gray-700 space-y-1">
          <p><strong>S N Steel Fabrication</strong></p>
          <p>New Burupada, Near Hanuman Temple</p>
          <p>Via - Hinjilicut, Ganjam, Odisha - 761102</p>
          <p>Phone: +91 9776501230</p>
          <p>Email: <a href="mailto:snsteelfabrication010@gmail.com" className="text-blue-600 underline">snsteelfabrication010@gmail.com</a></p>
        </address>
      </section>

      <div className="text-center mt-12 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} S N Steel Fabrication. All rights reserved.
      </div>
    </main>
  );
}
