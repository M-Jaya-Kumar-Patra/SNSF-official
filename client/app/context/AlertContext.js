'use client';

import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {

   useEffect(()=>{
      console.log("alert")
    },[])
  
  const alertBox = ({ type, msg }) => {
    if (type === 'success') toast.success(msg);
    else if (type === 'error') toast.error(msg);
    else toast(msg);
  };

  return (
    <AlertContext.Provider value={{ alertBox }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
