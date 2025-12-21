"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, CreditCard, Bell, Heart, LogOut } from "lucide-react";
import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { useAlert } from "@/app/context/AlertContext";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import {
  deleteUserAddress,
  getUserAddress,
  postData,
  updateUserAddress,
} from "@/utils/api";
import { CircularProgress } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { MdOutlineMessage } from "react-icons/md";
import { trackVisitor } from "@/lib/tracking";
import { useScreen } from "@/app/context/ScreenWidthContext";
import Skeleton from "@mui/material/Skeleton";
import AddressCardSkeleton from "@/components/AddressCardSkeleton";




const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const Account = () => {
  const router = useRouter();
  const alert = useAlert();
  const {
    isLogin,
    userData,
    setUserData,
    isLoading,
    isCheckingToken,
    setIsCheckingToken,
  } = useAuth();
  if (isCheckingToken)
    return <div className="text-center mt-10">Checking session...</div>;

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const [state, setState] = useState("");

  const [open, setOpen] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const { isSm, isMd, isLg, isXl } = useScreen();

  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
const [isDeliverable, setIsDeliverable] = useState(null);


  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pin: "",
    address: "",
    locality: "",
    landmark: "",
    city: "",
    state: "",
    altPhone: "",
    addressType: "Home",
  });

  useEffect(() => {
    if (!isLogin) {
      setIsCheckingToken(false);
      router.push("/login");
    } else {
      fetchAddresses();
    }
  }, [isLogin, router]);
  useEffect(() => {
    trackVisitor("address");
  }, []);

  const [addressArray, setaddressArray] = useState([
    {
      name: userData?.address_details?.name,
      phone: "",
      pin: "",
      address: "",
      locality: "",
      landmark: "",
      city: "",
      state: "",
      altPhone: "",
      addressType: "Home",
    },
  ]);

  const [editAddressObj, setEditAddressObj] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  if (isLoading) return <CircularProgress />;

  const fetchAddresses = async () => {
    try {
      const id = localStorage.getItem("userId");
      const response = await getUserAddress(`/api/user/getAddress/${id}`);
      setaddressArray(response.address_details);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  

  const handleChangeSelectInput = (event) => {
    setState(event.target.value);
  };

  const toggleEditDel = (index) => {
    const updatedState = [...showEditDelAddr];
    updatedState[index] = !updatedState[index];
    setShowEditDelAddr(updatedState);
  };

  const saveNewAddress = async (e) => {
    e.preventDefault();
    if (!address.name) {
      alert.alertBox("Please fill in all required fields.");
      return;
    }

    const userId = userData._id;

    const response = await postData("/api/user/addAddress", {
      ...address,
      userId,
    });
    if (!response.error) {
      alert.alertBox({ type: "success", msg: "Address saved" });
      setShowAddAddressForm(false);
      setIsDeliverable(response.deliverable);
      setShowDeliveryPopup(true);
      setAddress({
        name: "",
        phone: "",
        pin: "",
        address: "",
        locality: "",
        landmark: "",
        city: "",
        state: "",
        altPhone: "",
        addressType: "Home",
      });
      fetchAddresses();
    } else {
      alert.alertBox({
        type: "error",
        msg: "Failed to save address.Please retry or reload the page",
      });
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const handleClickOpenDeleteAlert = (e, addressId) => {
    e.preventDefault();
    setSelectedAddressId(addressId);
    setOpen(true);
  };

  const handleCloseDeleteAlert = () => {
    setOpen(false);
    setSelectedAddressId(null);
  };

  const deleteAddress = async (e, addressId) => {
    e.preventDefault();
    const id = userData._id;

    setaddressArray((prev) => prev.filter((addr) => addr._id !== addressId));

    try {
      const response = await deleteUserAddress(
        `/api/user/${id}/address/${addressId}`
      );

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Deleted Successfully" });
      } else {
        alert.alertBox({ type: "error", msg: "Failed to delete on server" });
        fetchAddresses();
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: "Server error during delete" });
      fetchAddresses();
    }
  };

  const toggleEditAddress = (e, addressObj) => {
    e.preventDefault();
    setEditAddressObj(addressObj);
    setShowEditModal(true);
  };

  const handleSaveEditedAddress = async (e) => {
    e.preventDefault();
    try {
      const id = userData._id;
      const addressId = editAddressObj._id;
      const response = await updateUserAddress(
        `/api/user/${id}/address/${addressId}`,
        editAddressObj
      );

      if (!response.error) {
        setShowEditModal(false);
        if (response.pinChanged) {
          setIsDeliverable(response.deliverable);
          setShowDeliveryPopup(true);
        }
        fetchAddresses();
      } else {
        alert.alertBox({ type: "error", msg: "Failed to update address" });
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: "Server error during update" });
    }
  };

  const handleUpdateAddressChange = (e) => {
    setEditAddressObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("/upload/")) return url;
    return url.replace("/upload/", "/upload/w_140,h_140,c_fill,f_auto,q_90/");
  };

  const formatAddress = (address) => {
  if (!address) return "";

  const line = [
    address.locality,
    address.city,
    address.state,
  ]
    .filter(Boolean)
    .join(", ");

  return address.pin ? `${line} - ${address.pin}` : line;
};




  return (
    <>
      <div className="flex w-full min-h-screen justify-center bg-slate-100">
        <div
          className={`w-full sm:w-[1020px]   ${
            isMd ? "my-8" : "sm:my-3"
          } !mx-auto sm:flex justify-between gap-3 `}
        >
          {/* Left Sidebar */}
          <div className="hidden sm:block left h-full">
            <div className="w-[256px] bg-white shadow-lg pb-5 pt-6 px-5   gap-3 flex flex-col justify-center items-center ">
              <Image
                className="h-[140px] w-[140px] rounded-full object-cover"
                src={
                  getOptimizedCloudinaryUrl(userData?.avatar) ||
                  "/images/account.png"
                }
                alt="User Profile"
                width={140}
                height={140}
                loading="lazy"
              />

              <h1 className="text-black font-sans font-semibold overflow-x-auto scrollbar-hide card-title">
                {userData?.name}
              </h1>
            </div>

            <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
              <ul className="text-gray-600 font-sans">
                <li>
                  <Link href="/enquires">
                    <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                      <MdOutlineMessage size={18} /> My Enquries
                    </div>
                  </Link>
                </li>
                <li>
                  <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2">
                    <User size={18} /> Account Settings
                  </div>
                </li>
                <li>
                  <Link href="/profile">
                    <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer active:bg-slate-100">
                      Profile Information
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/address">
                    <div className="h-[40px] flex items-center pl-10 font-semibold  border  border-l-8 border-y-0 border-r-0 border-indigo-950 cursor-pointer  text-indigo-950 bg-slate-100 active:bg-slate-100">
                      Manage Address
                    </div>
                  </Link>
                </li>
                {/* <li>
                                    <Link href="/payments">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <CreditCard size={18} /> Payments
                                        </div>
                                    </Link>
                                </li> */}
                <li>
                  <Link href="/notifications">
                    <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2  active:bg-slate-100">
                      <Bell size={18} /> Notifications
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist">
                    <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                      <Heart size={18} /> Wishlist
                    </div>
                  </Link>
                </li>
                <li>
                  <div>
                    <LogoutBTN className={"!pl-5"} />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Profile Section */}
          <div className="right h-full w-full lg:w-[750px] bg-slate-100 sm:bg-white shadow-xl sm:p-6">
            <div className="mb-2 sm:border-b border-gray-200   py-2 pl-3 sm:py-0 sm:pl-0 sm:pb-4 bg-white">
              <h2 className="section-title ">Manage Addresses</h2>
            </div>

            <div className="p-2 sm:px-0 min-h-[90vh] bg-white">
              {!showAddAddressForm && (
                <button
                  onClick={() => setShowAddAddressForm(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-indigo-900 bg-indigo-950 text-white text-sm font-medium shadow-sm hover:bg-indigo-900 hover:shadow-md transition duration-200"
                >
                  <IoMdAdd className="text-base sm:text-lg" />
                  Add Address
                </button>
              )}
              {isLoading ? (
  Array.from({ length: 2 }).map((_, i) => (
    <AddressCardSkeleton key={i} />
  ))
) : addressArray.length > 0 ? (
  addressArray
    .slice()
    .reverse()
    .map((address, index) => (
      <div
        key={index}
        className="border p-3 sm:p-5 my-2 sm:my-4 rounded-md sm:rounded-xl shadow-md bg-white flex justify-between hover:shadow-lg transition duration-300"
      >
        <div>
          <h3 className="text-md sm:text-lg font-bold text-black mb-[2px] sm:mb-1">
            {address?.name}
          </h3>

          <p className="text-gray-800 text-sm sm:text-md mb-[2px] sm:mb-1">
            {address.address}
          </p>

          <p className="text-gray-700 text-sm sm:text-md mb-[2px] sm:mb-1">
            {[address.locality, address.city, address.state]
              .filter(Boolean)
              .join(", ")}
            {address.pin && ` - ${address.pin}`}
          </p>

          <p className="text-gray-600 mb-[2px] sm:mb-1">
            Phone: {address.phone}
            {address.altPhone && ` | Alt: ${address.altPhone}`}
          </p>

          {address.landmark && (
            <p className="text-gray-500 italic mb-[2px] sm:mb-1">
              {address.landmark}
            </p>
          )}

          <p className="text-xs sm:text-sm text-gray-500">
            {address.addressType}
          </p>
        </div>

        <div className="flex gap-3 sm:gap-4 pr-1 sm:pr-2 pt-1">
          <button
            onClick={(e) => toggleEditAddress(e, address)}
            className="p-1 rounded transition hover:scale-105 active:scale-95"
          >
            <FaEdit size={18} className="text-gray-700" />
          </button>

          <button
            onClick={(e) =>
              handleClickOpenDeleteAlert(e, address._id)
            }
            className="p-1 rounded transition hover:scale-105 active:scale-95"
          >
            <MdDelete size={18} className="text-red-600" />
          </button>
        </div>
      </div>
    ))
) : (
                  <div className="flex flex-col items-center justify-center mt-20 text-center">
                    {/* Lottie Animation */}
                    <div className="w-[200px] sm:w-[260px] mb-4">
                      <DotLottieReact
                        src="https://lottie.host/809b66b0-6413-4599-8b83-250f2a2d4a5f/ck8wkMMQRM.lottie"
                        loop
                        autoplay
                      />
                    </div>

                    {/* Heading */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                      No Addresses Added
                    </h2>

                    {/* Subtext */}
                    <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-sm">
                      You haven’t added any addresses yet. Add a delivery address
                      to make your future orders faster and easier!
                    </p>
                  </div>
              )}
            </div>

            {showAddAddressForm && (
              <div className="fixed inset-0 z-[1000] flex justify-center items-start bg-black bg-opacity-50 overflow-y-auto">
                <div className="modal-form w-[850px] relative max-h-[90vh] my-9 p-5 rounded-md bg-white overflow-y-auto scrollbar-hide">
                  <div className="text-black  flex justify-between pb-2 border-b-2 border-slate-400 text-[23px] font-semibold">
                    Add address
                    <RxCross2
                      color="red"
                      size={30}
                      onClick={() => setShowAddAddressForm(false)}
                      className="cursor-pointer"
                    />
                  </div>

                  <form className="w-full mt-4 " onSubmit={saveNewAddress}>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div className="flex flex-col">
                        <TextField
                          label="Name"
                          required
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleAddressChange}
                          value={address.name}
                          name="name"
                        />
                        <TextField
                          label="Pincode"
                          required
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleAddressChange}
                          value={address.pin}
                          name="pin"
                        />
                      </div>
                      <div className="flex flex-col">
                        <TextField
                          label="Phone Number"
                          required
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleAddressChange}
                          value={address.phone}
                          name="phone"
                        />
                        <TextField
                          label="Locality"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleAddressChange}
                          value={address.locality}
                          name="locality"
                        />
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-1">
                      <TextField
                        required
                        id="outlined-multiline-flexible"
                        label="Address"
                        multiline
                        maxRows={4}
                        sx={{ m: 1, my: 1.5, width: "auto" }}
                        onChange={handleAddressChange}
                        value={address.address}
                        name="address"
                      />
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div className="flex flex-col">
                        <TextField
                          label="City/District"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleAddressChange}
                          value={address.city}
                          name="city"
                        />
                        <TextField
                          label="Landmark(Optional)"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleAddressChange}
                          value={address.landmark}
                          name="landmark"
                        />
                      </div>
                      <div className="flex flex-col">
                        <FormControl
                          sx={{ m: 1, my: 1.5, width: "auto", color: "red" }}
                        >
                          <InputLabel id="state-select-label">State</InputLabel>
                          <Select
                            labelId="state-select-label"
                            id="state"
                            value={address.state || ""}
                            name="state"
                            onChange={handleAddressChange}
                            input={<OutlinedInput label="State" />}
                            MenuProps={MenuProps}
                          >
                            {indianStates.map((state) => (
                              <MenuItem key={state} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          label="Alternate Phone (Optional)"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleAddressChange}
                          value={address.altPhone}
                          name="altPhone"
                        />
                      </div>
                    </div>
                    <div className="mx-2">
                      <FormControl className="text-black">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Address type
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="addressType"
                          onChange={handleAddressChange}
                        >
                          <FormControlLabel
                            value="Home"
                            control={<Radio />}
                            label="Home"
                            onChange={handleAddressChange}
                            name="addressType"
                          />
                          <FormControlLabel
                            value="work"
                            control={<Radio />}
                            label="Work"
                            onChange={handleAddressChange}
                            name="addressType"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>

                    <div className="flex justify-end mt-6 mr-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:shadow-md active:shadow-inner active:translate-y-[1px] transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-slate-900 hover:shadow-md active:shadow-inner active:translate-y-[1px] transition-all duration-200 font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <Dialog
              open={open}
              onClose={handleCloseDeleteAlert}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Confirm Delete"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this address?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDeleteAlert}
                  variant="outlined"
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    deleteAddress(e, selectedAddressId);
                    setOpen(false);
                  }}
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {showEditModal && (
              <div className="fixed inset-0 z-[1000] flex justify-center items-start bg-black bg-opacity-50 overflow-y-auto">
                <div className="modal-form w-[850px] relative max-h-[90vh] my-9 p-5 rounded-md bg-white overflow-y-auto scrollbar-hide">
                  <div className="text-black  flex justify-between pb-2 border-b-2 border-slate-400 text-[23px] font-semibold">
                    Edit address
                    <RxCross2
                      color="red"
                      size={30}
                      onClick={() => setShowEditModal(false)}
                      className="cursor-pointer"
                    />
                  </div>

                  <form
                    className="w-full mt-4 "
                    onSubmit={handleSaveEditedAddress}
                  >
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div className="flex flex-col">
                        <TextField
                          label="Name"
                          required
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleUpdateAddressChange}
                          value={editAddressObj?.name || ""}
                          name="name"
                        />
                        <TextField
                          label="Pincode"
                          required
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleUpdateAddressChange}
                          value={editAddressObj?.pin || ""}
                          name="pin"
                        />
                      </div>
                      <div className="flex flex-col">
                        <TextField
                          label="Phone Number"
                          required
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleUpdateAddressChange}
                          value={editAddressObj?.phone || ""}
                          name="phone"
                        />
                        <TextField
                          label="Locality"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleUpdateAddressChange}
                          value={editAddressObj?.locality || ""}
                          name="locality"
                        />
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-1">
                      <TextField
                        required
                        id="outlined-multiline-flexible"
                        label="Address"
                        multiline
                        maxRows={4}
                        sx={{ m: 1, my: 1.5, width: "auto" }}
                        onChange={handleUpdateAddressChange}
                        value={editAddressObj?.address || ""}
                        name="address"
                      />
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div className="flex flex-col">
                        <TextField
                          label="City/District"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleUpdateAddressChange}
                          value={editAddressObj?.city || ""}
                          name="city"
                        />
                        <TextField
                          label="Landmark(Optional)"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleUpdateAddressChange}
                          value={editAddressObj?.landmark || ""}
                          name="landmark"
                        />
                      </div>
                      <div className="flex flex-col">
                        <FormControl sx={{ m: 1, my: 1.5, width: "auto" }}>
                          <InputLabel id="state-select-label">State</InputLabel>
                          <Select
                            labelId="state-select-label"
                            id="state"
                            value={editAddressObj?.state || ""}
                            name="state"
                            onChange={handleUpdateAddressChange}
                            input={<OutlinedInput label="State" />}
                            MenuProps={MenuProps}
                          >
                            {indianStates.map((state) => (
                              <MenuItem key={state} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          label="Alternate Phone (Optional)"
                          variant="outlined"
                          sx={{ m: 1, my: 1.5, width: "auto" }}
                          onChange={handleUpdateAddressChange}
                          value={editAddressObj?.altPhone || ""}
                          name="altPhone"
                        />
                      </div>
                    </div>

                    <div className="mx-2">
                      <FormControl className="text-black">
                        <FormLabel>Address type</FormLabel>
                        <RadioGroup
                          row
                          name="addressType"
                          value={editAddressObj?.addressType || "Home"}
                          onChange={handleUpdateAddressChange}
                        >
                          <FormControlLabel
                            value="Home"
                            control={<Radio />}
                            label="Home"
                          />
                          <FormControlLabel
                            value="Work"
                            control={<Radio />}
                            label="Work"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div className="flex justify-end mt-6 mr-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:shadow-md active:shadow-inner active:translate-y-[1px] transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-slate-900 hover:shadow-md active:shadow-inner active:translate-y-[1px] transition-all duration-200 font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showDeliveryPopup && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
    <div className="w-[90%] sm:w-[420px] bg-white rounded-xl shadow-2xl p-6 text-center">

      <div
        className={`mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full ${
          isDeliverable ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <span className={`text-3xl font-bold ${
          isDeliverable ? "text-green-600" : "text-red-600"
        }`}>
          {isDeliverable ? "✓" : "✕"}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        {isDeliverable
          ? "Delivery Available 🎉"
          : "Delivery Not Available"}
      </h2>

      <p className="text-gray-600 mt-2 text-sm">
        {isDeliverable
          ? "Good news! We deliver furniture to this address."
          : "Sorry, we currently do not deliver to this pincode."}
      </p>

      <button
        onClick={() => setShowDeliveryPopup(false)}
        className={`mt-6 w-full py-2 rounded-lg font-medium text-white ${
          isDeliverable
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-700 hover:bg-gray-800"
        }`}
      >
        OK, Got it
      </button>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
