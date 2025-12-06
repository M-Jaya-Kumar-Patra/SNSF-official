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
import { postData } from "@/utils/api";
import AllinOne from "@/components/AllinOne";

export default function Home() {
  const { isCheckingToken } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("last-snsf-visit-date");

    // Count only once per day
    if (lastVisit !== today) {
      postData("/api/visit/new", {}, false);
      localStorage.setItem("last-snsf-visit-date", today);
    }
  }, []);

  if (isCheckingToken) return <Loading />;

  return (
    <>
      <Toaster position="top-right" />
      <section className="flex justify-center"><Slider /></section>
      <section className="flex justify-center"><Shopbycat /></section>
      <section className="flex justify-center"><Bestsellers /></section>
      <section className="flex justify-center"><AllinOne /></section>
      <section className="flex justify-center"><New /></section>
    </>
  );
}
