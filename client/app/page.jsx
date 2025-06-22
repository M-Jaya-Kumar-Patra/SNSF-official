"use client";

import { useEffect, useState } from "react";
import  {useAuth}  from "./context/AuthContext";; // Assuming you moved your Zustand logic here
import Loading from "@/components/Loading";
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

  if (!hydrated || loading) return <Loading/>//persistent loader

  return (
    <>
      <Toaster position="top-right" />
      <section className="flex justify-center"><Slider /></section>
      <section className="flex justify-center"><Shopbycat /></section>
      <section className="flex justify-center"><Bestsellers /></section>
      <section className="flex justify-center"><New /></section>

    </>
  );
}
