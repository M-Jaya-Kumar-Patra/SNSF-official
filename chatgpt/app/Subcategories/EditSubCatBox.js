import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useAlert } from '../context/AlertContext';
import { useCat } from '../context/CategoryContext';
import { useAuth } from '../context/AuthContext';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { editData } from '@/utils/api';
import { deleteCategory } from '@/utils/api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const EditSubCatBox = (props) => {


    const { getCategories } = useCat()
    const alert = useAlert()



    const [editMode, setEditMode] = useState(false);
    const [selectVal, setSelectVal] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [categs, setCategs] = useState([
        {
            name: "",
            parentCatName: "",
            parentId: ""
        }
    ]);

    useEffect(() => {
        setCategs({
            name: props?.name || "",
            parentCatName: props?.selectedCatName || "",
            parentId: props?.selectedCat || ""
        });

        setSelectVal(props?.selectedCat || "");
    }, []);



    const onChangeInput = (e) => {
        const { name, value } = e.target;

        setCategs((prevFields) => ({
            ...prevFields,
            [name]: value
        }));
    };


    const handleChange = (event) => {
        setSelectVal(event.target.value);
        categs.parentId = event.target.value;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)


        // const { name, parentCatName, parentId } = categs;
        if (categs.name === "") {
            alert.alertBox({ type: "error", msg: "Please enter category name" });
            setIsLoading(false);
            return;
        }

        editData(`/api/category/${props.id}`, categs)
            .then((response) => {
                setTimeout(() => {
                    alert.alertBox({ type: "success", msg: "Category updated successfully!" });
                    getCategories();
                    setIsLoading(false)
                    setEditMode(false)
                }, 1000)
            })
            .catch((error) => {
                setIsLoading(false);
                alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
            });
    }


    const handleDeleteCategory = () => {
        deleteCategory(`/api/category/${props.id}`).then((response) => {
            alert.alertBox({ type: "success", msg: "Category deleted successfully!" });
            getCategories();
        })
            .catch((error) => {
                alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
            });

    }

    const [open, setOpen] = useState(false);
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

    
    return (
        <>
            <form className='w-100 flex items-center gap-3 p-0 px-4 pl-8  ' onSubmit={handleSubmit}>

                {
                    editMode === true &&
                    <>
                        <div className='flex items-center justify-between py-2 gap-4'>
                            <div className='w-[150px]'>
                                <Select
                                    style={{ zoom: '75%' }}
                                    className='w-full'
                                    size="small"
                                    value={selectVal}
                                    onChange={(e) => handleChange(e)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {props?.catData?.length > 0 &&
                                        props.catData.map((item, index) => (
                                            <MenuItem value={item._id} key={index}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                </Select>


                            </div>
                            <input
                                type="text"
                                className="w-full h-[30px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                                name="name"
                                value={categs?.name}
                                onChange={onChangeInput}
                            />


                            <div className="flex items-center gap-2">
                                <Button
                                    size="small"
                                    className="btn-sm"
                                    type="submit"
                                    variant="contained"
                                >
                                    {isLoading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : (
                                        "Edit"
                                    )}
                                </Button>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </Button>
                            </div>


                        </div>
                    </>
                }



                {
                    editMode === false &&
                    <>
                        <span className='font-semibold font-sans text-[18px] '>{props?.name}</span>
                        <div className='flex items-center ml-auto gap-0'>
                            <Button className=' !w-[35px] !h-[35px]  !rounded-full  !text-blue-700'
                                onClick={() => {
                                    setEditMode(true);
                                }}>
                                <ModeEditOutlineIcon className='!w-[20px] !h-[20px]' />
                            </Button>
                            <Button className=' !w-[35px] !h-[35px] !rounded-full  !text-red-600'
                                onClick={(e) => {
                                    handleClickOpenDeleteAlert(e, props?.id)
                                }}>
                                <MdDeleteOutline className='!w-[20px] !h-[20px]' />
                            </Button>
                        </div>
                    </>
                }



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

            </form>

        </>
    )
}

export default EditSubCatBox
