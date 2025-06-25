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
    import { useCat } from '@/app/context/CategoryContext';
    import { FaAngleDown } from "react-icons/fa";
    import EditSubCatBox from './EditSubCatBox';
    import { CiEdit } from "react-icons/ci";
    import { MdDeleteOutline } from "react-icons/md";



    const Subcategories = () => {

        const [categories, setCategories] = useState([]);
        const [categs, setCateges] = useState([
            {
                name: "",
                parentCatName: "",
                parentId: ""
            }
        ]);
        const [categs2, setCateges2] = useState([
            {
                name: "",
                parentCatName: "",
                parentId: ""
            }
        ]);


        const { catData, setCatData, getCategories } = useCat()



        const [productCat, setProductCat] = useState([]);

        const [productCat2, setProductCat2] = useState('');


        const handleChangeProductCat = (event) => {
            setProductCat(event.target.value);
            setCateges(prev => ({ ...prev, parentId: event.target.value }));
        }

        const handleChangeProductCat2 = (event) => {
            setProductCat2(event.target.value);
            setCateges2(prev => ({ ...prev, parentId: event.target.value }));
        }

        const selectedCat = (catName) => {

            setCateges(prev => ({ ...prev, parentCatName: catName }));
        }

        const selectedCat2 = (catName) => {


            setCateges2(prev => ({ ...prev, parentCatName: catName }));
        }



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
        const displayedCategs = categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        const onChangeInput = (e) => {
            const catId = productCat
            setProductCat(catId)
            setCateges({ ...categs, [e.target.name]: e.target.value })
            setCategories([{ ...categories, [e.target.name]: e.target.value }])
        }

        const onChangeInput2 = (e) => {
            const catId = productCat2
            setProductCat2(catId)
            setCateges2({ ...categs2, [e.target.name]: e.target.value })
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
                setPreviews([])
            })
        }


        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true)


            // const { name, parentCatName, parentId } = categs;
            if (categs.name === "") {
                alert.alertBox({ type: "error", msg: "Please enter category name" });
                setIsLoading(false);
                return;
            }
            if (productCat === "") {
                alert.alertBox({ type: "error", msg: "Please select parent category" });
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
                        setProductCat(null)
                        // setShowCategAddModal(false)
                        getCategories()
                    } else {
                        alert.alertBox({ type: "error", msg: response.message || "Failed to create category" });
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
                });
        }

        const handleSubmit2 = async(e) => {
            e.preventDefault();
            setIsLoading(true)

            // const { name, parentCatName, parentId } = categs;
            if (categs2.name === "") {
                alert.alertBox({ type: "error", msg: "Please enter category name" });
                setIsLoading(false);
                return;
            }
            if (productCat2 === "") {
                alert.alertBox({ type: "error", msg: "Please select parent category" });
                setIsLoading(false);
                return;
            }
            await postData("/api/category/create", categs2)
                .then((response) => {
                    setIsLoading(false);
                    if (!response.error) {
                        alert.alertBox({ type: "success", msg: "Category Created" });
                        setCateges2({
                            name: "",
                            images: [],
                            parentCatName: "",
                            parentId: ""
                        });
                        // setShowCategAddModal(false)
                        setProductCat2(null)
                        getCategories()
                    } else {
                        alert.alertBox({ type: "error", msg: response.message || "Failed to create category" });
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
                });
        }


        const handleOpenEditModal = (catData) => {
            setEditCatObj(catData);  // populate form with this data
            setShowCategEditModal(true);  // open modal
        };
        const handleDeleteCategory = async (e, catId) => {
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


        // const [isOpen, setIsOpen] = useState(0);
        // const expand = (index) => {

        //     console.log("object")
        //     if (isOpen === index) {
        //         console.log(isOpen, index, "1")

        //         setIsOpen(!isOpen);
        //         console.log(isOpen, index, "2")

        //     } else {
        //         console.log(isOpen, index, "3")

        //         setIsOpen(index);
        //         console.log(isOpen, index, "4")

        //     }
        // }

        const [isOpen, setIsOpen] = useState(null);

        const expand = (index) => {
            setIsOpen(prev => (prev === index ? null : index));
        };

        return (
            <>
                <div className="w-full flex justify-center">
                    <div className='w-full   px-6'>
                        <div className='flex justify-between items-center   '>
                            <h1 className='text-blue-900 font-sans text-xl font-semibold p-4 pl-0 py-1 rounded-md my-3   '>
                                Manage Categories
                            </h1>
                            <button className='w-auto h-auto p-2 py-1 pr-3 rounded-md  bg-green-800 flex items-center gap-1 ' onClick={() => handleCategAddClick()}><AddIcon />Add New Sub Categories</button>
                        </div>

                        {/* Table */}
                        <div className='card w-full border   shadow-md rounded-md overflow-hidden p-5 '>
                            {
                                catData?.length > 0 &&
                                <ul className='w-full text-black '>
                                    {
                                        catData?.map((firstLevelCat, index) => {
                                            return (
                                                <li className='w-full mb-1' key={index} >
                                                    <div className='flex items-center w-full p-2 bg-gray-200 rounded-sm px-4'>
                                                        <span className=' flex items-center gap-4 text-[20px] font-sans font-semibold'>{firstLevelCat.name}</span>
                                                        <Button className='!min-w-[35px] !w-[35px] !h-[35px] !ml-auto !rounded-full  !text-black' onClick={() => expand(index)}>
                                                            <FaAngleDown  onClick={() => expand(index)}/>
                                                        </Button>
                                                    </div>
                                                    {
                                                        isOpen === index &&
                                                        <>
                                                            {firstLevelCat?.children?.length !== 0 &&
                                                                <ul className='w-full'>
                                                                    {firstLevelCat?.children?.map((secondLevelCat, index_) => {
                                                                        return (
                                                                            <li className='w-full py-1' key={index_}>
                                                                                <EditSubCatBox
                                                                                    name={secondLevelCat?.name}
                                                                                    id={secondLevelCat?._id}
                                                                                    catData={catData}
                                                                                    index={index_}
                                                                                    selectedCat={secondLevelCat?.parentId}
                                                                                    selectedCatName={secondLevelCat?.parentCatName}

                                                                                />
                                                                                {secondLevelCat?.children?.length !== 0 &&
                                                                                    <ul className='pl-6'>
                                                                                        {secondLevelCat?.children?.map((thirdLevelCat, index__) => {
                                                                                            return (
                                                                                                <li className='w-full py-1' key={index__}>
                                                                                                    <EditSubCatBox
                                                                                                        name={thirdLevelCat?.name}
                                                                                                        id={thirdLevelCat?._id}
                                                                                                        catData={catData}
                                                                                                        index={index__}
                                                                                                        selectedCat={thirdLevelCat?.parentId}
                                                                                                        selectedCatName={thirdLevelCat?.parentCatName}

                                                                                                    />
                                                                                                </li>
                                                                                            )
                                                                                        })}
                                                                                    </ul>
                                                                                }
                                                                            </li>
                                                                        )
                                                                    })}

                                                                </ul>
                                                            }
                                                        </>
                                                    }
                                                </li>
                                            )

                                        }
                                        )
                                    }

                                </ul>
                            }

                        </div>

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
                
                {showCategAddModal && (
                    <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                        <div className='w-[700px] h-[90%] bg-white rounded-md text-black p-3 overflow-auto scrollbar-hide'>
                            <div className="text-green-800 m-3 text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowCategAddModal(false)} className='cursor-pointer text-black' />Add New Sub Category</div>


                            <form onSubmit={handleSubmit}>
                                <h1 className='ml-4 text-gray-700 font-sans font-semibold text-[20px]'>Add sub category</h1>
                                <div className='px-4'>
                                    <Box
                                        component="div"
                                        sx={{ '& .MuiTextField-root': { m: 1, ml: 2, width: '250px' } }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <div className='flex  items-center'>
                                            <div className='left '>
                                                <div className="text-black m-3 font-sans font-semibold">Product Category</div>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="productCatDrop"
                                                    size="normal"
                                                    className="w-[250px] m-2 ml-3"
                                                    value={productCat || ''} // ✅ Fallback to empty string
                                                    label="Category"
                                                    onChange={handleChangeProductCat}
                                                >
                                                    {
                                                        catData?.length !== 0 && catData?.map((item, index) => {
                                                            return (
                                                                <MenuItem key={index} value={item?._id} onClick={() => selectedCat(item.name)}>{item.name}</MenuItem>

                                                            )

                                                        }

                                                        )
                                                    }
                                                </Select>
                                            </div>


                                            <div className='right'>
                                                <div className="text-black m-3 ml-4 font-sans font-semibold">Sub Category Name</div>

                                                <TextField
                                                    label="Sub Category"
                                                    onChange={onChangeInput}
                                                    value={categs.name || ""}
                                                    name='name'
                                                />
                                            </div>

                                        </div>
                                    </Box>
                                    <div className="relative w-full flex gap-2 right-0  justify-end pr-5 mt-4">
                                        <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full  hover:border-red-600 hover:bg-slate-50 hover:text-red-600 font-medium' onClick={() => setShowCategAddModal(false)}
                                            type='button'

                                        >Cancel</button>
                                        <button className=' bg-green-700  py-1  w-[90px] text-lg rounded-full hover:bg-green-500 hover:border-none text-white  font-medium'
                                            type='submit'>Save</button>


                                    </div>
                                </div>
                            </form>

                            <form onSubmit={handleSubmit2}>


                                <h1 className='ml-4 mt-4 text-gray-700 font-sans font-semibold text-[20px]'>Add third level category</h1>
                                <div className='px-4 '>
                                    <Box
                                        component="div"
                                        sx={{ '& .MuiTextField-root': { m: 1, ml: 2, width: '250px' } }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <div className='flex  items-center '>
                                            <div className='left '>
                                                <div className="text-black m-3 font-sans font-semibold">Product Category</div>
                                                {/* <Select
                                                    labelId="demo-simple-select-label"
                                                    id="productCatDrop"
                                                    size="normal"
                                                    className="w-[250px] m-2 ml-3"
                                                    value={productCat2 || ''} // ✅ Fallback to empty string
                                                    label="Category"
                                                    onChange={handleChangeProductCat2}
                                                >
                                                    {
                                                        catData?.length !== 0 && catData?.map((item, index) => {
                                                            item?.children?.length !== 0 && item?.children?.map((item2, index)=>{
                                                                return (
                                                                <MenuItem key={index} value={item?._id} onClick={() => selectedCat2(item.name)}>{item.name}</MenuItem>

                                                            )
                                                            })
                                                            

                                                        }

                                                        )
                                                    }
                                                </Select>  */}
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="productCatDrop"
                                                    size="normal"
                                                    className="w-[250px] m-2 ml-3"
                                                    value={productCat2 || ''}
                                                    label="Category"
                                                    onChange={handleChangeProductCat2}
                                                >
                                                    {
                                                        catData?.length !== 0 &&
                                                        catData.map((parent) =>
                                                            parent?.children?.length !== 0 &&
                                                            parent.children.map((child) => (
                                                                <MenuItem
                                                                    key={child._id}
                                                                    value={child._id}
                                                                    onClick={() => selectedCat2(`${child.name}`)}
                                                                >
                                                                    {child.name}
                                                                </MenuItem>
                                                            ))
                                                        )}
                                                </Select>

                                            </div>


                                            <div className='right'>
                                                <div className="text-black m-3 ml-4 font-sans font-semibold">Sub Category Name</div>

                                                <TextField
                                                    label="Sub Category"
                                                    onChange={onChangeInput2}
                                                    value={categs2.name || ""}
                                                    name='name'
                                                />
                                            </div>

                                        </div>
                                    </Box>
                                    <div className="relative w-full flex gap-2 right-0  justify-end pr-5 mt-4">
                                        <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full  hover:border-red-600 hover:bg-slate-50 hover:text-red-600 font-medium' onClick={() => setShowCategAddModal(false)}
                                            type='button'

                                        >Cancel</button>
                                        <button className=' bg-green-700  py-1  w-[90px] text-lg rounded-full hover:bg-green-500 hover:border-none text-white  font-medium'
                                            type='submit'>Save</button>
                                    </div>
                                </div>

                            </form>
                        </div>

                    </div>
                )}
            </>
        )
    }

    export default Subcategories;
