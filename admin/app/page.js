"use client";
import React, { useState } from 'react';
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



import TablePagination from '@mui/material/TablePagination';







const Home = () => {
   const [state, setState] = useState({ right: false });
    const [selectedText, setSelectedText] = useState("Dashboard");
    const anchor = 'right';
  
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






  return (
    <div>
      <div className="w-full flex justify-center">
        <div className='w-[1150px] px-6'>
          <h1 className='text-blue-900 font-sans text-xl font-semibold p-4 pl-0 py-1 rounded-md my-3   '>
            Dashboard
          </h1>

          {/* Colored Boxes */}
          <ul className='text-black rounded-sm my-3 text-[18px] flex h-[100px] gap-3 justify-between'>
            <li className='w-1/4 h-full bg-red-600 rounded-md'></li>
            <li className='w-1/4 h-full bg-yellow-500 rounded-md'></li>
            <li className='w-1/4 h-full bg-green-700 rounded-md'></li>
            <li className='w-1/4 h-full bg-blue-400 rounded-md'></li>
          </ul>

          {/* Orders Table */}
          <table className="w-full text-center border-collapse border border-slate-200 rounded-md shadow-lg">
            <thead className="h-12 bg-green-200">
              <tr>
                <th className="text-black w-1/7 px-4 py-2">Order ID</th>
                <th className="text-black w-1/7 px-4 py-2">Payment Method</th>
                <th className="text-black w-1/7 px-4 py-2">Order Date</th>
                <th className="text-black w-1/7 px-4 py-2">Delivery Date</th>
                <th className="text-black w-1/7 px-4 py-2">Status</th>
                <th className="text-black w-1/7 px-4 py-2">Total</th>
                <th className="text-black w-1/7 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-slate-50">
              <tr className="h-auto border-b border-slate-300">
                <td className="text-black px-4 py-2 align-top">457444854</td>
                <td className="text-black px-4 py-2 align-top">Cash</td>
                <td className="text-black px-4 py-2 align-top">7 May 2025</td>
                <td className="text-black px-4 py-2 align-top">14 May 2025</td>
                <td className="text-black px-4 py-2 align-top">Pending</td>
                <td className="text-black px-4 py-2 align-top">4999/-</td>
                <td className="text-black px-4 py-2 align-top">Edit</td>    
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      


    </div>
  );
}


export default Home;  
