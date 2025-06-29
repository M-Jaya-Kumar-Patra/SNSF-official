"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Loading from "@/components/Loading";
import Slider from "@/components/Slider";
import Shopbycat from "@/components/Shopbycat";
import Bestsellers from "@/components/Bestsellers";
import New from "@/components/New";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const { isCheckingToken } = useAuth();

  useEffect(()=>{
    window.scrollTo(0, 0)
  })

  if (isCheckingToken) return <Loading />; // or your preferred loader

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
