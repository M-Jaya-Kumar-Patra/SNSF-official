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







const Categorirs = () => {
    const [categs, setCateges] = useState([
        {
            id: "001",
            category: "Chairs",
            image: "/images/chair/slide1.png",
        },
        {
            id: "002",
            category: "Tables",
            image: "/images/table.png",
        },
    ]);

    const [editCateg, setEditCategs] = useState(null);
    const [showCategEditModal, setShowCategEditModal] = useState(false);
    const handleCategEditClick = (product) => {
        setEditCategs(product);
        setShowCategEditModal(true);
    }


    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const [addCateg, setAddCateg] = useState(null);
    const [showCategAddModal, setShowCategAddModal] = useState(false);
    const handleCategAddClick = () => {
        setShowCategAddModal(true);
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
                            Manage Categories
                        </h1>
                        <button className='w-auto h-auto p-2 py-1 pr-3 rounded-md  bg-green-800 flex items-center gap-1 ' onClick={() => handleCustmAddClick()}><AddIcon />Add New Categories</button>
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
                                <th className='text-black w-[150px] '>Category Image</th>
                                <th className='text-black w-[20%] '>Category</th>
                                <th className='text-black w-[13%] '>ID</th> 
                                <th className='text-black w-[10%]'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categs.map((prd) => {
                                return (
                                    <tr
                                        key={prd.id}
                                        className='border-b border-slate-300'>

                                        <td className='w-[55px]'><Checkbox /></td>

                                        <td className='text-black flex items-center justify-center'>
                                            <Image src={prd.image} alt={prd.name} width={96} height={96} />
                                        </td>


                                        <td className='text-black '>{prd.name}</td>
                                        <td className='text-black '>{prd.id}</td>
                                        <td className='text-black  '>
                                            <ModeEditOutlineIcon onClick={() => handleCategEditClick(prd)} className='text-blue-600 cursor-pointer  active:bg-gray-200 rounded-full ' />
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
        count={categs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

                </div>
            </div>

            {showCategEditModal && editCateg && (
                <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                    <div className='w-[700px] h-[450px] bg-white rounded-md text-black p-3 overflow-auto scrollbar-hide'>
                        <div className="text-blue-800 m-3 text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowCategEditModal(false)} className='cursor-pointer text-black' />Edit Category</div>

                        <div className="text-black m-3 font-sans font-semibold">Upload Category images</div>
                        <ImageUploader />

                        <Box
                            component="form"
                            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <div>
                                <TextField
                                    required
                                    id="name-edit"
                                    label="Category Name"
                                    defaultValue={editCateg.name}
                                />
                                <TextField
                                    required
                                    id="id-edit"
                                    label="Category ID"
                                    defaultValue={editCateg.id}
                                />

                            </div>

                        </Box>

                        <div className="relative w-full flex gap-2 right-0  justify-end pr-5">
                            <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full hover:bg-red-500 hover:border-none hover:text-white font-medium' onClick={() => setShowCategEditModal(false)}>Cancel</button>
                            <button className=' bg-blue-700  py-1  w-[90px] text-lg rounded-full hover:bg-blue-500 hover:border-none text-white  font-medium'>Save</button>
                        </div>





                    </div>
                </div>

            )}
            {showCategAddModal && (
                <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                    <div className='w-[700px] h-[450px] bg-white rounded-md text-black p-3 overflow-auto scrollbar-hide'>
                        <div className="text-green-800 m-3 text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowCategAddModal(false)} className='cursor-pointer text-black' />Add Category</div>

                        <div className="text-black m-3 font-sans font-semibold">Upload category images</div>
                        <ImageUploader />

                        <Box
                            component="form"
                            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <div>
                                <TextField
                                    required
                                    id="name-edit"
                                    label="Category Name"
                                    defaultValue=""
                                />
                                <TextField
                                    required
                                    id="id-edit"
                                    label="Category ID"
                                    defaultValue=""
                                />
                            

                            </div>

                        </Box>

                        <div className="relative w-full flex gap-2 right-0  justify-end pr-5">
                            <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full hover:bg-red-500 hover:border-none hover:text-white font-medium' onClick={() => setShowCategAddModal(false)}>Cancel</button>
                            <button className=' bg-green-700  py-1  w-[90px] text-lg rounded-full hover:bg-green-500 hover:border-none text-white  font-medium'>Save</button>
                        </div>





                    </div>
                </div>

            )}

        </>
    )
}

export default Categorirs;
