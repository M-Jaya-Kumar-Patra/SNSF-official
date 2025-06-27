"use client";

import React, { useState, useEffect } from 'react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useCart } from '../context/CartContext';
import { RxCross2 } from "react-icons/rx";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Image from "next/image";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { deleteItem, postData } from '@/utils/api';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';

const Cart = () => {
  const { cartData, getCartItems, buyNowItem, setBuyNowItem } = useCart();
  const alert = useAlert();
  const router = useRouter();
  const { setUserData, userData, isLogin } = useAuth();

  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
    } else {
      getCartItems();
    }
  }, [isLogin, getCartItems, router]);

  const handleQuantityChange = async (e, _id, qty) => {
    if (qty < 1) return;

    const formData = { _id, qty };
    postData(`/api/cart/update-qty`, formData, true).then((res) => {
      if (res.error) {
        alert.alertBox({ type: "error", msg: res.message });
      } else {
        getCartItems();
      }
    });
  };

  const removeItemFromCart = (e, _id, productId) => {
    e.preventDefault();
    deleteItem(`/api/cart/delete-cart-item`, { _id, productId }).then((res) => {
      if (!res.error) {
        alert.alertBox({ type: "success", msg: res.message });
        getCartItems();
        setUserData({
          ...userData,
          shopping_cart: userData.shopping_cart.filter(id => id !== productId)
        });
      } else {
        alert.alertBox({ type: "error", msg: res.message });
      }
    });
  };

  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100 sm:px-4">
      <div className="w-full sm:max-w-[1020px] mb-2 sm:my-5 mx-auto flex flex-col gap-4">
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="w-[200px] sm:w-[260px] mb-4">
              <DotLottieReact
                src="https://lottie.host/e0034d65-94ab-4d3f-8620-5f770086e129/V8LBHIPVZJ.lottie"
                loop
                autoplay
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Your Cart is Empty</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-sm">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm sm:text-base transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
          <div className='hidden sm:block w-full h-full border sm:rounded-lg bg-white shadow-xl p-1 sm:p-5'>
            
          <div className="w-full bg-white mb-2">
  <h1 className="text-2xl sm:text-3xl font-semibold bg-white text-gray-800 mb-0">🛒 My Cart</h1>
</div>

            <ul>
              {cartData.map((item, index) => (
                <li
                  key={index}
                  className='flex  border border-slate-300 hover:shadow-lg gap-4 p-1 sm:p-4 w-full mb-5 rounded-md bg-slate-50 hover:bg-white transition'
                >
                  <div
                    className='w-full sm:w-[220px] sm:h-[200px] flex items-center justify-center rounded-lg overflow-hidden bg-white shadow mx-auto sm:mx-0'
                    onClick={() => router.push(`/product/${item?.productId}`)}
                  >
                    <Image
                      src={item.image}
                      className='object-contain h-full w-auto cursor-pointer'
                      alt={item.title || "no img"}
                      width={100}
                      height={100}
                    />
                  </div>

                  <div className='w-full p-2 flex flex-col justify-between'>
                    <div className='flex flex-col sm:flex-row border-b pb-2 justify-between items-start gap-2 sm:gap-0'>
                      <div className='cursor-pointer' onClick={() => router.push(`/product/${item?.productId}`)}>
                        <h1 className='text-gray-800 text-[17px] sm:text-[22px] font-semibold break-words'>{item?.productTitle}</h1>
                        <h3 className='text-gray-600 text-[15px] sm:text-[18px]'>{item?.brand}</h3>
                      </div>
                      <RxCross2
                        className='text-gray-500 text-[22px] sm:text-[25px] hover:text-red-600 cursor-pointer'
                        onClick={(e) => removeItemFromCart(e, item?._id, item?.productId)}
                      />
                    </div>

                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 gap-4'>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ButtonGroup variant="outlined" aria-label="quantity controls" size="small">
                          <Button
                            className='!text-red-600 !border-black !border-r-0'
                            onClick={(e) => handleQuantityChange(e, item._id, item.quantity - 1)}
                          >
                            <RemoveIcon />
                          </Button>
                          <Button disabled className='!text-black !border-black bg-white'>
                            {item?.quantity}
                          </Button>
                          <Button
                            className='!text-blue-600 !border-black !border-l-0'
                            onClick={(e) => handleQuantityChange(e, item._id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </Button>
                        </ButtonGroup>
                      </Box>
                      <div className='text-lg sm:text-xl font-semibold text-slate-700'>₹{item?.quantity * item?.price}</div>
                    </div>
                  </div>
                </li>
              ))}

              <li className='flex flex-col border border-slate-300 shadow-lg bg-white p-4 sm:p-6 rounded-lg mt-5'>
                <h2 className="text-gray-700 font-bold text-[17px] sm:text-[24px] mb-4 sm:mb-6 text-center">Billing Details</h2>
                <div className="text-black space-y-3 sm:space-y-4 text-sm sm:text-base">
                  {cartData.map((item, index) => (
                    <div key={index} className="flex justify-between px-2">
                      <span>{item?.productTitle} × {item.quantity}</span>
                      <span className="text-slate-700">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                  <hr className="my-3" />
                  <div className="flex justify-between font-bold text-base sm:text-xl px-2">
                    <span>Total Amount</span>
                    <span className="text-slate-800">
                      ₹{cartData.reduce((acc, item) => acc + item.quantity * item.price, 0)}
                    </span>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button
                      fullWidth
                      disabled={cartData.length === 0}
                      variant="contained"
                      color="primary"
                      className="bg-primary-gradient text-white px-4  py-2 sm:px-6 sm:py-2 rounded shadow hover:shadow-md  !text-xs sm:!text-base"
                      onClick={() => {
                        setBuyNowItem(cartData);
                        sessionStorage.setItem("buyNowItem", JSON.stringify(cartData));
                        router.push('/checkOut');
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <div className='block sm:hidden mt-0 w-full h-full border sm:rounded-lg bg-white shadow-xl p-1 sm:p-5'>
           <div className="w-full bg-white mb-2">
  <h1 className="text-xl font-sans sm:text-3xl font-semibold bg-white text-gray-800 mb-0">🛒 My Cart</h1>
</div>
            <ul>

              {cartData.map((item, index) => (  
                <li
                  key={index}
                  className=' border bg-slate-50 border-slate-300 hover:shadow-lg gap-4 p-2 sm:p-4 w-full mb-2 rounded-md '
                >

                  <div className='flex gap-2'>

                  <div
                    className=' !w-[100px] !h-[100px] flex items-center justify-center rounded-lg overflow-hidden bg-white shadow mx-auto sm:mx-0'
                    onClick={() => router.push(`/product/${item?.productId}`)}
                    >
                    <Image
                      src={item.image}
                      className='object-contain h-full w-auto cursor-pointer'
                      alt={item.title || "no img"}
                      width={100}
                      height={100}
                      />
                    
                  </div>

                  <div className='flex  w-full sm:flex-row border-b pb-2  justify-between items-start gap-2 sm:gap-0'>
                      <div className='cursor-pointer pl-2' onClick={() => router.push(`/product/${item?.productId}`)}>
                        <h1 className='text-gray-800  text-[17px] font-medium break-words'>{item?.productTitle}</h1>
                        <h3 className='text-gray-600 text-[12px]'>{item?.brand}</h3>
                      </div>
                      <RxCross2
                        className='text-gray-500 text-[15px] sm:text-[25px] hover:text-red-600 cursor-pointer'
                        onClick={(e) => removeItemFromCart(e, item?._id, item?.productId)}
                      />
                    </div>
                      </div>

                  <div className='w-full  flex  justify-between'>
                    

                    <div className='w-full flex justify-between items-start sm:items-center pt-3 gap-4'>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <ButtonGroup variant="outlined" size="small" aria-label="quantity controls" className="!rounded">
      <Button
        className='!text-red-600 !border-black !border-r-0 !min-w-[28px] !h-[28px] !p-0 !text-xs'
        onClick={(e) => handleQuantityChange(e, item._id, item.quantity - 1)}
      >
        <RemoveIcon fontSize="inherit" />
      </Button>
      <Button
        disabled
        className='!text-black !border-black !min-w-[28px] !h-[28px] !p-0 !text-xs bg-white'
      >
        {item?.quantity}
      </Button>
      <Button
        className='!text-blue-600 !border-black !border-l-0 !min-w-[28px] !h-[28px] !p-0 !text-xs'
        onClick={(e) => handleQuantityChange(e, item._id, item.quantity + 1)}
      >
        <AddIcon fontSize="inherit" />
      </Button>
    </ButtonGroup>
  </Box>
  <div className='text-sm font-semibold text-slate-700'>₹{item?.quantity * item?.price}</div>
</div>

                  </div>
                </li>
              ))}

              <li className='flex flex-col border border-slate-300 shadow-lg bg-white p-4 sm:p-6 rounded-lg mt-2'>
                <h2 className="text-gray-700 font-bold text-[17px] sm:text-[24px] mb-4 sm:mb-6 text-center">Billing Details</h2>
                <div className="text-black space-y-3 sm:space-y-4 text-[14px] sm:text-[17px]">
                  {cartData.map((item, index) => (
                    <div key={index} className="flex justify-between px-2">
                      <span>{item?.productTitle} × {item.quantity}</span>
                      <span className="text-slate-700">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                  <hr className="my-3" />
                  <div className="flex justify-between font-bold text-sm sm:text-xl px-2">
                    <span>Total Amount</span>
                    <span className="text-slate-800">
                      ₹{cartData.reduce((acc, item) => acc + item.quantity * item.price, 0)}
                    </span>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button
                      fullWidth
                      disabled={cartData.length === 0}
                      variant="contained"
                      color="primary"
                      className="bg-primary-gradient text-white px-4 py-2 sm:px-6 sm:py-2 rounded shadow hover:shadow-md !text-xs sm:!text-normal"
                      onClick={() => {
                        setBuyNowItem(cartData);
                        sessionStorage.setItem("buyNowItem", JSON.stringify(cartData));
                        router.push('/checkOut');
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </li>
            </ul>
          </div></>
          
        )}
      </div>
    </div>
  );
};

export default Cart;
