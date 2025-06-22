    'use client';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  return (
    <Backdrop
      sx={(theme) => ({
        color: '#fff',
        zIndex: theme.zIndex.drawer + 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(3px)', // subtle blur
      })}
      open={true}
    >
      <div className="flex flex-col items-center justify-center">
        {/* <div className="w-32 h-32 md:w-40 md:h-40 p-4 rounded-full shadow-lg bg-white/20 backdrop-blur-md flex items-center justify-center"> */}
          <DotLottieReact
            src="https://lottie.host/f0d67ccf-00d6-4753-81f0-45de6e6de551/xon0h7LmyW.lottie"
            loop
            autoplay
          />
        {/* </div> */}
        <p className="mt-4 text-white font-medium text-sm tracking-wide animate-pulse">Loading, please wait...</p>
      </div>
    </Backdrop>
  );
}
