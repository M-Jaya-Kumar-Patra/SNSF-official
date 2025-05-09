import React from 'react'

const Footer = ({fontClass}) => {
  return (
    <div className=' bg-[#000000] w-full h-[300px] px-32 py-6 flex font-sans justify-around'>
       <div>
          <ul>
            <li className='font-semibold mb-3'>About us</li>
          </ul>
       </div>
      
       <div>
        <ul >
          <li className='font-semibold mb-3'>Need help</li>
        <li className='text-slate-300'>My Account</li>
        <li className='text-slate-300'>Track Order</li>
        <li className='text-slate-300'>Contact us</li>
        <li className='text-slate-300'>Privacy policy</li>
        </ul>
       </div>


       <div>
        <ul>
          <li className='font-semibold mb-3'>Social Accounts</li>
          <li>
            
            <a href="https://youtube.com/@snsteelfabrication6716?si=v4pPQmEDtKmacpmN "  target="blank">
            <img src="images/youtube.png" className='w-10' alt=""/></a>
          </li>
        </ul>

       </div>


       <div>


       </div>

      
    </div>
  )
}

export default Footer
