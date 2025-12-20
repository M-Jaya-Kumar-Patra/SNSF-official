"use client";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import { trackVisitor } from "@/lib/tracking";
import { useEffect } from "react";

const Page = () => {
  const { isCheckingToken } = useAuth();
  useEffect(() => {
    trackVisitor("payments");
  }, []);
  if (isCheckingToken)
    return <div className="text-center mt-10">Checking session...</div>;
  return <div></div>;
};

export default Page;
