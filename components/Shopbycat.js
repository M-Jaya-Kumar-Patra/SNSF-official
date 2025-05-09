"use client"

import React from 'react'
import { Josefin_Sans } from 'next/font/google'


const joSan = Josefin_Sans({ subsets: ['latin'], weight: '400' })

const Shopbycat = () => {
  return (
    <div className="mt-5 flex flex-col items-center bg-slate-100 w-full pb-10">
      <h1 className={`text-3xl font-bold text-black mt-10 mb-14 ${joSan.className}`}>Shop by category</h1>

      {/* Scrollable Image Container */}
      <div className="w-[500px]  flex justify-between gap-3" >

        <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide7.PNG" className='rounded-full ' alt="" />
        </a>
        <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide3.PNG" className='rounded-full ' alt="" />
        </a>
        <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide5.PNG" className='rounded-full ' alt="" />
        </a>
        <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide6.PNG" className='rounded-full ' alt="" />
        </a>
      </div>
      <div className="mt-7 w-[500px]  flex justify-between gap-3" >
      <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide4.PNG" className='rounded-full ' alt="" />
        </a>
        <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide1.PNG" className='rounded-full ' alt="" />
        </a>
        <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide2.PNG" className='rounded-full ' alt="" />
        </a>
        <a className='w-[100px] h-[100px] bg-white  rounded-full p-2  shadow-gray-300 shadow-md' >
          <img src="images\chair\Slide8.PNG" className='rounded-full ' alt="" />
        </a>
      </div>
        
      
    </div>
  )
}

export default Shopbycat
