"use client";

import React, { useState, useEffect } from 'react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useCart } from '../context/CartContext';

import { RxCross2 } from "react-icons/rx";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { blue } from '@mui/material/colors';



import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { deleteItem, postData } from '@/utils/api';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext'; 
import { useRouter } from 'next/navigation';



const Cart = () => {

  const { cartData, getCartItems , buyNowItem, setBuyNowItem} = useCart()
  
  const alert = useAlert()
  const router = useRouter()
  
  const { setUserData, userData, isLogin } = useAuth(); // make sure to bring this in
  
  
  useEffect(()=>{
    if(!isLogin){
      router.push("/login")
    }
    getCartItems();
  },[])
  
  
  const handleQuantityChange = async (e, _id, qty) => {
    if (qty < 1){
      return
    }
    
    const formData = { _id, qty }
    
    postData(`/api/cart/update-qty`, formData, true).then((res) => {
      if (res.error) {
        
        alert.alertBox({ type: "error", msg: res.message });
      } else {
        getCartItems();
      }
    })
  };


  const removeItemFromCart = (e, _id, productId) => {
  e.preventDefault();
  deleteItem(`/api/cart/delete-cart-item`, { _id, productId }).then((res) => {
    if (!res.error) {
      alert.alertBox({ type: "success", msg: res.message });
      getCartItems();

      // Remove productId from userData.shopping_cart manually
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
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-[1020px] my-3 mx-auto  justify-between">
        {/* items list */}
        <div className='w-[100%] h-full border   bg-white shadow-lg p-4'>
          <ul>
            {cartData.map((item, index) => (
              <li key={index} className='flex border  border-slate-300 hover:shadow-lg h-auto  gap-2   p-2 w-full  mb-3 rounded-sm'
              
              >


                <div className='w-[250px] h-[200px] flex items-center' onClick={() => router.push(`/product/${item?.productId}`)}>
                  <img src={item.image} className='w-auto h-auto' alt={item.title} />
                </div>
              
                <div className='w-full  p-2'>

                  <div className='flex border-b h-[65%] justify-between px-2'  >
                    <div className=' w-full cursor-pointer' onClick={() => router.push(`/product/${item?.productId}`)}>
                      <h1 className='text-black text-[22px] font-sans font-semibold'>{item?.productTitle}</h1>
                      <h3 className='text-gray-600 text-[18px] font-sans font-medium'>{item?.brand}</h3>
                    </div>

                    <div  className='w-auto cursor-pointer'>
                      <RxCross2 className='text-gray-500 text-[25px] hover:text-gray-700 cursor-pointer'
                        onClick={(e) => { removeItemFromCart(e, item?._id, item?.productId) }}
                      />
                    </div>
                  </div>


                  <div className='flex justify-between items-center h-[35%] px-2'>
                    <div>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          '& > *': {
                            m: 0,
                            height: "30px",
                            width: "100px"
                          },
                        }}
                      >
                        <ButtonGroup variant="outlined" aria-label="Basic button group">

                          <Button className='!text-red-600 hover:bg-red-50 !border-black !border-r-0'
                            sx={{
                              "& .MuiTouchRipple-root .MuiTouchRipple-rippleVisible": {
                                color: "rgba(255, 0, 0, 0.3)", // Red ripple
                              },
                              width: "30%"
                            }}

                            onClick={(e) => handleQuantityChange(e, item._id, item.quantity - 1)}

                          ><RemoveIcon /></Button>

                          <Button disabled className='!text-black !border-black'
                            sx={{
                              width: "40%",
                            }}
                          >{item?.quantity}</Button>

                          <Button className='!text-blue-600 !border-black !border-l-0'

                            sx={{
                              "& .MuiTouchRipple-root .MuiTouchRipple-rippleVisible": {
                                color: "rgba(0, 0, 255, 0.3)", // Red ripple
                              },
                              width: "30%"
                            }}

                            onClick={(e) => handleQuantityChange(e, item._id, item.quantity + 1)}


                          ><AddIcon /></Button>
                        </ButtonGroup>
                      </Box>


                    </div>
                    <div className='text-black font-semibold text-[20px]'>₹{item?.quantity * item?.price}</div>

                  </div>
                </div>
              </li>


            ))}

            <li className='flex border  border-slate-300 hover:shadow-lg h-auto  gap-2   p-2 w-full  mb-3 rounded-sm'>
              <div className='w-[100%] p-10 pb-28 font'>
                <h2 className="text-gray-600 font-bold text-[25px] mb-8  text-center">Billing details</h2>
                <div className="text-black space-y-2 px-2">
                  {cartData.map((item, index) => (
                    <div key={index}
                      className="flex justify-between text-[20px] px-4">
                      <span className='text-[23px]'>{item?.productTitle} × {item.quantity}</span>
                      <span>₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="flex justify-between font-bold text-[23px] px-4">
                    <span>Total Amount</span>
                    <span >
                      ₹{cartData.reduce((acc, item) => acc + item.quantity * item.price, 0)}
                    </span>
                  </div>

                  <div className="flex justify-end pr-2 pt-16">
                    <Button
                    disabled={cartData?.length>0?false:true}
                    variant="contained"
                    color="primary"
                    
                    className="mt-4 "
                    onClick={() => {
                      router.push('/checkOut')
                      setBuyNowItem(cartData)
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Cart;
