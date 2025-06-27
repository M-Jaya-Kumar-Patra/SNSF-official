"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

export default function ReturnPolicyPage() {
  
const { isCheckingToken, isLogin, userData } = useAuth();
if (isCheckingToken) return <div>Loading...</div>;
  return (
    <main className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4 border-red-700 my-12">
      <h1 className="text-4xl font-extrabold text-red-800 mb-4">Return, Exchange & Refund Policy</h1>
      <p className="text-sm text-gray-500 italic mb-8">Customer-first, always. We’re here to help when things go wrong.</p>

      <section className="mb-10 text-gray-700 space-y-4">
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Exchange Policy</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>We do <strong>not accept returns</strong>.</li>
          <li>Exchanges are allowed only in case of:
            <ul className="list-disc list-inside ml-6">
              <li>Manufacturing defects</li>
              <li>Damage during delivery</li>
              <li>Exchange with another product of the <strong>same or higher price range</strong></li>
            </ul>
          </li>
          <li>Exchange requests must be raised within <strong>5 days of delivery</strong>.</li>
          <li>Product must be unused and in its original condition.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Confirmation Process</h2>
        <p className="text-gray-700">
          All exchange or cancellation requests must be confirmed over a <strong>phone call</strong>.  
          Once the manufacturing process has started, <strong>the order cannot be canceled</strong> under any circumstances.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Refund Policy</h2>
        <p className="text-gray-700">
          We do <strong>not offer refunds</strong>. If an exchange is approved, customers may select a different product of equivalent or higher value.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Helpful Reminders</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ">
          <li>Inspect the product at the time of delivery.</li>
          <li>Keep your invoice and proof of purchase for verification.</li>
        </ul>
      </section>

      <div className="text-center text-sm text-gray-500 mt-10">
        If you have any questions, please call us at <strong>+91 9776501230</strong>.
      </div>
    </main>
  );
}
