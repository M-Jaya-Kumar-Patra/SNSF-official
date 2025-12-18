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
             {/* PAGE WRAPPER */}
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="w-full px-6 py-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Manage Categories
            </h1>
            <p className="text-sm text-slate-500">
              Create and manage product categories
            </p>
          </div>

          <button
            onClick={handleCategAddClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            <AddIcon fontSize="small" />
            Add Category
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-2 h-11 px-4 bg-white border border-slate-200 rounded-lg shadow-sm w-full">
            <SearchIcon className="text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          <button className="h-11 w-11 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-slate-100">
            <FilterAltIcon className="text-slate-600" />
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 text-sm">
              <tr>
                <th className="p-3 w-[50px]">
                  <Checkbox />
                </th>
                <th className="p-3">Category Image</th>
                <th className="p-3">Category Name</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(catData) &&
                catData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="p-3">
                        <Checkbox />
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          {item.images?.length ? (
                            item.images.map((img, i) => (
                              <Image
                                key={i}
                                src={img}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-md border"
                              />
                            ))
                          ) : (
                            <div className="w-[60px] h-[60px] bg-slate-200 flex items-center justify-center text-xs text-slate-500 rounded">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3 font-medium text-slate-900">
                        {item.name}
                      </td>

                      <td className="p-3 flex justify-center gap-3">
                        <Button className="!rounded-full !text-blue-600">
                          <ModeEditOutlineIcon
                            className="!w-[26px] !h-[26px]"
                            onClick={() =>
                              handleCategEditClick(item._id, item)
                            }
                          />
                        </Button>

                        <Button className="!rounded-full !text-red-600">
                          <MdDeleteOutline
                            className="!w-[26px] !h-[26px]"
                            onClick={(e) =>
                              handleClickOpenDeleteAlert(e, item._id)
                            }
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="border-t border-slate-200">
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={catData?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </div>

    {/* DELETE DIALOG */}
    <Dialog open={open} onClose={handleCloseDeleteAlert}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText className="text-slate-600">
          Are you sure you want to delete this category? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteAlert}>Cancel</Button>
        <Button
          color="error"
          onClick={(e) => {
            handleDeleteCategory(e, selectedCategoryId);
            setOpen(false);
          }}
        >
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
