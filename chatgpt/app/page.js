"use client";
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import { BsBoxSeamFill, BsFillPeopleFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Navbar from '@/components/Navbar';

import { useAuth } from './context/AuthContext';


import TablePagination from '@mui/material/TablePagination';
import { useRouter } from 'next/navigation';
import { BsPCircle } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
import { usePrd } from './context/ProductContext';
import Orders from './Orders/page';
import { useOrders } from './context/OrdersContext';






const Home = () => {

  const {isLogin} =useAuth();
  const {prdData} = usePrd();
   const [state, setState] = useState({ right: false });
    const [selectedText, setSelectedText] = useState("Dashboard");
    const anchor = 'right';
    const {OrdersData} = useOrders()

    const router = useRouter()
  
    const toggleDrawer = (anchor, open) => (event) => {
      if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
      setState({ ...state, [anchor]: open });
    };


    



  
    const navItems = ['Dashboard', 'Products', 'Categories', 'Customers'];  




    // for page change
    
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(3);
    
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0); // Reset to first page
      };


      const countPendingOrders = () => {
  return OrdersData?.filter(order => order?.order_Status === "Pending").length || 0;
};



  return (
    <>
    {isLogin && <div>
      <div className="w-full flex justify-center">
        <div className='w-[full] px-6'>
          <h1 className='text-blue-900 font-sans text-xl font-semibold p-4 pl-0 py-1 rounded-md my-3   '>
            Dashboard
          </h1>

          {/* Colored Boxes */}
          <ul className='text-black rounded-sm my-3 text-[18px] flex h-[100px] gap-3 justify-between'>
            <li className='w-1/4 h-full bg-red-600 rounded-md  text-white flex justify-center items-center gap-1 p-3 '>
            <div className='w-[20%]  flex justify-center items-center'>
                <BsPCircle className="w-8 h-8 font-extrabold " />
              </div>
               <div className='w-[60%] '> 
                <div className="text-nowrap first-letter:capitalize font-normal font-sans ">Total Products</div>
                <div className='font-bold font-sans text-2xl' >{prdData?.length}</div>

              </div>
               <div className='w-[20%]  flex justify-center items-center'>
                <AiFillProduct  className="w-8 h-8 font-extrabold " />

              </div></li>


            <li className='w-1/4 h-full bg-yellow-500 rounded-md  text-white flex justify-center items-center gap-1 p-3 '>
            <div className='w-[20%]  flex justify-center items-center'>
                <BsPCircle className="w-8 h-8 font-extrabold " />
              </div>
               <div className='w-[60%] '> 
                <div className="text-nowrap first-letter:capitalize font-normal font-sans ">Pending Orders</div>
                <div className='font-bold font-sans text-2xl' >{countPendingOrders()}</div>

              </div>
               <div className='w-[20%]  flex justify-center items-center'>
                <AiFillProduct  className="w-8 h-8 font-extrabold " />

              </div></li>


            <li className='w-1/4 h-full bg-green-700 rounded-md  text-white flex justify-center items-center gap-1 p-3 '>
            <div className='w-[20%]  flex justify-center items-center'>
                <BsPCircle className="w-8 h-8 font-extrabold " />
              </div>
               <div className='w-[60%] '> 
                <div className="text-nowrap first-letter:capitalize font-normal font-sans ">Total Orders</div>
                <div className='font-bold font-sans text-2xl' >{OrdersData?.length}</div>

              </div>
               <div className='w-[20%]  flex justify-center items-center'>
                <AiFillProduct  className="w-8 h-8 font-extrabold " />

              </div></li>


            <li className='w-1/4 h-full bg-violet-600 rounded-md text-white flex justify-center items-center gap-1 p-3   '>
              <div className='w-[20%]  flex justify-center items-center'>
                <BsPCircle className="w-8 h-8 font-extrabold " />
              </div>
               <div className='w-[60%] '> 
                <div className="text-nowrap first-letter:capitalize font-normal font-sans ">Total Products</div>
                <div className='font-bold font-sans text-2xl' >{prdData?.length}</div>

              </div>
               <div className='w-[20%]  flex justify-center items-center'>
                <AiFillProduct  className="w-8 h-8 font-extrabold " />

              </div>
            </li>
          </ul>

          {/* Orders Table */}

          <Orders/>
          
        </div>
      </div>
      


    </div>}
    </>
  );
}


export default Home;  
