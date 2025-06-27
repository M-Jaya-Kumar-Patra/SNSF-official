"use client";
import React from 'react';
import { useAuth } from '@/app/context/AuthContext';

const Page = () => {
   const { isCheckingToken } = useAuth()
      if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;
  return <div></div>;
};

export default Page;
