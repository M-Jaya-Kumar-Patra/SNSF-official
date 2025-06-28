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
import { postData, deleteImages, deleteProduct, deleteMultipleData } from '@/utils/api';
import { useAlert } from '../context/AlertContext';

import { useEffect } from 'react';


const Products = () => {


    const [formFields, setFormFields] = useState({
        name: "",
        productId: "",
        description: "",
        images: [],
        brand: "",
        price: "",
        oldPrice: "",
        catName: "",
        catId: "",
        subCatId: "",
        subCat: "",
        thirdSubCat: "",
        thirdSubCatId: "",
        countInStock: "",
        sales: "",
        rating: "",
        isFeatured: false,
        discount: "",
        size: [],
        location: "",
        delivery_days: "",
        callOnlyDelivery: false,
        specifications: {
            material: "",
            setOf: "",
            grade: "",
            fabric: "",
            fabricColor: "",
            size: "",
            weight: "",
            height: "",
            warranty: "",
            thickness: "",
            length: "",
            width: "",
            polish: "",
            frameMaterial: ""
        }
    });


    const [editProduct, setEditProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const { prdData, setPrdData, getProductsData, loading, setLoading } = usePrd();
    const { catData } = useCat();
    const alert = useAlert();

    const [isLoading, setIsLoading] = useState(false);


    const [age, setAge] = React.useState('');

    const [sortedIds, setSortedIds] = useState([]);





    const [addProduct, setAddProduct] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const handleAddClick = () => {
        setFormFields({
            name: "",
            productId: "",
            description: "",
            images: [],
            brand: "",
            price: "",
            oldPrice: "",
            catName: "",
            catId: "",
            subCatId: "",
            subCat: "",
            thirdSubCat: "",
            thirdSubCatId: "",
            countInStock: "",
            sales: "",
            rating: "",
            isFeatured: false,
            discount: "",
            size: [],
            location: "",
            delivery_days: "",
            callOnlyDelivery: false,
            specifications: {
                material: "",
                setOf: "",
                grade: "",
                fabric: "",
                fabricColor: "",
                size: "",
                weight: "",
                height: "",
                warranty: "",
                thickness: "",
                length: "",
                width: "",
                polish: "",
                frameMaterial: ""
            }
        });
        setPreviews([]);
        setShowAddModal(true);
    };

    const [previews, setPreviews] = useState([]);

    const setPreviewsFun = (previewsArr) => {
        setPreviews(previewsArr)
        setFormFields((prev) => ({
            ...prev,
            images: previewsArr // ✅ set it in formFields
        }));

    }




    const [value, setValue] = useState(2);

    //////////
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


    const handleChangeAdd = (e) => {
        e.preventDefault();
        setFormFields({ ...formFields, [e.target.name]: e.target.value });


    }

    const handleSubmitAddForm = (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (!formFields.name || !formFields.catName || !formFields.subCat || !formFields.price) {
            alert.alertBox({ type: "error", msg: "Please fill all the required fields" });
            setIsLoading(false);
            return;
        }
        if (previews?.length === 0) {
            alert.alertBox({ type: "error", msg: "Please select product image" });
            setIsLoading(false);
            return;
        }
        postData("/api/product/create", formFields)
            .then((response) => {
                setIsLoading(false);
                if (!response.error) {
                    alert.alertBox({ type: "success", msg: "Product Created" });
                    setFormFields({
                        name: "",
                        productId: "",
                        description: "",
                        images: [],
                        brand: "",
                        price: "",
                        oldPrice: "",
                        catName: "",
                        catId: "",
                        subCatId: "",
                        subCat: "",
                        thirdSubCat: "",
                        thirdSubCatId: "",
                        countInStock: "",
                        sales: "",
                        rating: "",
                        isFeatured: "",
                        discount: "",
                        size: [],
                        location: "",
                        countInStock: ""
                    })
                    setPreviews([])
                    setShowAddModal(false)
                    getProductsData()
                } else {
                    alert.alertBox({ type: "error", msg: response.message || "Failed to create product" });
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.error("Post error:", error);
                alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
            });
    }

    const removeImage = async (image, index) => {
        const publicId = image.split("/").pop().split(".")[0]; // Extract public_id from URL
        console.log(previews, "previews")
        var imageArr = []
        imageArr = previews;
        console.log(image, "image")
        await deleteImages(`/api/product/deleteImg?img=${publicId}`).then((response) => {
            console.log(response)
            imageArr.splice(index, 1);


            setTimeout(() => {
                setPreviews(imageArr);
                setFormFields(previews => ({
                    ...previews,
                    images: imageArr
                })
                )
            }, 100)
            setPreviews([])
        })
    }


    //edit

    const [editPrdObj, setEditPrdObj] = useState(null)

    const handleClickEdit = (prdId, product) => {
        setShowEditModal(true);
        setEditProduct(prdId);
        setEditPrdObj({
            ...product,
            specifications: {
                material: "",
                setOf: "",
                grade: "",
                fabric: "",
                fabricColor: "",
                size: "",
                weight: "",
                height: "",
                warranty: "",
                thickness: "",
                length: "",
                width: "",
                polish: "",
                frameMaterial: "",
                ...(product.specifications || {})
            }
        });
        setPreviews(product.images || []);
    };



    const handleChangeEdit = (e) => {
        setEditPrdObj(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleSubmitEditForm = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...editPrdObj,
            specifications: editPrdObj.specifications || {},
            images: previews,
        };


        if (!editPrdObj.name || !editPrdObj.catName || !editPrdObj.subCat || !editPrdObj.price) {
            alert.alertBox({ type: "error", msg: "Please fill all the required fields" });
            setIsLoading(false);
            return;
        }
        if (previews?.length === 0) {
            alert.alertBox({ type: "error", msg: "Please select product image" });
            setIsLoading(false);
            return;
        }
        postData(`/api/product/updateProduct/${payload._id}`, payload)
            .then((response) => {
                setIsLoading(false);
                if (!response.error) {
                    alert.alertBox({ type: "success", msg: "Product Updated" });
                    setEditPrdObj(null);
                    setPreviews([]);
                    setShowEditModal(false);
                    getProductsData();
                } else {
                    alert.alertBox({ type: "error", msg: response.message || "Failed to update product" });
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.error("Post error:", error);
                alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
            });

    }

    const handleChangeEditInput = (e) => {
        setEditPrdObj(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleDeleteProduct = async (e, prdId) => {
        e.preventDefault();
        try {
            const response = await deleteProduct(`/api/product/${prdId}`, prdId)
            if (!response.error) {
                alert.alertBox({ type: "success", msg: "Product deleted" })
                // alert.alertBox({ type: "success", msg: "Product Created" });
                getProductsData()

            } else {
                alert.alertBox({ type: "error", msg: "Failed to delete product" })
            }
        } catch (error) {
            alert.alertBox({ type: "error", msg: "Network issue. Try later" || error.message })
        }
    }

    const deleteMultipleProduct = async () => {
        if (sortedIds.length === 0) {
            alert.alertBox({ type: "error", msg: "Please select items to delete" });
            return;
        }

        console.log(sortedIds)

        try {
            await deleteMultipleData(`/api/product/deleteMultiple`, { ids: sortedIds },
            ).then((response) => {
                console.log(response)
                getProductsData();
                alert.alertBox({ type: "success", msg: "Products deleted successfully" })
            })
        } catch (error) {
            alert.alertBox({ type: "error", msg: error.message || "Network issue. Try later" })

        }

    }

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        const updatedItems = prdData.map((item) => ({
            ...item,
            checked: isChecked
        }));
        setPrdData(updatedItems)

        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
            setSortedIds(ids)
        }
    }

    // Handler to toggle individual checkboxes
    const handleCheckBoxChange = (e, id, index) => {
        const updatedItems = prdData.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );

        setPrdData(updatedItems);

        // Update the sorted IDs state
        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);

        setSortedIds(selectedIds);

        console.log(selectedIds);
    };
    const [searchQuery, setSearchQuery] = useState('');




    const handleSpecificationsChangeAdd = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [name]: value,
            }
        }));
    };





    const handleSpecificationsChange = (e) => {
        const { name, value } = e.target;
        setEditPrdObj(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [name]: value,
            }
        }));
    };







    return (
        <>

            <div className="w-full flex justify-center">
                <div className='w-full   px-6'>
                    <div className='flex justify-between items-center   '>
                        <h1 className='text-blue-900 font-sans text-xl font-semibold p-4 pl-0 py-1 rounded-md my-3   '>
                            Manage Products
                        </h1>
                        <div className='flex gap-4'>
                            {sortedIds?.length !== 0 && <button className='bg-red-600 text-white px-3 rounded-md' onClick={deleteMultipleProduct}>Delete </button>}
                            <button className='w-auto h-auto p-2 py-1 pr-3 rounded-md  bg-green-800 flex items-center gap-1 ' onClick={() => handleAddClick()}><AddIcon />Add New Product</button>
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
                                <th className='w-[55px]'><Checkbox size='small'
                                    checked={prdData?.length > 0 ? prdData.every((item) => item.checked) : false}
                                    onChange={handleSelectAll}

                                /></th>
                                <th className='text-black w-[100px] '>Product</th>
                                <th className='text-black w-[20%] '>Name</th>
                                <th className='text-black w-[16%]'>Category</th>
                                <th className='text-black w-[16%]'>Sub Category</th>
                                <th className='text-black w-[12%]'>Price</th>
                                <th className='text-black w-[10%] '>Sales</th>
                                <th className='text-black w-[10%]'>Actions</th>
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
                                Array.isArray(prdData) &&
                                prdData.length > 0 &&
                                prdData
                                    .filter((prd) => {
                                        const name = prd?.name?.toLowerCase() || '';
                                        const category = prd?.catName?.toLowerCase() || '';
                                        const subCategory = prd?.subCat?.toLowerCase() || '';
                                        return (
                                            name.includes(searchQuery.toLowerCase()) ||
                                            category.includes(searchQuery.toLowerCase()) ||
                                            subCategory.includes(searchQuery.toLowerCase())
                                        );
                                    })
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse()
                                    .map((prd, index) => (
                                        <tr key={index} className="border-b border-slate-300">
                                            <td className="w-[55px]">
                                                <Checkbox
                                                    size="small"
                                                    checked={!!prd.checked}
                                                    onChange={(e) => handleCheckBoxChange(e, prd._id, index)}
                                                />
                                            </td>
                                            <td className="text-black flex items-center justify-center">
                                                {Array.isArray(prd.images) && prd.images.length > 0 ? (
                                                    <Image
                                                        src={prd.images[0]}
                                                        alt={`${prd.name || 'Product image'} 1`}
                                                        width={100}
                                                        height={100}
                                                        className="my-2"
                                                    />
                                                ) : (
                                                    <div className="w-[100px] h-[100px] bg-gray-200 text-xs flex items-center justify-center text-gray-600">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-black">{prd.name}</td>
                                            <td className="text-black">{prd.catName}</td>
                                            <td className="text-black">{prd.subCat}</td>
                                            <td className="text-black">{prd.price}</td>
                                            <td className="text-black">{prd.sales}</td>
                                            <td className="text-black">
                                                <ModeEditOutlineIcon
                                                    onClick={() => handleClickEdit(prd._id, prd)}
                                                    className="text-blue-600 cursor-pointer mr-4 active:bg-gray-200 rounded-full"
                                                />
                                                <DeleteOutlineIcon
                                                    className="text-red-600 cursor-pointer active:bg-gray-200 rounded-full"
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
                        count={prdData?.length || 0}
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
                        handleDeleteProduct(e, selectedProductId),
                            setOpen(false);
                    }} autoFocus color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {showEditModal && editProduct && (
                <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                    <div className='w-[700px] h-[90%] bg-white rounded-md text-black p-6 py-3 overflow-auto scrollbar-hide'>
                        <form onSubmit={handleSubmitEditForm}>

                            <div className="text-blue-800  text-xl border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center" onClick={() => setShowEditModal(false)}>
                                <ArrowBackIcon
                                    onClick={() => setShowEditModal(false)}
                                    className='cursor-pointer text-black'
                                />
                                Edit Product
                            </div>

                            <div >
                                <div className="text-black my-3 font-sans font-semibold">Upload product images</div>
                                {/* image update */}
                                <div className="grid grid-cols-4 gap-4">
                                    {Array.isArray(previews) && previews.length > 0 &&
                                        previews.map((image, index) => (
                                            <div className="uploadBoxWrappper relative" key={`${image}-${index}`}
                                            >
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
                                        multiple={true}
                                        name="images"
                                        url="/api/product/uploadImages"
                                        setPreviewsFun={setPreviewsFun}
                                    />
                                </div>

                                <Box
                                    component="div"
                                    noValidate
                                    autoComplete="on"
                                >
                                    <div className='grid grid-cols-1 gap-4 my-4'>
                                        <TextField
                                            required
                                            label="Product Name"
                                            onChange={handleChangeEditInput}
                                            value={editPrdObj?.name || ""}
                                            size="small"
                                            name='name'
                                        />
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            label="Description"
                                            multiline
                                            maxRows={4}
                                            onChange={handleChangeEditInput}
                                            value={editPrdObj?.description || ""}
                                            size="small"
                                            name='description'
                                        />
                                        <div className="grid grid-cols-3 gap-4">

                                            <div className="w-[100%] flex items-center ">
                                                <FormControl className="w-[100%]  " >
                                                    <InputLabel id="demo-simple-select-helper-label">Category</InputLabel>
                                                    <Select
                                                        name="catName"
                                                        size='small'
                                                        label="Category"
                                                        value={editPrdObj?.catName || ''}
                                                        onChange={(e) => {
                                                            const selectedName = e.target.value;
                                                            const selectedItem = catData.find((item) => item.name === selectedName);
                                                            if (selectedItem) {
                                                                setEditPrdObj(prev => ({
                                                                    ...prev,
                                                                    catName: selectedItem.name,
                                                                    catId: selectedItem._id,
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        {catData.map((item) => (
                                                            <MenuItem key={item._id} value={item.name}>
                                                                {item.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>


                                                </FormControl>

                                            </div>

                                            <div className='w-full'>
                                                <FormControl className='w-full'>
                                                    <InputLabel id="demo-simple-select-helper-label" >Sub Category</InputLabel>
                                                    <Select
                                                        name="subCat"
                                                        size='small'
                                                        label="Sub Categoey"
                                                        value={editPrdObj?.subCat || ''}
                                                        onChange={(e) => {
                                                            const selectedName = e.target.value;
                                                            const selectedItem = catData.flatMap(p => p.children || []).find(child => child.name === selectedName);

                                                            if (selectedItem) {
                                                                setEditPrdObj(prev => ({
                                                                    ...prev,
                                                                    catName: selectedItem.name,
                                                                    catId: selectedItem._id,
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        {catData.flatMap((parent) =>
                                                            parent.children?.map((child) => (
                                                                <MenuItem key={child._id} value={child.name}>
                                                                    {child.name}
                                                                </MenuItem>
                                                            ))
                                                        )}
                                                    </Select>



                                                </FormControl>

                                            </div>

                                            <div className="w-[100%] flex items-center ">
                                                <FormControl className="w-[100%]  " >
                                                    <InputLabel id="demo-simple-select-helper-label">3Lv. Category</InputLabel>
                                                    <Select
                                                        name="thirdSubCat"
                                                        size='small'
                                                        label="3Lv. Category"
                                                        value={editPrdObj?.thirdSubCat || ''}
                                                        onChange={(e) => {
                                                            const selectedName = e.target.value;
                                                            const selectedItem = catData.flatMap(p => p.children || [])
                                                                .flatMap(c => c.children || [])
                                                                .find(g => g.name === selectedName);
                                                            if (selectedItem) {
                                                                setEditPrdObj(prev => ({
                                                                    ...prev,
                                                                    catName: selectedItem.name,
                                                                    catId: selectedItem._id,
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        {catData.flatMap(parent =>
                                                            parent.children?.flatMap(child =>
                                                                child.children?.map(grandChild => (
                                                                    <MenuItem key={grandChild._id} value={grandChild.name}>
                                                                        {grandChild.name}
                                                                    </MenuItem>
                                                                ))
                                                            )
                                                        )}
                                                    </Select>


                                                </FormControl>

                                            </div>
                                        </div>


                                        <div className="grid grid-cols-2 gap-4">

                                            <TextField
                                                required
                                                label="Price"
                                                value={editPrdObj?.price || ""}
                                                onChange={handleChangeEditInput}
                                                size="small"
                                                name='price'

                                            />
                                            <TextField
                                                label="Old Price"
                                                value={editPrdObj?.oldPrice || ""}
                                                onChange={handleChangeEditInput}
                                                size="small"
                                                name='oldPrice'

                                            />
                                            <TextField
                                                label="Is Featured"
                                                value={editPrdObj?.isFeatured || ""}
                                                onChange={handleChangeEditInput}
                                                size="small"
                                                name='isFeatured'

                                            />
                                            <TextField
                                                label="Product stock"
                                                value={editPrdObj?.countInStock || ""}
                                                onChange={handleChangeEditInput}
                                                size="small"
                                                name='countInStock'

                                            />
                                            <TextField
                                                label="Product brand"
                                                value={editPrdObj?.brand || ""}
                                                onChange={handleChangeEditInput}
                                                size="small"
                                                name='brand'

                                            />
                                            <TextField
                                                label="Product Discount"
                                                value={editPrdObj?.discount || ""}
                                                onChange={handleChangeEditInput}
                                                size="small"
                                                name='discount'

                                            />
                                            <TextField
                                                label="Product size"
                                                value={(editPrdObj.size && Array.isArray(editPrdObj.size)) ? editPrdObj.size.join(", ") : ""}
                                                onChange={(e) =>
                                                    setEditPrdObj(prev => ({
                                                        ...prev,
                                                        size: e.target.value
                                                            .split(",")
                                                            .map(s => s.trim())
                                                            .filter(s => s.length > 0)
                                                    }))
                                                }

                                                size="small"
                                                name="size"
                                            />

                                            <Box sx={{ '& > legend': {} }} className="flex gap-10  items-center border border-[#c4c4c4] hover:border-slate-600 rounded-[4px] px-3 ">
                                                <Typography component="legend" className='text-slate-500'>Rating</Typography>
                                                <Rating
                                                    name="rating"
                                                    value={editPrdObj?.rating || 0}
                                                    onChange={(event, newValue) => {
                                                        setEditPrdObj(prev => ({ ...prev, rating: newValue }));
                                                    }}

                                                />
                                            </Box>
                                        </div>

                                        {/* --- Specifications Section --- */}
                                        <div className="my-6">
                                            <h3 className="text-lg font-semibold mb-3">Product Specifications</h3>
                                            <div className="grid grid-cols-2 gap-4">

                                                <TextField
                                                    label="Material"
                                                    size="small"
                                                    name="material"
                                                    value={editPrdObj?.specifications?.material || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Set of"
                                                    size="small"
                                                    name="setOf"
                                                    value={editPrdObj?.specifications?.setOf || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Grade"
                                                    size="small"
                                                    name="grade"
                                                    value={editPrdObj?.specifications?.grade || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Delivery within"
                                                    size="small"
                                                    name="delivery_days"
                                                    value={editPrdObj?.specifications?.delivery_days || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Call only Booking"
                                                    size="small"
                                                    name="callOnlyDelivery"
                                                    value={editPrdObj?.specifications?.callOnlyDelivery || false}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Fabric"
                                                    size="small"
                                                    name="fabric"
                                                    value={editPrdObj?.specifications?.fabric || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Fabric Color"
                                                    size="small"
                                                    name="fabricColor"
                                                    value={editPrdObj?.specifications?.fabricColor || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Size"
                                                    size="small"
                                                    name="size"
                                                    value={editPrdObj?.specifications?.size || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Weight"
                                                    size="small"
                                                    name="weight"
                                                    value={editPrdObj?.specifications?.weight || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Height"
                                                    size="small"
                                                    name="height"
                                                    value={editPrdObj?.specifications?.height || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Warranty"
                                                    size="small"
                                                    name="warranty"
                                                    value={editPrdObj?.specifications?.warranty || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Thickness"
                                                    size="small"
                                                    name="thickness"
                                                    value={editPrdObj?.specifications?.thickness || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Length"
                                                    size="small"
                                                    name="length"
                                                    value={editPrdObj?.specifications?.length || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Width"
                                                    size="small"
                                                    name="width"
                                                    value={editPrdObj?.specifications?.width || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Polish"
                                                    size="small"
                                                    name="polish"
                                                    value={editPrdObj?.specifications?.polish || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />
                                                <TextField
                                                    label="Frame Material"
                                                    size="small"
                                                    name="frameMaterial"
                                                    value={editPrdObj?.specifications?.frameMaterial || ""}
                                                    onChange={(e) => handleSpecificationsChange(e)}
                                                />

                                            </div>
                                        </div>


                                    </div>

                                </Box>

                                <div className="relative w-full flex gap-2 right-0  justify-end ">
                                    <button className=' bg-white border border-black py-1  w-[90px] text-lg rounded-full hover:bg-red-500 hover:border-none hover:text-white font-medium' onClick={() => {
                                        setShowEditModal(false)
                                        setPreviews([])
                                    }}>Cancel</button>
                                    <button className=' bg-blue-700  py-1  w-[90px] text-lg rounded-full hover:bg-blue-500 hover:border-none text-white  font-medium' type='submit'>Save</button>
                                </div>
                            </div>





                        </form>
                    </div>
                </div>

            )}
            {showAddModal && (
                <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'>
                    <div className='w-[700px] h-[90%] bg-white rounded-md text-black py-3 px-6 overflow-auto scrollbar-hide'>

                        <form onSubmit={handleSubmitAddForm}>
                            <div className="text-green-800  text-xl  border-b-2 border-slate-300 py-2 font-sans font-semibold flex gap-2 items-center"><ArrowBackIcon onClick={() => setShowAddModal(false)} className='cursor-pointer text-black' />Add Product</div>

                            <div className="text-black my-3 font-sans font-semibold">Upload product images</div>
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
                                    multiple={true}
                                    name="images"
                                    url="/api/product/uploadImages"
                                    setPreviewsFun={setPreviewsFun}
                                />
                            </div>


                            <div className='grid grid-cols-1 gap-4'>
                                <TextField
                                    required
                                    label="Product Name"
                                    onChange={handleChangeAdd}
                                    value={formFields?.name || ""}
                                    size="small"
                                    name='name'
                                />
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Description"
                                    multiline
                                    maxRows={4}
                                    onChange={handleChangeAdd}
                                    value={formFields?.description || ""}
                                    size="small"
                                    name='description'
                                />
                                <div className="grid grid-cols-3 gap-4">

                                    <div className="w-[100%] flex items-center ">
                                        <FormControl className="w-[100%]  " >
                                            <InputLabel id="demo-simple-select-helper-label">Category</InputLabel>
                                            <Select
                                                name="catName"
                                                size='small'
                                                label="Category"
                                                value={formFields.catName || ''}
                                                onChange={(e) => {
                                                    const selectedName = e.target.value;
                                                    const selectedItem = catData.find((item) => item.name === selectedName);
                                                    if (selectedItem) {
                                                        setFormFields(prev => ({
                                                            ...prev,
                                                            catName: selectedItem.name,
                                                            catId: selectedItem._id
                                                        }));
                                                    }
                                                }}
                                            >
                                                {catData?.map((item) => (
                                                    <MenuItem key={item._id} value={item.name}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>


                                        </FormControl>

                                    </div>

                                    <div className='w-full'>
                                        <FormControl className='w-full'>
                                            <InputLabel id="demo-simple-select-helper-label" >Sub Category</InputLabel>
                                            <Select
                                                name="subCat"
                                                size='small'
                                                label="Sub Categoey"
                                                value={formFields.subCat || ''}
                                                onChange={(e) => {
                                                    const selectedName = e.target.value;
                                                    let selectedItem;
                                                    catData.forEach(parent => {
                                                        parent?.children?.forEach(child => {
                                                            if (child.name === selectedName) selectedItem = child;
                                                        });
                                                    });
                                                    if (selectedItem) {
                                                        setFormFields(prev => ({
                                                            ...prev,
                                                            subCat: selectedItem.name,
                                                            subCatId: selectedItem._id
                                                        }));
                                                    }
                                                }}
                                            >
                                                {catData.flatMap((parent) =>
                                                    parent.children?.map((child) => (
                                                        <MenuItem key={child._id} value={child.name}>
                                                            {parent.name} / {child.name}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>



                                        </FormControl>

                                    </div>

                                    <div className="w-[100%] flex items-center ">
                                        <FormControl className="w-[100%]  " >
                                            <InputLabel id="demo-simple-select-helper-label">3Lv. Category</InputLabel>
                                            <Select
                                                name="thirdSubCat"
                                                size='small'
                                                label="3Lv. Category"
                                                value={formFields.thirdSubCat || ''}
                                                onChange={(e) => {
                                                    const selectedName = e.target.value;
                                                    let selectedItem;
                                                    catData.forEach(parent => {
                                                        parent?.children?.forEach(child => {
                                                            child?.children?.forEach(grandChild => {
                                                                if (grandChild.name === selectedName) selectedItem = grandChild;
                                                            });
                                                        });
                                                    });

                                                    if (selectedItem) {
                                                        setFormFields(prev => ({
                                                            ...prev,
                                                            thirdSubCat: selectedItem.name,
                                                            thirdSubCatId: selectedItem._id
                                                        }));
                                                    }
                                                }}
                                            >
                                                {catData.flatMap(parent =>
                                                    parent.children?.flatMap(child =>
                                                        child.children?.map(grandChild => (
                                                            <MenuItem key={grandChild._id} value={grandChild.name}>
                                                                {parent.name} / {child.name} / {grandChild.name}
                                                            </MenuItem>
                                                        ))
                                                    )
                                                )}
                                            </Select>


                                        </FormControl>

                                    </div>
                                </div>


                                <div className="grid grid-cols-2 gap-4">

                                    <TextField
                                        required
                                        label="Price"
                                        value={formFields?.price || ""}
                                        onChange={handleChangeAdd}
                                        size="small"
                                        name='price'

                                    />
                                    <TextField
                                        label="Old Price"
                                        value={formFields?.oldPrice || ""}
                                        onChange={handleChangeAdd}
                                        size="small"
                                        name='oldPrice'

                                    />
                                    <TextField
                                        label="Is Featured"
                                        value={formFields?.isFeatured || ""}
                                        onChange={handleChangeAdd}
                                        size="small"
                                        name='isFeatured'

                                    />
                                    <TextField
                                        label="Product stock"
                                        value={formFields?.countInStock || ""}
                                        onChange={handleChangeAdd}
                                        size="small"
                                        name='countInStock'

                                    />
                                    <TextField
                                        label="Product brand"
                                        value={formFields?.brand || ""}
                                        onChange={handleChangeAdd}
                                        size="small"
                                        name='brand'

                                    />
                                    <TextField
                                        label="Product Discount"
                                        value={formFields?.discount || ""}
                                        onChange={handleChangeAdd}
                                        size="small"
                                        name='discount'

                                    />
                                    <TextField
                                        label="Product size"
                                        value={(formFields.size && Array.isArray(formFields.size)) ? formFields.size.join(", ") : ""}
                                        onChange={(e) =>
                                            setFormFields(prev => ({
                                                ...prev,
                                                size: e.target.value
                                                    .split(",")
                                                    .map(s => s.trim())
                                                    .filter(s => s.length > 0) // remove empty entries
                                            }))
                                        }
                                        size="small"
                                        name="size"
                                    />

                                    <Box sx={{ '& > legend': {} }} className="flex gap-10  items-center border border-[#c4c4c4] hover:border-slate-600 rounded-[4px] px-3 ">
                                        <Typography component="legend" className='text-slate-500'>Rating</Typography>
                                        <Rating
                                            name="rating"
                                            value={formFields.rating || 0}
                                            onChange={(event, newValue) => {
                                                setFormFields(prev => ({
                                                    ...prev,
                                                    rating: newValue
                                                }));
                                            }}
                                        />
                                    </Box>
                                </div>

                                {/* --- Specifications Section --- */}
                                <div className="my-6">
                                    <h3 className="text-lg font-semibold mb-3">Product Specifications</h3>
                                    <div className="grid grid-cols-2 gap-4">

                                        <TextField
                                            label="Material"
                                            size="small"
                                            name="material"
                                            value={formFields.specifications?.material || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Set of"
                                            size="small"
                                            name="setOf"
                                            value={formFields.specifications?.setOf || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Grade"
                                            size="small"
                                            name="grade"
                                            value={formFields.specifications?.grade || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Delivery within"
                                            size="small"
                                            name="delivery_days"
                                            value={formFields.specifications?.delivery_days || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Call only Booking"
                                            size="small"
                                            name="callOnlyDelivery"
                                            value={formFields.specifications?.callOnlyDelivery || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Fabric"
                                            size="small"
                                            name="fabric"
                                            value={formFields.specifications?.fabric || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Fabric Color"
                                            size="small"
                                            name="fabricColor"
                                            value={formFields.specifications?.fabricColor || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Size"
                                            size="small"
                                            name="size"
                                            value={formFields.specifications?.size || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Weight"
                                            size="small"
                                            name="weight"
                                            value={formFields.specifications?.weight || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Height"
                                            size="small"
                                            name="height"
                                            value={formFields.specifications?.height || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Warranty"
                                            size="small"
                                            name="warranty"
                                            value={formFields.specifications?.warranty || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Thickness"
                                            size="small"
                                            name="thickness"
                                            value={formFields.specifications?.thickness || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Length"
                                            size="small"
                                            name="length"
                                            value={formFields.specifications?.length || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Width"
                                            size="small"
                                            name="width"
                                            value={formFields.specifications?.width || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Polish"
                                            size="small"
                                            name="polish"
                                            value={formFields.specifications?.polish || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />
                                        <TextField
                                            label="Frame Material"
                                            size="small"
                                            name="frameMaterial"
                                            value={formFields.specifications?.frameMaterial || ""}
                                            onChange={handleSpecificationsChangeAdd}
                                        />

                                    </div>
                                </div>


                            </div>


                            <div className="relative w-full flex gap-2 right-0  justify-end mt-4">
                                <button className=' bg-white border  py-1  w-[90px] text-lg rounded-full text-red-600 border-red-600 hover:shadow-md inset font-medium' onClick={() => {
                                    setShowAddModal(false)
                                    setPreviews([])
                                }
                                }>Cancel</button>
                                <button className=' bg-green-700  py-1  w-[90px] text-lg rounded-full hover:bg-green-600 hover:shadow-md hover:border-none text-white  font-medium' type='submit'>Save</button>
                            </div>
                        </form>





                    </div>
                </div>

            )}

        </>
    )
}

export default Products
