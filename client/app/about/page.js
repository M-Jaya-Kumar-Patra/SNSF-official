"use client";

import React from "react";

export default function AboutUsPage() {
  return (
    <main className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-700 my-12">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-4">About Us</h1>
      <p className="text-sm text-gray-500 italic mb-8"> Strength You Can Trust. Style You Can See.</p>

      <section className="mb-10 text-gray-700 space-y-4">
        <p>
          Welcome to <strong>S N Steel Fabrication</strong> — your reliable destination for durable and well-crafted stainless steel furniture. Located in New Burupada, Hinjilicut, Odisha, we design and manufacture steel solutions that meet everyday needs with practicality, simplicity, and strength.
        </p>

        <p>
          We began as a humble local workshop and have grown steadily by focusing on quality work, fair pricing, and genuine customer care. Whether it’s a single household order or a bulk requirement, we approach every project with attention to detail and commitment to service.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Our Story</h2>
        <p className="text-gray-700">
          Our journey started with a clear goal — to provide strong and long-lasting steel furniture tailored to our customers’ needs. We started small, focusing on beds and almirahs, and gradually expanded to include dining tables, sofa sets, office furniture, and custom fabrication projects.
        </p>
        <p className="mt-3 text-gray-700">
          Today, we continue to serve with the same honesty and work ethic, making quality furniture that supports homes and businesses across the region.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Stainless steel beds, almirahs, chairs, dining tables, and sofa sets</li>
          <li>Custom fabrication services for residential and commercial projects</li>
          <li>Polished SS finish — clean, long-lasting, and easy to maintain</li>
          <li>Budget-friendly pricing without compromising on strength</li>
          <li>Bulk solutions for hostels, offices, institutions, and businesses</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Why Choose Us</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Solid Craftsmanship:</strong> We focus on strong joints, precise cutting, and polished finishes.</li>
          <li><strong>Customization:</strong> We adapt designs to your measurements, layout, and purpose.</li>
          <li><strong>Reliable Service:</strong> Clear communication and timely delivery.</li>
          <li><strong>Fair Pricing:</strong> Competitive rates with clear value for every rupee.</li>
          <li><strong>Locally Made:</strong> Proudly manufactured in Odisha by skilled hands.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Our Vision</h2>
        <p className="text-gray-700">
          We aim to be a go-to name in steel furniture and fabrication across Odisha and beyond — trusted for strength, practicality, and long-term value.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Our Commitment</h2>
        <p className="text-gray-700">
          Every item that leaves our workshop reflects our commitment to solid build quality and honest work. Whether it’s a single piece or a bulk requirement, we take pride in delivering furniture you can rely on.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Visit Us or Get in Touch</h2>
        <p className="text-gray-700 mb-3">
          Looking for sturdy furniture or a fabrication partner for your next project? We're ready to help.
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
