'use client';

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        backgroundColor: '#ffffff',
      }}
      open={true}
    >
      <div className="flex flex-col items-center justify-center animate-fade-in text-center">
        <div className="w-40 h-40 p-0">
          <DotLottieReact
            src="https://lottie.host/f0d67ccf-00d6-4753-81f0-45de6e6de551/xon0h7LmyW.lottie"
            autoplay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <p className="text-gray-600 text-base font-medium tracking-wide animate-pulse">
          Just a moment...
        </p>
      </div>
    </Backdrop>
  );
}
