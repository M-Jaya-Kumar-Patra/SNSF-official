"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Auth & Session
import { useAuth } from "@/app/context/AuthContext";
import { useAlert } from "@/app/context/AlertContext";

// UI Components
import Navbar from "@/components/Navbar";
import LogoutBTN from "@/components/LogoutBTN";
import FilledAlerts from "@/components/FilledAlerts";
import PaymentProcessing from "../(ack)/PaymentProcessing";

// API Functions
import {
  getUserAddress,
  postData,
  updateUserAddress,
  deleteUserAddress,
  deleteData
} from "@/utils/api";

// MUI Components
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";

// Icons
import {
  User,
  Package,
  CreditCard,
  Bell,
  Heart,
  LogOut
} from "lucide-react";
import { IoMdAdd } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// UUID
import { FaLocationDot } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useOrders } from "../context/OrdersContext";
import { Description } from "@mui/icons-material";
import Image from "next/image";





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
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];



const Page = () => {
  const alert = useAlert()
  const router = useRouter()
  const { userData, setUserData, isLogin } = useAuth();



  const [ShowAddressChoice, setShowAddressChoice] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);





  const { buyNowItem, getCartItems } = useCart("");
  const { getOrdersItems } = useOrders()

  const [itemsToCheckout, setItemsToCheckout] = useState([]);


  const [fromCart, setFromCart] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!itemsToCheckout) {
      router.push("/cart")
    }
  }, [itemsToCheckout, router])


  useEffect(() => {
  if (!Array.isArray(buyNowItem)) {
    setFromCart(false);
  }

  const normalizedItems = Array.isArray(buyNowItem) ? buyNowItem : [buyNowItem];
  setItemsToCheckout(normalizedItems);

  console.log("Normalized items:", normalizedItems);
}, [buyNowItem, setFromCart, setItemsToCheckout]);


  useEffect(() => {
    console.log("Updated itemsToCheckout:", itemsToCheckout); // updates after setState
  }, [itemsToCheckout]);



  const [showAddAddressForm, setShowAddAddressForm] = useState(false);


  const handleSetShippingAddress = (e, address) => {
    e.preventDefault()
    setSelectedAddressId(address)
  }


  const toggleAddressSelectButton = () => {
    setShowAddressChoice((prev) => !prev);
  };



  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pin: "",
    address: "",
    locality: "",
    landmark: "",
    city: "",
    state: "",
    altPhone: "", // default country if you're only shipping within India
    addressType: "Home", // default value: Home / Work / Other
  });
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
      altPhone: "", // default country if you're only shipping within India
      addressType: "Home", // default value: Home / Work / Other
    }
  ])




  const fetchAddresses = async () => {
    try {
      const id = localStorage.getItem("userId")
      const response = await getUserAddress(`/api/user/getAddress/${id}`,);
      console.log(response);
      console.log(response.address_details);
      setaddressArray(response.address_details);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };
  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
    } else {
      getCartItems();
    }
  }, [isLogin, getCartItems, router]);



  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id && id !== "undefined" && id !== "null") {
      fetchAddresses();
    } else {
      console.warn("Invalid or missing userId in localStorage");
    }
  }, []);

  const [state, setState] = useState('');



  const [showEditModal, setShowEditModal] = useState(false)


  const saveNewAddress = async (e) => {
    e.preventDefault();
    if (
      !address.name
    ) {
      alert.alertBox("Please fill in all required fields.");
      return;
    }

    const userId = userData._id; // or however you get the logged-in user ID



    const response = await postData("/api/user/addAddress", {
      ...address,
      userId,
    });
    if (!response.error) {
      alert.alertBox({ type: "success", msg: "Address saved" })
      setShowAddAddressForm(false)
      setAddress({
        name: "",
        phone: "",
        pin: "",
        address: "",
        locality: "",
        landmark: "",
        city: "",
        state: "",
        altPhone: "", // default country if you're only shipping within India
        addressType: "Home", // default value: Home / Work / Other
      })
      fetchAddresses();

    } else {
      alert.alertBox({ type: "error", msg: "Failed to save address.Please retry or reload the page" })
    }

    // const newAddress = { ...address, id: uuidv4() };
    // if (newAddress !== null) {
    //     const updatedAddressArray = [...addressArray, newAddress];

    //     setaddressArray(updatedAddressArray);
    //     localStorage.setItem("addresses", JSON.stringify(updatedAddressArray));
    //     setShowAddressForm(false)
  }




  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }


  const handleEditChange = (e) => {

    setEditAddress({ ...editAddress, [e.target.name]: e.target.value });
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const [open, setOpen] = React.useState(false);


  const [totalAmount, setTotalAmount] = useState();



  useEffect(() => {
    setTotalAmount(
      itemsToCheckout?.length !== 0 ?
        itemsToCheckout?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) =>
          total + value, 0) : 0)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' }
          );
  }, [itemsToCheckout])





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






    // Optimistically remove from UI
    setaddressArray(prev => prev.filter(addr => addr._id !== addressId));

    try {
      const response = await deleteUserAddress(`/api/user/${id}/address/${addressId}`);

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Deleted Successfully" });
        // Optional: re-fetch if needed for consistency

        // fetchAddresses();
      } else {
        alert.alertBox({ type: "error", msg: "Failed to delete on server" });
        // Rollback if deletion failed
        fetchAddresses();
      }
    } catch (err) {
      alert.alertBox({ type: "error", msg: "Server error during delete" });
      fetchAddresses(); // Fallback to ensure consistency
    }
  };

  const [editAddressObj, setEditAddressObj] = useState(null);

  const toggleEditAddress = (e, addressObj) => {
    e.preventDefault();
    setEditAddressObj(addressObj);  // ✅ load all fields to edit
    setShowEditModal(true);         // ✅ open the modal
  };

  const handleSaveEditedAddress = async (e) => {

    e.preventDefault();
    try {
      const id = userData._id;
      const addressId = editAddressObj._id;
      const response = await updateUserAddress(`/api/user/${id}/address/${addressId}`, editAddressObj);

      if (!response.error) {
        alert.alertBox({ type: "success", msg: "Address updated" });
        setShowEditModal(false);
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
      [e.target.name]: e.target.value
    }));
  };


  const removeItemFromOrders = useCallback((e, productIdToRemove) => {
  e.preventDefault();

  setItemsToCheckout((prevItems) =>
    prevItems.filter((item) => item.productId !== productIdToRemove)
  );
}, []);

  useEffect(() => {

  }, [removeItemFromOrders])








  // deleteItem(`/api/order/deleteItem`, { _id, productId }).then((res) => {
  //   if (!res.error) {
  //     alert.alertBox({ type: "success", msg: res.message });
  //     getOrdersItems();

  //     // Remove productId from userData.shopping_cart manually
  //     setUserData({
  //       ...userData,
  //       orders: userData.orders.filter(id => id !== productId)
  //     });

  //   } else {
  //     alert.alertBox({ type: "error", msg: res.message });
  //   }
  // });



  //checkout

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
        resolve(true); // Already loaded
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const [paymentMethod, setPaymentMethod] = useState()




  const handleCheckout = async (e) => {
    e.preventDefault()


    var options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
      amount: parseInt(totalAmount * 100),
      currency: "INR",
      order_receipt: userData?.name,
      name: "S N Steel Fabrication",
      description: "for testing purpose",
      handler: function (response) {

        const paymentId = response.razorpay_payment_id
        const user = userData


        const generateOrderId = () => {
          const now = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          });

          const cleaned = now.replace(/[^0-9]/g, ""); // Remove all non-digits
          return `ORD-${cleaned}`; // Example: ORD-20250617104532
        };

        const normalizedProducts = itemsToCheckout.map((prd) => ({
          productId: fromCart ? prd.productId : prd._id,
          productTitle: prd.name || prd.productTitle || '',
          productBrand: prd.brand || prd.productBrand || '',
          quantity: prd.quantity,
          price: prd.price,
          image: prd.image || prd.images?.[0] || '',
          subTotal: prd.price * prd.quantity,
        }));


        const orderId = generateOrderId()

        const payload = {
          orderId,
          userId: user?._id,
          products: normalizedProducts,
          paymentId: paymentId,
          payment_status: "Completed",
          payment_method: paymentMethod,
          delivery_address: selectedAddressId,
          totalAmt: totalAmount,
          date: new Date().toLocaleString("en-IN", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        };

        console.log("payload", payload);

  if (normalizedProducts?.length > 0) {
  setIsPlacingOrder(true); // Start loading UI

  postData(`/api/order/create`, payload).then((res) => {
    console.log("Order response:", res);

    if (res?.error === false) {
      if (fromCart) {
        deleteData(`/api/cart/emptyCart/${payload.userId}`)
          .then(() => {
            getCartItems(); // Refresh cart
            router.replace("/orderSuccess");
          })
          .catch((err) => {
            console.error("Failed to empty cart:", err);
            router.replace("/orderSuccess"); // Still redirect
          });
      } else {
        router.replace("/orderSuccess");
      }
    } else {
      console.error("Order creation failed:", res);
      router.replace("/order-failed");
    }
  });
} else {
  alert.alertBox({ type: "error", msg: "Please select at least one item" });
  router.replace("/order-failed");
}




      },
      theme: {
        color: "#5252ff"
      }
    }
    await loadRazorpayScript();
    const pay = new window.Razorpay(options);
    pay.open();
  }


  const [showPaymentOptions, setShowPaymentOptions] = useState(false)

  const handleCOD = async () => {
    // Make backend call to create COD order

    const generateOrderId = () => {

      const now = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });

      const cleaned = now.replace(/[^0-9]/g, ""); // Remove all non-digits
      return `ORD-${cleaned}`; // Example: ORD-20250617104532
    };

    const normalizedProducts = itemsToCheckout.map((prd) => ({
      productId: fromCart ? prd.productId : prd._id,
      productTitle: prd.name || prd.productTitle || '',
      productBrand: prd.brand || prd.productBrand || '',
      quantity: prd.quantity,
      price: prd.price,
      image: prd.image || prd.images?.[0] || '',
      subTotal: prd.price * prd.quantity,
    }));


    const orderId = generateOrderId()

    const payload = {
      orderId,
      userId: userData?._id,
      products: normalizedProducts,
      paymentId: "COD",
      payment_status: "Pending",
      payment_method: paymentMethod,
      delivery_address: selectedAddressId,
      totalAmt: totalAmount,
      date: new Date().toLocaleString("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    };

    if(normalizedProducts?.length>0){

postData(`/api/order/create`, payload).then((res) => {
  console.log("Order response:", res);

  if (res?.error === false) {
    if (fromCart) {
      deleteData(`/api/cart/emptyCart/${payload.userId}`)
        .then(() => {
          getCartItems();
          router.replace("/orderSuccess");
        })
        .catch((err) => {
          console.error("Failed to empty cart:", err);
          router.replace("/orderSuccess"); // still go to orders
        });
    } else {
      router.replace("/orderSuccess");
    }
  } else {
    console.error("Order creation failed:", res);
    router.replace("/order-failed");
  }
});

    }else{
      alert.alertBox({type:"error", msg: "Please select atleast one item"})
    router.replace("/order-failed");

    }


    
  };

  const handleRazorpayPayment = async () => {
    // Prepare data, create Razorpay order on backend, then open Razorpay modal
    const razorpayOrder = await createRazorpayOrder(); // API call
    openRazorpayCheckout(razorpayOrder);
  };

  return (
<>

{isPlacingOrder ? (
  <div className="min-h-screen flex items-center justify-center text-lg">
    <PaymentProcessing/>
  </div>
) : (
  // Render checkout form here
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-[1020px] flex flex-col gap-2 my-3 mx-auto ">
        {/* Shipping Information */}
        <div className="p-5   bg-white  shadow-slate-400 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="text-[25px] text-black font-semibold">
              Shipping Information
            </div>
            <Button variant="outlined"
              onClick={toggleAddressSelectButton}>
              Choose Delivery Address
            </Button>
          </div>

          {ShowAddressChoice && (
            <div className="mt-3 bg-white p-5 overflow-x-auto horizontal-scroll">
              <ul className="flex gap-4 min-w-fit">
                {Array.isArray(addressArray) && addressArray.length > 0 && (
                  addressArray.map((address, index) => (
                    <li
                      key={index}
                      className={`relative w-[400px] border-2 rounded-md text-black text-base p-4 flex-shrink-0 ${selectedAddressId === address ? `border-blue-400   shadow-sm scale-100` : `border-slate-300`}`}
                      onClick={(e) => handleSetShippingAddress(e, address)}
                    >
                      <h3 className="text-lg font-bold mb-1">{address?.name}</h3>
                      <p className="text-gray-800 mb-1">{address.address}</p>
                      <p className="text-gray-700 mb-1">
                        {address.locality && `${address.locality}, `}
                        {address.city && `${address.city}, `}
                        {address.state && `${address.state}`} - {address.pin}
                      </p>
                      <p className="text-gray-600 mb-1">
                        Phone: {address.phone}{" "}
                        {address.altPhone && `| Alt: ${address.altPhone}`}
                      </p>
                      {address.landmark && (
                        <p className="text-gray-500 italic mb-1">
                          {address.landmark}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {address.addressType}
                      </p>

                      <Button onClick={(e) => toggleEditAddress(e, address)} className="!absolute !right-2 !top-2">
                        Edit
                      </Button>
                    </li>

                  ))
                )}
                <li
                  className="relative w-[220px] min-h-[171px] bg-white border-2 border-dashed border-blue-400 rounded-md text-black text-base p-6 flex-shrink-0 flex flex-col items-center justify-center hover:shadow-xl hover:bg-blue-50 transition-all duration-300 cursor-pointer group"

                  onClick={() => setShowAddAddressForm(true)}
                >
                  <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <FaLocationDot size={30} />
                  </div>
                  <span className="text-sm font-semibold group-hover:text-blue-600 transition-all">
                    Add New Address
                  </span>
                  <span className="absolute top-2 right-2 text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 bg-white  shadow-slate-400 shadow-lg h-full">
          <h2 className="text-[28px] font-bold text-slate-800 mb-6 border-b pb-2 border-slate-100">
            Order Summary
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items List */}
            <div className="w-full lg:w-2/3">
              <ul>
                {itemsToCheckout.length > 0 ? (
                  itemsToCheckout.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-4 border border-slate-300 bg-slate-50 rounded-md p-4 mb-4 hover:shadow-md transition-all"
                    >
                      <div className="w-[130px] h-[120px] flex-shrink-0 rounded overflow-hidden border">
                        <Image
                          src={item?.image || item?.images?.[0]}
                          alt={item?.name || item?.productTitle}
                          className="w-auto h-auto object-cover"
                                width={100} height={100}

                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              router.replace(`/product/${item?.name ? item?._id : item?.productId}`)
                            }
                          >
                            <h3 className="text-lg font-semibold text-indigo-700">
                              {item?.name || item?.productTitle}
                            </h3>
                            <p className="text-sm text-slate-600">{item?.brand}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-slate-700">
                          <span>Qty: {item?.quantity}</span>
                          <span className="font-semibold text-lg">₹{item?.quantity * item?.price}</span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-slate-500 mt-2">No items found.</div>
                )}
              </ul>
            </div>

            {/* Billing Details */}
            <div className="w-full lg:w-1/3 h-full bg-white border border-slate-300 rounded-md p-6 shadow">
              <h3 className="text-[24px] text-center font-bold text-slate-700 mb-6">
                Billing Details
              </h3>

              <div className="space-y-4 text-[17px]">
                {itemsToCheckout.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b pb-3 text-slate-700 font-medium"
                  >
                    <span>{item?.productTitle || item?.name} × {item.quantity}</span>
                    <span>₹{item.quantity * item.price}</span>
                  </div>
                ))}

                <div className="flex justify-between font-bold text-slate-800 text-xl  pt-1">
                  <span>Total Amount</span>
                  <span>
                    ₹
                    {itemsToCheckout.reduce(
                      (acc, item) => acc + item.quantity * item.price,
                      0
                    )}
                  </span>
                </div>

                <div className="pt-6">
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full"
                    onClick={(e) => {
                      if (!selectedAddressId) {
                        alert.alertBox({
                          type: "error",
                          msg: "Please select a delivery address",
                        });
                        return;
                      }

                      // Ask user to choose payment method
                      setShowPaymentOptions(true);
                    }}
                  >
                    Proceed to Payment
                  </Button>

                  {showPaymentOptions && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-md font-semibold text-slate-700 text-center mb-2">
                        Choose Payment Method
                      </h4>

                      <div className="mt-4 space-y-3">
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#1e293b", // slate-800
                            borderColor: "#cbd5e1", // slate-300
                            "&:hover": {
                              borderColor: "#1e293b",
                              backgroundColor: "#f1f5f9", // slate-100
                            },
                            fontWeight: 600,
                            fontSize: "16px",
                          }}
                          fullWidth
                          onClick={()=>{
                            setPaymentMethod("online")
                            handleCOD()
                          }}
                        >
                          Cash on Delivery
                        </Button>

                        <Button
                          variant="contained"
                          color="primary"
                          className="w-full"
                          onClick={(e) => {
                            if (!selectedAddressId) {
                              alert.alertBox({
                                type: "error",
                                msg: "Please select a delivery address",
                              });
                              return;
                            }
                            setPaymentMethod("online")
                            handleCheckout(e);
                          }}
                        >
                          Continue to Payment
                        </Button>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {showAddAddressForm && (

        <div className='fixed inset-0 z-[300] flex justify-center items-center bg-black bg-opacity-50 overflow-y-auto'>
          <div className="modal-form w-[850px] relative max-h-[90vh] my-9 p-5 rounded-md bg-white overflow-y-auto scrollbar-hide">

            <div className="text-black  flex justify-between pb-2 border-b-2 border-slate-400 text-[23px] font-semibold">Add address<RxCross2 color="red" size={30} onClick={() => setShowAddAddressForm(false)} className="cursor-pointer" /></div>

            <form className="w-full mt-4 " onSubmit={saveNewAddress}>
              {/* Two-column grid on md and above, single column on small screens */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="flex flex-col">
                  <TextField label="Name" required variant="outlined" sx={{ m: 1, my: 1.5, width: "auto" }} onChange={handleAddressChange} value={address.name} name="name" />
                  <TextField label="Pincode" required variant="outlined" sx={{ m: 1, my: 1.5, width: "auto" }} onChange={handleAddressChange} value={address.pin} name="pin" />
                </div>
                <div className="flex flex-col">
                  <TextField label="Phone Number" required variant="outlined" sx={{ m: 1, my: 1.5, width: "auto" }} onChange={handleAddressChange} value={address.phone} name="phone" />
                  <TextField label="Locality" variant="outlined" sx={{ m: 1, my: 1.5, width: "auto" }} onChange={handleAddressChange} value={address.locality} name="locality" />
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
                  onChange={handleAddressChange} value={address.address} name="address"
                />
              </div>

              {/* Additional sections (if needed) */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="flex flex-col">
                  <TextField label="City/District" variant="outlined" sx={{ m: 1, my: 1.5, width: "auto" }} onChange={handleAddressChange} value={address.city} name="city" />
                  <TextField label="Landmark(Optional)" variant="outlined" sx={{ m: 1, my: 1.5, width: "auto" }} onChange={handleAddressChange} value={address.landmark} name="landmark" />
                </div>
                <div className="flex flex-col">
                  <FormControl sx={{ m: 1, my: 1.5, width: "auto", color: "red" }} >
                    <InputLabel id="state-select-label">State</InputLabel>
                    <Select
                      labelId="state-select-label"
                      id="state"
                      value={address.state || ''}
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

                  <TextField label="Alternate Phone (Optional)" variant="outlined" sx={{ m: 1, my: 1.5, width: "auto" }} onChange={handleAddressChange} value={address.altPhone} name="altPhone" />
                </div>
              </div>
              <div className="mx-2">
                <FormControl className="text-black">
                  <FormLabel id="demo-row-radio-buttons-group-label">Address type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="addressType"
                    onChange={handleAddressChange}

                  >
                    <FormControlLabel value="Home" control={<Radio />} label="Home" onChange={handleAddressChange} name="addressType" />
                    <FormControlLabel value="work" control={<Radio />} label="Work" onChange={handleAddressChange} name="addressType" />
                  </RadioGroup>
                </FormControl>

              </div>


              {/* Submit button */}
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
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:shadow-inner active:translate-y-[1px] transition-all duration-200 font-medium"
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
          <Button onClick={handleCloseDeleteAlert} variant="outlined" color="inherit">Cancel</Button>
          <Button variant="contained" color="error"
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

        <div className='fixed inset-0 z-[300] flex justify-center items-start bg-black bg-opacity-50 overflow-y-auto'>
          <div className="modal-form w-[850px] relative max-h-[90vh] my-9 p-5 rounded-md bg-white overflow-y-auto scrollbar-hide">
            <div className="text-black  flex justify-between pb-2 border-b-2 border-slate-400 text-[23px] font-semibold">Edit address<RxCross2 color="red" size={30} onClick={() => setShowEditModal(false)} className="cursor-pointer" /></div>

            <form className="w-full mt-4 " onSubmit={handleSaveEditedAddress}>
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
                      value={editAddressObj?.state || ''}
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
                    <FormControlLabel value="Home" control={<Radio />} label="Home" />
                    <FormControlLabel value="Work" control={<Radio />} label="Work" />
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
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:shadow-inner active:translate-y-[1px] transition-all duration-200 font-medium"
                >
                  Save
                </button>

              </div>
            </form>





          </div>


        </div>
      )}
    </div>
)}
    


</>
    
  );
};

export default Page;