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
import {
    Box,
    LinearProgress,
} from "@mui/material"
import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import TablePagination from '@mui/material/TablePagination';
import { usePrd } from '../context/ProductContext';
import { useCat } from '../context/CategoryContext';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UploadBox from '@/components/UploadBox';
import { IoMdClose } from "react-icons/io";

import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { postData, deleteImages, deleteProduct, deleteMultipleData, fetchDataFromApi, deleteSlide } from '@/utils/api';
import { useAlert } from '../context/AlertContext';
import { useEffect } from 'react';


const Slider = () => {


    const [formFields, setFormFields] = useState(
        {
            images: []
        }
    )
    const alert = useAlert();

    const [slides, setSlides] = useState([])
    const getSlides = async () => {
        const response = await fetchDataFromApi(`/api/homeSlider/getAllSlides`)
        console.log(response?.data)
        setSlides(response?.data)
        return response?.data
    }

    useEffect(() => {
        getSlides()
    }, [])
    const [addSlides, SetAddSlides] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddClick = () => {
        setShowAddModal(true);
    }

    const [previews, setPreviews] = useState([]);

    const setPreviewsFun = (previewsArr) => {
        setPreviews(previewsArr)
        setFormFields((prev) => ({
            ...prev,
            images: previewsArr // ✅ set it in formFields
        }));

    }


    const [loading, isLoading] = useState(false)

    // for page change

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0); // Reset to first page
    };


    //for alert(mui)
    const [open, setOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const handleClickOpenDeleteAlert = (e, catId) => {
        e.preventDefault();
        setSelectedProductId(catId);
        setOpen(true);
    };
    const handleCloseDeleteAlert = () => {
        setOpen(false);
        setSelectedProductId(null);
    };
    ///


    const handleSubmitAddForm = (e) => {
        e.preventDefault();

        if (previews?.length === 0) {
            alert.alertBox({ type: "error", msg: "Please select product image" });
            return;
        }
        postData("/api/homeslider/create", formFields, true)
            .then((response) => {
                if (!response.error) {
                    alert.alertBox({ type: "success", msg: "slide Created" });
                    setFormFields({
                        images: []
                    })
                    setPreviews([])
                    setShowAddModal(false)
                    getSlides()
                } else {
                    alert.alertBox({ type: "error", msg: response.message || "Failed to create slide" });
                }
            })
            .catch((error) => {
                console.error("Post error:", error);
                alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
            });
    }

    const removeImage = async (imageUrl, index) => {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public_id from URL

        try {
            const response = await deleteImages(`/api/homeSlider/deleteImg`, publicId);

            if (response.success) {
                const updatedPreviews = [...previews];
                updatedPreviews.splice(index, 1);

                setPreviews(updatedPreviews);

                setFormFields(prevFields => ({
                    ...prevFields,
                    images: updatedPreviews
                }));
            } else {
                console.error("Image deletion failed:", response.message);
            }
        } catch (err) {
            console.error("Error deleting image:", err.message || err);
        }
    };


    const handleDeleteSlide = async (e, slideId) => {

        e.preventDefault();
        try {
            const response = await deleteSlide(`/api/homeSlider/${slideId}`, slideId)
            console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
            if (!response.error) {
                alert.alertBox({ type: "success", msg: "Slide deleted" })
                // alert.alertBox({ type: "success", msg: "Product Created" });
                getSlides()

            } else {
                alert.alertBox({ type: "error", msg: "Failed to delete slide" })
            }
        } catch (error) {
            alert.alertBox({ type: "error", msg: "Network issue. Try later" || error.message })
        }
    }

    const [searchQuery, setSearchQuery] = useState('');








    return (
        <>

            <div className="w-full flex justify-center">
                <div className='w-full   px-6'>
                    <div className='flex justify-between items-center   '>
                        <h1 className='text-blue-900 font-sans text-xl font-semibold p-4 pl-0 py-1 rounded-md my-3   '>
                            Manage Home Page Slides
                        </h1>
                        <div className='flex gap-4'>
                            <button className='w-auto h-auto p-2 py-1 pr-3 rounded-md  bg-green-800 flex items-center gap-1 ' onClick={() => handleAddClick()}><AddIcon />Add New Slide</button>
                        </div>
                    </div>

                    <div className='flex gap-3'>
                        <div className="relative w-full text-black flex  h-10  px-2 gap-2  border border-slate-300 rounded-md items-center">
                            <SearchIcon className='text-gray-600' />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="outline-none text-black w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
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
                                <th className='text-black w-[80%] '>Image</th>
                                <th className='text-black w-[20%]'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8}>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress />
                                        </Box>
                                    </td>
                                </tr>
                            ) : (
                                Array.isArray(slides) &&
                                slides.length > 0 &&
                                slides
                                    .map((prd, index) => (
                                        <tr key={index} className="border-b border-slate-300">

                                            <td className="text-black flex items-center justify-center">
                                                {Array.isArray(prd.images) && prd.images.length > 0 ? (
                                                    <Image
                                                        src={prd.images[0]}
                                                        alt={`${prd.name || 'Product image'} 1`}
                                                        width={400}
                                                        height={400}
                                                        className="my-2"
                                                    />
                                                ) : (
                                                    <div className="w-[100px] h-[100px] bg-gray-200 text-xs flex items-center justify-center text-gray-600">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            <td width={50} height={50} className="text-black text-center">
                                                <DeleteOutlineIcon sx={{ width: '100%', height: '100%' }}
                                                    className="text-red-600 cursor-pointer rounded-full hover:bg-gray-100 active:bg-gray-200 transition duration-150"
                                                    onClick={(e) => handleClickOpenDeleteAlert(e, prd._id)}
                                                />
                                            </td>

                                        </tr>
                                    ))
                            )}
                        </tbody>


                    </table>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30]}
                        component="div"
                        count={formFields?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </div>
            </div>



            <Dialog
                open={open}
                onClose={handleCloseDeleteAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteAlert} color='inherit'>Cancel</Button>
                    <Button onClick={(e) => {
                        handleDeleteSlide(e, selectedProductId),
                            setOpen(false);
                    }} autoFocus color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


            {showAddModal && (
                <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                    <div className='w-[700px] h-[90%] bg-white rounded-md text-black py-3 px-6 overflow-auto scrollbar-hide'>

                        <form onSubmit={handleSubmitAddForm}>
                            <div className="text-green-800  text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowAddModal(false)} className='cursor-pointer text-black' />Add Slide</div>

                            <div className="text-black my-3 font-sans font-semibold">Upload images</div>
                            <div className="grid grid-cols-4 gap-4  mb-3">
                                {Array.isArray(previews) && previews.length > 0 &&
                                    previews.map((image, index) => (
                                        <div className="uploadBoxWrappper relative" key={`${image}-${index}`}>
                                            <span
                                                className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                                                onClick={() => removeImage(image, index)}
                                            >
                                                <IoMdClose className="text-white text-[17px]" />
                                            </span>
                                            <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-full bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                                                <img
                                                    src={image}
                                                    alt={`Uploaded Image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/fallback.png";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                }
                                <UploadBox
                                    multiple={false}
                                    name="images"
                                    url="/api/homeSlider/uploadImages"
                                    setPreviewsFun={setPreviewsFun}
                                />
                            </div>



                            <div className="relative w-full flex gap-2 right-0  justify-end mt-4">
                                <button className=' bg-white border  py-1  w-[90px] text-lg rounded-full text-red-600 border-red-600 hover:shadow-md inset font-medium' onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className=' bg-green-700  py-1  w-[90px] text-lg rounded-full hover:bg-green-600 hover:shadow-md hover:border-none text-white  font-medium' type='submit'>Save</button>
                            </div>
                        </form>





                    </div>
                </div>

            )}

        </>
    )

}
export default Slider

