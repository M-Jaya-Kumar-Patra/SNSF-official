'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <div className="max-w-md w-full mb-6">
        <DotLottieReact
          src="/animations/404.json" 
          loop
          autoplay
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-md text-gray-500 mt-2">Sorry, the page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
