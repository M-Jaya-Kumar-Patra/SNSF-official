"use client"

import React from 'react'
import MapView from './MapView' // or '../components/MapView' based on location
import { useRouter } from 'next/navigation'



const Footer = () => {

  const router = useRouter()
  return (
    <div className=' bg-[#000000] w-full h-[350px] px-14 py-6 flex font-sans justify-between'>
       <div>
          <ul>
            <li className='font-semibold mb-3'>About us</li>
          </ul>
       </div>
      
       <div>
        <ul >
          <li className='font-semibold mb-3'>Need help</li>
        <li className='text-slate-300 cursor-pointer' onClick={()=>router.push("/profile")}>My Account</li>
        <li className='text-slate-300'>Track Order</li>
        <li className='text-slate-300'>Contact us</li>
        <li className='text-slate-300'>Privacy policy</li>
        </ul>
       </div>


       <div>
        <ul>
          <li className='font-semibold mb-3'>Social Accounts</li>
          <li>
            
            <a href="https://youtube.com/@snsteelfabrication6716?si=v4pPQmEDtKmacpmN "  target="_blank">
            <img src="images/youtube.png" className='w-10' alt=""/></a>
          </li>
        </ul>

       </div>


       <div className='w-[200px] text-wrap'>
        <ul>
          <li className='font-semibold mb-3'>Showroom Locaion:</li>
          <li className='text-slate-300  text-wrap'>S N Steel Fabrication, New Burupada, Hinjilicut - 761102, Ganjam, Odisha, India</li>
          <li className='font-semibold my-3'>Working hours:</li>
          <li className='text-slate-300'>Sun – Sat: 9:00 AM – 8:00 PM</li>
        </ul>
       </div>
       


       <div className='w-[300px]'>
        <MapView/>


       </div>

      
    </div>
  )
}

export default Footer
