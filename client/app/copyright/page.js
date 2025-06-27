"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

export default function CopyrightPage() {
  const { isCheckingToken, isLogin, userData } = useAuth();
  if (isCheckingToken) return <div>Loading...</div>;
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-700 my-12">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6">Copyright Notice</h1>
      <section className="text-gray-700 space-y-4">
        <p>
          © {new Date().getFullYear()} S N Steel Fabrication. All rights reserved.
          The content on this website including text, images, graphics, logos, and code is the property of S N Steel Fabrication and is protected by copyright law.
        </p>
        <p>
          No part of this website may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed in any way without our prior written permission.
        </p>
        <p>
          Unauthorized use of any material from this website may violate copyright laws and could result in legal action.
        </p>
        <p>
          For permissions or inquiries, please contact us at: <a href="mailto:snsteelfabrication010@gmail.com" className="text-blue-600 underline">snsteelfabrication010@gmail.com</a>
        </p>
      </section>
    </main>
  );
}
