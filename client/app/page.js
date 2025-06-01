"use client";

import { useEffect, useState } from "react";
import  {useAuth}  from "./context/AuthContext";; // Assuming you moved your Zustand logic here
import PersistentLoader from "./loading";
import Slider from "@/components/Slider";
import Shopbycat from "@/components/Shopbycat";
import Bestsellers from "@/components/Bestsellers";
import New from "@/components/New";
import Link from "next/link";
import { Toaster } from "react-hot-toast";


export default function Home() {
  const { userData, isLogin, logout, loading } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || loading) return <PersistentLoader/>//persistent loader

  return (
    <>
      <Toaster position="top-right" />
      <section className="flex justify-center"><Slider /></section>
      <section className="flex justify-center"><Shopbycat /></section>
      <section className="flex justify-center"><Bestsellers /></section>
      <section className="flex justify-center"><New /></section>

      {isLogin && userData ? (
        <div className="text-center my-4">
          <p>Welcome, {userData.name || "User"}</p>
          <p>Email: {userData.email}</p>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center my-4">
          <p>You are not signed in.</p>
          <Link href="/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Login
            </button>
          </Link>
        </div>
      )}

      <div className="text-center my-4">
        <Link href="/account/profile">
          <button className="bg-gray-800 text-white px-4 py-2 rounded">
            Go to Profile
          </button>
        </Link>
      </div>
    </>
  );
}
