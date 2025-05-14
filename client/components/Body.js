"use client"
import React from 'react'

const Slider = () => {
  return (
    <>
    <div className='w-full  border-black h-[50vh] mx-auto mt-3'>
        <img className='h-full' src="/images/sofa.jpg" alt="" />
      
    </div>
    <h2 className='text-black mt-4 text-2xl font-bold font pl-3'>
      New Arrivals
    </h2>
    <div className='new-arrivals w-full h-[250px]  border-black flex justify-self-center gap-0 '>
       <img className='h-full p-2' src="/images/chair/Slide1.png" alt="" /> 
       <img className='h-full p-2' src="/images/chair/Slide9.png" alt="" />
       <img className='h-full p-2' src="/images/chair/Slide3.png" alt="" />
       <img className='h-full p-2' src="/images/chair/Slide4.png" alt="" />
       <img className='h-full p-2' src="/images/chair/Slide5.png" alt="" />

       
    </div>
    </>

  )
}

export default Slider
