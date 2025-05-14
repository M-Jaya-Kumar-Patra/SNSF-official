"use client"
import React from 'react';
import { Josefin_Sans } from 'next/font/google';

const joSan = Josefin_Sans({ subsets: ['latin'], weight: '400' })

const Bestsellers = () => {
  return ( 
    <div className="flex flex-col items-center mt-5  w-full pb-10">
      <h1 className={`text-3xl font-bold text-black mt-10 mb-14  ${joSan.className} `}>Best sellers</h1>
 
      {/* Scrollable Image Container */}
      <div className="w-[800px]  flex justify-between gap-3">
        <a href="/product" className='w-[250px] border border-slate-200 shadow-sm gap-2  py-3   pb-2 pt-1 flex flex-col items-center '>
            <img src="images/chair/Slide1.png" alt="" />
            <button className='w-28  justify-between h-8   text-white font-semibold bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] rounded-md' >
                Shop now
            </button>
        </a>
        <a href="#" className='w-[250px] border border-slate-200 shadow-sm gap-2  py-3  pt-1 flex flex-col items-center '>
            <img src="images/chair/Slide1.png" alt="" />
            <button className='w-28  justify-between h-8   text-white font-semibold bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] rounded-md' >
                Shop now
            </button>
        </a>
        <a href="#" className='w-[250px] border border-slate-200 shadow-sm gap-2  py-3   pb-1 pt-1 flex flex-col items-center '>
            <img src="images/chair/Slide1.png" alt="" />
            <button className='w-28  justify-between h-8   text-white font-semibold bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] rounded-md' >
                Shop now
            </button>
        </a>
        
      </div>
      <div className="w-[800px]  flex justify-between gap-3 mt-4">
        <a href="#" className='w-[250px] border border-slate-200 shadow-sm gap-2  py-3   pb-2 pt-1 flex flex-col items-center '>
            <img src="images/chair/Slide1.png" alt="" />
            <button className='w-28  justify-between h-8   text-white font-semibold bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] rounded-md' >
                Shop now
            </button>
        </a>
        <a href="#" className='w-[250px] border border-slate-200 shadow-sm gap-2  py-3  pt-1 flex flex-col items-center '>
            <img src="images/chair/Slide1.png" alt="" />
            <button className='w-28  justify-between h-8   text-white font-semibold bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] rounded-md' >
                Shop now
            </button>
        </a>
        <a href="#" className='w-[250px] border border-slate-200 shadow-sm gap-2  py-3   pb-1 pt-1 flex flex-col items-center '>
            <img src="images/chair/Slide1.png" alt="" />
            <button className='w-28  justify-between h-8   text-white font-semibold bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30] rounded-md' >
                Shop now
            </button>
        </a>
        
      </div> 
      
        
      
    </div>
  )
}

export default Bestsellers
