"use client"
import React, { use } from 'react'
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TablePagination from '@mui/material/TablePagination';






const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      id: "C001",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+91-9876543210",
      orders: 5,
      ttlSpend: "₹12,500",
      joinOn: "2023-04-12",
    },
    {
      id: "C002",
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      phone: "+91-9123456789",
      orders: 8,
      ttlSpend: "₹22,000",
      joinOn: "2022-11-23",
    },
    {
      id: "C003",
      name: "Fatima Shaikh",
      email: "fatima.shaikh@example.com",
      phone: "+91-9988776655",
      orders: 2,
      ttlSpend: "₹3,200",
      joinOn: "2024-01-18",
    },
    {
      id: "C004",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91-9876701234",
      orders: 11,
      ttlSpend: "₹30,700",
      joinOn: "2023-07-05",
    },
    {
      id: "C005",
      name: "Meena Iyer",
      email: "meena.iyer@example.com",
      phone: "+91-9856231478",
      orders: 1,
      ttlSpend: "₹1,200",
      joinOn: "2024-05-01",
    },
  ]);

  const [editCustomers, setEditCustomers] = useState(null);
  const [showCustmEditModal, setShowCustmEditModal] = useState(false);
  const handleCustmEditClick = (product) => {
    setEditCustomers(product);
    setShowCustmEditModal(true);
  }


  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [addCustomers, setAddCustomers] = useState(null);
  const [showCustmAddModal, setShowCustmAddModal] = useState(false);
  const handleCustmAddClick = () => {
    setShowCustmAddModal(true);
  }





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
    <>

      <div className="w-full flex justify-center">
        <div className='w-full   px-6'>
          <div className='flex justify-between items-center   '>
            <h1 className='text-blue-900 font-sans text-xl font-semibold p-4 pl-0 py-1 rounded-md my-3   '>
              Manage Customers
            </h1>
            <button className='w-auto h-auto p-2 py-1 pr-3 rounded-md  bg-green-800 flex items-center gap-1 ' onClick={() => handleCustmAddClick()}><AddIcon />Add New Customer</button>
          </div>

          <div className='flex gap-3'>
            <div className="relative w-full text-black flex  h-10  px-2 gap-2  border border-slate-300 rounded-md items-center">
              <SearchIcon className='text-gray-600' />
              <input
                type="text"
                placeholder="Search..."
                className=" outline-none text-black"
              />


            </div>
            <div className='h-10 w-10 border border-slate-300 rounded-md text-black flex items-center justify-center cursor-pointer'>
              <FilterAltIcon />
            </div>
          </div>

          {/* Table */}

          <table className='w-full text-center border-collapse border border-slate-200 rounded-md shadow-lg mt-4'>
            <thead className='h-12 bg-blue-100 border-b border-slate-300'>
              <tr>
                <th className='w-[55px]'><Checkbox /></th>
                <th className='text-black w-[20%] '>Name</th>
                <th className='text-black w-[13%] '>Email</th>
                <th className='text-black w-[13%]'>Phone</th>
                <th className='text-black w-[12%]'>Orders</th>
                <th className='text-black w-[10%] '>Total Spend</th>
                <th className='text-black w-[10%] '>Joined On</th>
                <th className='text-black w-[10%]'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cst) => {
                return (
                  <tr
                    key={cst.id}
                    className='border-b border-slate-300'>

                    <td className='w-[55px]'><Checkbox /></td>


                    <td className='text-black '>{cst.name}</td>
                    <td className='text-black '>{cst.email}</td>
                    <td className='text-black '>{cst.phone}</td>
                    <td className='text-black '>{cst.orders}</td>
                    <td className='text-black '>{cst.ttlSpend}</td>
                    <td className='text-black '>{cst.joinOn}</td>
                    <td className='text-black  '>
                      <ModeEditOutlineIcon onClick={() => handleCustmEditClick(cst)} className='text-blue-600 cursor-pointer mr-4 active:bg-gray-200 rounded-full ' />
                      <DeleteOutlineIcon className='text-red-600 cursor-pointer active:bg-gray-200 rounded-full' />
                    </td>
                  </tr>
                )

              })}



            </tbody>
          </table>
          <TablePagination
            rowsPerPageOptions={[3, 5, 10]}
            component="div"
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

        </div>
      </div>

      {showCustmEditModal && editCustomers && (
        <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
          <div className='w-[700px] h-[450px] bg-white rounded-md text-black p-3 overflow-auto scrollbar-hide'>
            <div className="text-blue-800 m-3 text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowCustmEditModal(false)} className='cursor-pointer text-black' />Edit Customer</div>



            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  required
                  id="cName-edit"
                  label="Customer name"
                  defaultValue={editCustomers.name}
                />
                <TextField
                  required
                  id="email-edit"
                  label="Email ID"
                  type='email'
                  defaultValue={editCustomers.email}
                />
                <TextField
                  required
                  id="email-edit"
                  label="Phone number"
                  type='number'
                  defaultValue={editCustomers.phone}
                />
                <TextField
                  required
                  id="orders-edit"
                  label="Orders"
                  defaultValue={editCustomers.orders}

                />
                <TextField
                  id="ttlSpend-edit"
                  label="Total Spend"
                  type="number"
                  defaultValue={editCustomers.ttlSpend}

                />

              </div>

            </Box>

            <div className="relative w-full flex gap-2 right-0  justify-end pr-5">
              <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full hover:bg-red-500 hover:border-none hover:text-white font-medium' onClick={() => setShowCustmEditModal(false)}>Cancel</button>
              <button className=' bg-blue-700  py-1  w-[90px] text-lg rounded-full hover:bg-blue-500 hover:border-none text-white  font-medium'>Save</button>
            </div>





          </div>
        </div>

      )}
      {showCustmAddModal && (
        <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
          <div className='w-[700px] h-[450px] bg-white rounded-md text-black p-3 overflow-auto scrollbar-hide'>
            <div className="text-green-800 m-3 text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowCustmAddModal(false)} className='cursor-pointer text-black' />Add Customer</div>

            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  required
                  id="cName-edit"
                  label="Customer name"
                />
                <TextField
                  required
                  id="email-edit"
                  label="Email ID"
                  type='email'
                />
                <TextField
                  required
                  id="email-edit"
                  label="Phone number"
                  type='number'
                />
                <TextField
                  required
                  id="orders-edit"
                  label="Orders"

                />
                <TextField
                  id="ttlSpend-edit"
                  label="Total Spend"
                  type="number"

                />

              </div>

            </Box>

            <div className="relative w-full flex gap-2 right-0  justify-end pr-5">
              <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full hover:bg-red-500 hover:border-none hover:text-white font-medium' onClick={() => setShowCustmAddModal(false)}>Cancel</button>
              <button className=' bg-green-700  py-1  w-[90px] text-lg rounded-full hover:bg-green-500 hover:border-none text-white  font-medium'>Save</button>
            </div>





          </div>
        </div>

      )}

    </>
  )
}

export default Customers
