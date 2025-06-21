'use client';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Loading() {
  return (
    <Backdrop
      sx={(theme) => ({
        color: '#fff',
        zIndex: theme.zIndex.drawer + 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      })}
      open={true} // always visible
    >
      <div className='w-40 h-20 flex justify-center items-center'>
              <DotLottieReact
            src="https://lottie.host/f0d67ccf-00d6-4753-81f0-45de6e6de551/xon0h7LmyW.lottie"
            loop
            autoplay
            width={10}
            height={10}
          />
      
          </div>
    </Backdrop>
  );
}
