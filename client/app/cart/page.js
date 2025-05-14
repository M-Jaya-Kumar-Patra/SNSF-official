"use client";

import React, { useState } from 'react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'SS Chair',
      price: 2499,
      image: 'images/chair/slide1.png',
      quantity: 1
    },
    {
      id: 2,
      title: 'SS Table',
      price: 3999,
      image: 'images/chair/slide1.png',
      quantity: 2
    }
  ]);

  const handleIncrement = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-[1020px] my-3 mx-auto flex justify-between">
        {/* items list */}
        <div className='w-[750px] h-full border bg-white shadow-lg p-2'>
          <ul>
            <div>
        <div className="min-h-80 border border-black bg-blue-900 font-bold flex items-center px-4">
  {/* You can add content like logo or menu button here */}
   
  
</div>
    </div>
            {cartItems.map(item => (
              <li key={item.id} className='flex border-b p-2'>
                <div className="img-incdec flex gap-4">
                  <div className='w-[150px] h-[150px]'>
                    <img src={item.image} className='w-auto h-auto' alt={item.title} />
                  </div>
                  <div className='flex gap-2 mt-2 items-center'>
                    <div className='w-7 h-7 rounded-full border flex justify-center items-center text-xl text-black cursor-pointer' onClick={() => handleDecrement(item.id)}>-</div>
                    <input type="number" className='text-black w-[40px] h-7 border rounded-md text-center' value={item.quantity} readOnly />
                    <div className='w-7 h-7 rounded-full border flex justify-center items-center text-xl text-black cursor-pointer' onClick={() => handleIncrement(item.id)}>+</div>
                  </div>
                </div>
                <div className='flex justify-between items-center w-full px-6'>
                  <div className="details-cart-item">
                    <h1 className='text-black font-normal mb-4'>{item.title}</h1>
                    <h1 className='text-black font-medium flex items-center mt-auto'>
                      <FaIndianRupeeSign /> {item.price}
                    </h1>
                  </div>
                  <div className="action text-3xl text-black cursor-pointer" onClick={() => removeFromCart(item.id)}>
                    <MdDelete />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* billing section */}
        <div className='w-[258px] border bg-white shadow-lg p-2'>
          <h2 className="text-black font-bold text-lg mb-4">Billing</h2>
          <div className="text-black space-y-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title} × {item.quantity}</span>
                <span>₹{item.quantity * item.price}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                ₹{cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
