"use client"

import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Checkbox from '@mui/material/Checkbox';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { fetchDataFromApi } from '@/utils/api';
import { IoMdClose } from "react-icons/io";




const Admins = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchDataFromApi(`/api/user/getAllUsers`).then((res) => {
      if (!res.error) {
        setUsers(res.users);
      } else {
        alert("No users found");
      }
    });
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleSelectUser = (user)=>{
    setSelectedUser(user)
  }


  return (
    <div className="p-6 max-w-screen overflow-x-auto bg-gradient-to-tr from-white via-blue-50 to-cyan-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800 tracking-wide">Manage Users</h1>
        
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex items-center border border-slate-300 bg-white rounded-md px-3 w-full max-w-md shadow-sm">
          <SearchIcon className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-full h-10 bg-transparent focus:outline-none text-black"
          />
        </div>
        <div className="w-10 h-10 flex items-center justify-center border border-slate-300 bg-white rounded-md shadow-sm cursor-pointer">
          <FilterAltIcon />
        </div>
      </div>
{
    console.log("uuuuuuuuuuuuuuuuuu",selectedUser)

}
      {/* User Table */}
      <div className="rounded-xl bg-white shadow-lg overflow-x-auto">
        <table className="w-full min-w-[1200px] border-separate border-spacing-y-2 text-sm">
          <thead className="bg-blue-100 text-slate-700 font-semibold uppercase text-xs sticky top-0 shadow-sm z-10">
            <tr>
              <th className="px-3 py-2 text-left"><Checkbox /></th>
              <th className="px-3 py-2 text-left">Avatar</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Last Login</th>
              <th className="px-3 py-2 text-center">Cart</th>
              <th className="px-3 py-2 text-center">Wishlist</th>
              <th className="px-3 py-2 text-left">Address</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <tr key={user._id} className="bg-slate-50 hover:bg-slate-100 rounded-lg shadow-sm transition"
              
                      onClick={()=>handleSelectUser(user)}
              >
                <td className="px-3 py-3"><Checkbox /></td>
                <td className="px-3 py-3">
                  <img src={user.avatar || "/images/account.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
                </td>
                <td className="px-3 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-3 py-3 text-slate-600">{user.email}</td>
                <td className="px-3 py-3 text-slate-600">{user.phone}</td>
                <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                  {user.last_login_date && (
                    <>
                      {new Date(user.last_login_date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {new Date(user.last_login_date).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </>
                  )}
                </td>
                <td className="px-3 py-3 text-center text-blue-700 font-semibold">{user.shopping_cart.length}</td>
                <td className="px-3 py-3 text-center text-blue-700 font-semibold">{user.wishlist.length}</td>
                <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                  {user?.address_details?.[0]?.address}, {user?.address_details?.[0]?.city}
                </td>
                <td className="px-3 py-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-3 py-3 flex gap-2 items-center">
                  <ModeEditOutlineIcon
                    className="text-sky-600 hover:text-sky-800 cursor-pointer"
                  />
                  <DeleteOutlineIcon className="text-rose-600 hover:text-rose-800 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="mt-4"
      />


            {selectedUser && (
              <div className='flex w-full h-full justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50'
              >
                    <div className='w-[90%] h-[90%] bg-white rounded-md text-black py-3 px-6 overflow-auto scrollbar-hide'>

                      <div className='borderf  flex justify-between items-center'>

                        <h1 className='text-black text-lg '>_id: <span className='text-indigo-900 text-lg
                         font-semibold'>{selectedUser._id}</span></h1>
                         <IoMdClose className='hover:bg-slate-100 rounded-full text-red-600 text-4xl p-1' onClick={()=>setSelectedUser(null)}/>
                         

                      </div>

                     <div className='flex justify-between h-auto my-3'>
                      <div> <p className='py-1 text-black font-semibold font-sans text-xl'>User name: <span className='text-blue-900'>{selectedUser.name}</span></p>
                      <p className='py-1 text-black font-semibold font-sans text-xl'>Phone: <span className='py-1 text-blue-900'>{selectedUser.phone}</span></p><p className='py-1 text-black font-semibold font-sans text-xl'>User email: <span className='py-1 text-blue-900'>{selectedUser.email}</span></p> </div>


                      <div className='w-[100px] h-auto] border-2 border-slate-40-'>
                        <img src={selectedUser?.avatar || "/images/account.png"} alt="" className='w-full h-auto'/>
                      </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                      <h1 className="text-black font-semibold">Address</h1>
                      <p></p>
                      {selectedUser?.address_details.length>0 && selectedUser?.address_details?.map((address, index)=>{
                        return(
                          <div key={index} className="border border-gray-400  rounded-md p-3">
                              <p><b>_id: </b>{address?._id}</p>
                              <p><b>{address?.name}</b></p>
                              <p>{address?.phone}, {address?.altPhone}</p> 
                              <p>{address?.address}, {address?.city}</p> 
                              <p>{address?.locality}</p> 
                              <p>{address?.landmark}</p> 
                              <p>{address?.state}-{address?.pin}</p> 
                              <p>createdAt: {address?.createdAt}</p> 
                              <p>updatedAt: {address?.updatedAt}</p> 






                      </div>
                        )
                      })}
                     </div>
                     <div  className="border border-gray-400  rounded-md p-3 mt-3">
                              <p><b>User since: </b> {selectedUser?.createdAt}</p>
                              <p><b>Last Log in: </b>{selectedUser?.last_login_date}</p>
                              <p><b>OTP: </b>{selectedUser?.otp}</p>  
                              <p><b>OTP expires: </b>{selectedUser?.otpExpires}</p>  
                              <p><b>Email verified: </b>{selectedUser?.verify_email}</p>  
                              <p><b>Updated at: </b>{selectedUser?.updatedAt}</p> 
                              <p><b>Order: </b>{selectedUser}</p>  
                              <p><b>Cart: </b>{selectedUser?.shopping_cart.length}</p>  
                              <p><b>Wishlist: </b>{selectedUser?.wishlist.length}</p>  









                      </div>

                      </div>

              </div>
            )}

      
    </div>
  );
};

export default Admins;
