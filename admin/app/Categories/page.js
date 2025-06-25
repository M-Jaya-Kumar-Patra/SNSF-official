"use client"
import React, { use, useEffect } from 'react'
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
import { LazyLoadImage } from 'react-lazy-load-image-component';
import TablePagination from '@mui/material/TablePagination';
import { useAlert } from "@/app/context/AlertContext";
import { useAuth } from "@/app/context/AuthContext";
import UploadBox from '@/components/UploadBox';
import { fetchDataFromApi, postData, uploadImages, editData, deleteCategory } from '@/utils/api';
import { IoMdClose } from "react-icons/io";
import { deleteImages } from '@/utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useCat } from '../context/CategoryContext';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";


const Categories = () => {

    const [categories, setCategories] = useState([]);
    const [categs, setCateges] = useState([
        {
            name: "",
            images: [],
            parentCatName: "",
            parentId: ""
        }
    ]);


    const { catData, setCatData, getCategories } = useCat();


    //for alert(mui)
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const handleClickOpenDeleteAlert = (e, catId) => {
        e.preventDefault();
        setSelectedCategoryId(catId);
        setOpen(true);
    };
    const handleCloseDeleteAlert = () => {
        setOpen(false);
        setSelectedCategoryId(null);
    };
    ///
    const [previews, setPreviews] = useState([])
    const alert = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [editCatObj, setEditCatObj] = useState(null)
    const [editCateg, setEditCategs] = useState(null);
    const [showCategEditModal, setShowCategEditModal] = useState(false);


    const handleCategEditClick = (id, product) => {
        console.log("catId: ", id)
        setEditCategs(product);
        setEditCatObj(product);
        setPreviews(product.images || []); // <-- This line ensures previews are pre-filled
        
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
    const [uploading, setUploading] = useState(false);
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
    console.log('categories:', categories);
    console.log('Is categories an array?', Array.isArray(categories));
    const displayedCategs = categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleChangeAddInput = (e) => {
        setCateges({ ...categs, [e.target.name]: e.target.value })
        setCategories([{ ...categories, [e.target.name]: e.target.value }])
    }
    const handleChangeEditInput = (e) => {
        setEditCatObj(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleUpdateAddressChange = (e) => {
        setEditCatObj((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleSubmitEditForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...editCatObj,
            name: editCatObj.name.trim(),
            parentCatName: editCatObj.parentCatName?.trim() || "",
            parentId: editCatObj.parentId?.trim() || "",
            images: previews, // IMPORTANT: this must overwrite on backend
        };

        if (!payload.name) {
            alert.alertBox({ type: "error", msg: "Please fill all required fields." });
            setIsLoading(false);
            return;
        }
        try {
            const response = await editData(`/api/category/${payload._id}`, payload);

            if (!response.error) {
                alert.alertBox({ type: "success", msg: "Category updated successfully" });

                setShowCategEditModal(false); // ✅ close modal
                setPreviews([]); // ✅ clear previews
                getCategories()

                // Optionally refresh the category list
                fetchCategoryData(); // If you have a function like this
            } else {
                alert.alertBox({ type: "error", msg: response?.message || "Update failed" });
            }
        } catch (err) {
            alert.alertBox({ type: "error", msg: err.message || "Something went wrong" });
        } finally {
            setIsLoading(false);
        }
    };
    const setPreviewsFun = (previewsArr) => {
        setPreviews(previewsArr)
        categs.images = previewsArr

    }
    const removeImage = async (image, index) => {
        var imageArr = []
        imageArr = previews;
        deleteImages(`/api/category/remove-img?img=${image}`).then((response) => {
            console.log(response)
            imageArr.splice(index, 1);

            setPreviews([])

            setTimeout(() => {
                setPreviews(imageArr);
                setCateges(previews => ({
                    ...previews,
                    images: imageArr
                })
                )
            }, 100)
            console.log(categs)
            setPreviews([])
        })
    }
    const handleSubmitAddForm = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const { name, parentCatName, parentId } = categs;
        if (!name) {
            alert.alertBox({ type: "error", msg: "Please enter category name" });
            setIsLoading(false);
            return;
        }
        if (previews?.length === 0) {
            alert.alertBox({ type: "error", msg: "Please select category image" });
            setIsLoading(false);
            return;
        }
        await postData("/api/category/create", categs)
            .then((response) => {
                setIsLoading(false);
                if (!response.error) {
                    alert.alertBox({ type: "success", msg: "Category Created" });
                    setCateges({
                        name: "",
                        images: [],
                        parentCatName: "",
                        parentId: ""
                    });
                    setPreviews([])
                    setShowCategAddModal(false)
                    getCategories()
                } else {
                    alert.alertBox({ type: "error", msg: response.message || "Failed to create category" });
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.error("Post error:", error);
                alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
            });
    }
    const handleOpenEditModal = (catData) => {
        setEditCatObj(catData);  // populate form with this data
        setShowCategEditModal(true);  // open modal
    };
    const handleDeleteCategory = async (e, catId) => {
        console.log(catId)
        e.preventDefault();
        try {
            const response = await deleteCategory(`/api/category/${catId}`, catId)
            if (!response.error) {
                alert.alertBox({ type: "success", msg: "Category deleted" })
                // alert.alertBox({ type: "success", msg: "Category Created" });
                getCategories()

            } else {
                alert.alertBox({ type: "error", msg: "Failed to delete category" })
            }
        } catch (error) {
            alert.alertBox({ type: "error", msg: "Network issue. Try later" || error.message })
        }
    }
    return (
        <>
            <div className="w-full flex justify-center">
                <div className='w-full   px-6'>
                    <div className='flex justify-between items-center   '>
                        <h1 className='text-blue-900 font-sans text-xl font-semibold p-4 pl-0 py-1 rounded-md my-3   '>
                            Manage Categories
                        </h1>
                        <button className='w-auto h-auto p-2 py-1 pr-3 rounded-md  bg-green-800 flex items-center gap-1 ' onClick={() => handleCategAddClick()}><AddIcon />Add New Categories</button>
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
                                <th className='w-[55px]'><Checkbox/></th>
                                <th className='text-black w-[40%] '>Category Image</th>
                                <th className='text-black w-[40%] '>Category</th>
                                <th className='text-black w-[20%]'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(catData) && catData.length > 0 &&
                                catData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item, index) => (
                                        <tr key={index} className="border-b border-slate-300 h-auto">
                                            <td className="w-[55px]">
                                                <Checkbox />
                                            </td>
                                            <td className="text-black flex items-center justify-center gap-2 min h-[100px]">
                                                {Array.isArray(item.images) && item.images.length > 0 ? (
                                                    item.images.map((imgUrl, idx) => (
                                                        <Image
                                                            key={idx}
                                                            src={imgUrl}
                                                            alt={`${item.name || "Category image"} ${idx + 1}`}
                                                            width={100}
                                                            height={100}
                                                            className="my-2"
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="w-[100px] h-[100px] bg-gray-200 text-xs flex items-center justify-center text-gray-600">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-black">{item.name}</td>
                                            <td className="text-black px-2">

                                                <div className='  flex items-center justify-center ml-auto gap-1'>
                                                    <Button className=' !rounded-full  !text-blue-600 '>
                                                        <ModeEditOutlineIcon className='!w-[30px] !h-[30px] ' onClick={() => handleCategEditClick(item._id, item)} />
                                                    </Button>
                                                    <Button className='!rounded-full  !text-red-600'>
                                                        <MdDeleteOutline className='!w-[30px] !h-[30px] ' onClick={(e) => handleClickOpenDeleteAlert(e, item._id)} />
                                                    </Button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30]}
                        component="div"
                        count={catData?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
            {/* delete category */}
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
                        Are you sure you want to delete this category? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteAlert} color='inherit'>Cancel</Button>
                    <Button onClick={(e) => {
                        handleDeleteCategory(e, selectedCategoryId),
                            setOpen(false);
                    }} autoFocus color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {showCategEditModal && (
                <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                    <form onSubmit={handleSubmitEditForm}>
                        <div className='w-[700px] h-[90%] bg-white rounded-md text-black p-3 overflow-auto scrollbar-hide'>
                            <div className="text-blue-800 m-3 text-xl border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center">
                                <ArrowBackIcon
                                    onClick={() => setShowCategEditModal(false)}
                                    className='cursor-pointer text-black'
                                />
                                Edit Category
                            </div>
                            <div className="text-black m-3 font-sans font-semibold">Upload Category Images</div>
                            <div className="grid grid-cols-4 gap-4">
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
                                    url="/api/category/uploadImage"
                                    setPreviewsFun={setPreviewsFun}
                                />
                            </div>
                            <Box
                                component="div"
                                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                                noValidate
                                autoComplete="off"
                            >
                                <div>
                                    <TextField
                                        required
                                        label="Category Name"
                                        onChange={handleChangeEditInput}
                                        value={editCatObj?.name || ""}
                                        name='name'
                                    />
                                    <TextField  
                                        label="Parent Category"
                                        onChange={handleChangeEditInput}
                                        value={editCatObj?.parentCatName || ""}
                                        name='parentCatName'
                                    />
                                    <TextField
                                        label="Parent ID"
                                        onChange={handleChangeEditInput}
                                        value={editCatObj?.parentId || ""}
                                        name='parentId'
                                    />
                                </div>
                            </Box>
                            <div className="relative w-full flex gap-2 right-0 justify-end pr-5">
                                <button
                                   className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full  hover:border-red-600 hover:bg-slate-50 hover:text-red-600 font-medium'
                                    onClick={() => setShowCategEditModal(false)}
                                    type='button'
                                >
                                    Cancel
                                </button>
                                <button
                                    className='bg-blue-700 py-1 w-[90px] text-lg rounded-full hover:bg-blue-500 hover:border-none text-white font-medium'
                                    type='submit'
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {showCategAddModal && (
                <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                    <form onSubmit={handleSubmitAddForm}>
                        <div className='w-[700px] h-[90%] bg-white rounded-md text-black p-3 overflow-auto scrollbar-hide'>
                            <div className="text-green-800 m-3 text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowCategAddModal(false)} className='cursor-pointer text-black' />Add Category</div>

                            <div className="text-black m-3 font-sans font-semibold">Upload category images</div>
                            <div className="grid grid-cols-4 gap-4">
                                {Array.isArray(previews) && previews.length > 0 &&
                                    previews.map((image, index) => {
                                        return (
                                            <div className="uploadBoxWrappper relative" key={index}>
                                                <span className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer" onClick={(e) => {
                                                    removeImage(image, index)
                                                }
                                                }>
                                                    <IoMdClose className="text-white text-[17px]" />
                                                </span>
                                                <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-full bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                                                    <img
                                                        src={image}
                                                        alt="uploaded"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/fallback.png"; // optional: fallback image
                                                        }}
                                                    />

                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                <UploadBox
                                    multiple={false}
                                    name="images"
                                    url="/api/category/uploadImage"
                                    setPreviewsFun={setPreviewsFun}
                                />
                            </div>
                            <Box
                                component="div"
                                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                                noValidate
                                autoComplete="off"
                            >
                                <div>
                                    <TextField
                                        required
                                        label="Category Name"
                                        onChange={handleChangeAddInput}
                                        value={categs.name || ""}
                                        name='name'
                                    />
                                    <TextField
                                        label="Parent Category"
                                        onChange={handleChangeAddInput}
                                        value={categs.parentCatName || ""}
                                        name='parentCatName'
                                    />
                                    <TextField
                                        label="Parent ID"
                                        onChange={handleChangeAddInput}
                                        value={categs.parentId || ""}
                                        name='parentId'
                                    />
                                </div>
                            </Box>
                            <div className="relative w-full flex gap-2 right-0  justify-end pr-5">
                                <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full hover:border-none hover:text-red font-medium' onClick={() => setShowCategAddModal(false)}
                                    type='button'

                                >Cancel</button>
                                <button className=' bg-green-700  py-1  w-[90px] text-lg rounded-full hover:bg-green-500 hover:border-none text-white  font-medium'
                                    type='submit'>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}

export default Categories;
