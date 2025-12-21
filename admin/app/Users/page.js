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
import { fetchDataFromApi, postData } from '@/utils/api';
import { IoMdClose } from "react-icons/io";
import { formatToIST } from '@/utils/dateFormater';




const Admins = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPromoMail, setShowPromoMail] = useState(false);

const [promoSubject, setPromoSubject] = useState("");
const [promoContent, setPromoContent] = useState("");
const [isHtml, setIsHtml] = useState(false);

const sendPromotionalMail = async () => {
  if (!promoSubject || !promoContent) {
    alert("Subject and content required");
    return;
  }

  await postData("/api/admin/send-promotional-email", {
      to: selectedUser.email,
      name: selectedUser.name,
      subject: promoSubject,
      content: promoContent,
      isHtml,
    },
  );

  setShowPromoMail(false);
};



  useEffect(() => {
    fetchDataFromApi(`/api/user/getAllUsers`).then((res) => {
      console.log(res)
      if (!res?.error) {
        setUsers(res?.users);
      } else {
        alert("No users found");
      }
    });
  }, []);

  useEffect(() => {
  if (showPromoMail) {
    setPromoSubject("");
    setPromoContent("");
    setIsHtml(false);
  }
}, [showPromoMail]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleSelectUser = (user)=>{
    setSelectedUser(user)
  }

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900 mb-4">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-600">{label}</span>
    <span className="font-medium text-slate-900">
      {value ?? "—"}
    </span>
  </div>
);


const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);



  return (
    <div className="p-6 max-w-screen overflow-x-auto bg-gradient-to-tr from-white via-blue-50 to-cyan-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-wide">Manage Users</h1>
        
      </div>

<div className='w-full flex justify-between items-center'>
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

      <div className="text-xl text-gray-600">
        Total Users: <span className="font-bold">{users.length}</span>
      </div>
</div>
      {/* User Table */}
      <div className="rounded-xl bg-white shadow-lg overflow-x-auto">
        <table className="w-full min-w-[1200px] border-separate border-spacing-y-2 text-sm">
          <thead className="bg-blue-100 text-slate-700 font-semibold uppercase text-xs sticky top-0 shadow-sm z-10">
            <tr>
              <th className="px-3 py-2 text-left"><Checkbox /></th>
              <th className="px-3 py-2 text-left">Avatar</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Contact</th>
              <th className="px-3 py-2 text-left">User since</th>
              <th className="px-3 py-2 text-left">Last Login</th>
              <th className="px-3 py-2 text-left">Last Activity</th>
              <th className="px-3 py-2 text-center">Wishlist</th>
              <th className="px-3 py-2 text-left">Address</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <tr key={user._id} className="bg-slate-50 hover:bg-slate-100 rounded-lg shadow-sm transition cursor-pointer"
              
                      onClick={()=>handleSelectUser(user)}
              >
                <td className="px-3 py-3"><Checkbox /></td>
                <td className="px-3 py-3">
                  <img src={user.avatar || "/images/account.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
                </td>
                <td className="px-3 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-3 py-3 text-slate-600">{user.email} {user.phone}</td>
                
       <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
   {formatToIST(user.createdAt)}
</td>


                 <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
   {formatToIST(user.last_login_date)}
</td>


                <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
  {formatToIST(user.lastActivity)}
</td>

                <td className="px-3 py-3 text-center text-slate-900 font-semibold">{user.wishlist.length}</td>
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
                <td
  className="px-3 py-3 flex gap-2 items-center"
  onClick={(e) => e.stopPropagation()}
>
  <ModeEditOutlineIcon
    className="text-sky-600 hover:text-sky-800 cursor-pointer"
  />
  <DeleteOutlineIcon
    className="text-rose-600 hover:text-rose-800 cursor-pointer"
  />
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="relative w-[96%] md:w-[85%] xl:w-[70%] h-[92%] bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            User Details
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            User ID: <span className="font-mono text-slate-800">{selectedUser._id}</span>
          </p>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-slate-200 transition"
        >
          <IoMdClose className="text-3xl text-slate-800" />
        </button>
      </div>

      {/* ================= BODY ================= */}
      <div className="h-[calc(100%-80px)] overflow-y-auto px-6 py-6 space-y-8">
<button
  onClick={() => setShowPromoMail(true)}
  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow"
>
  Send Promotional Email
</button>

        {/* ================= PROFILE CARD ================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white border rounded-xl p-6 shadow-sm">
          <img
            src={selectedUser.avatar || "/images/account.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full border-2 border-slate-300 object-cover"
          />

          <div className="flex-1 space-y-1">
            <p className="text-xl font-semibold text-slate-900">
              {selectedUser.name}
            </p>
            <p className="text-slate-700">{selectedUser.email}</p>
            <p className="text-slate-700">
              {selectedUser.phone || "No phone number"}
            </p>
          </div>

          <span
            className={`px-4 py-1.5 text-sm font-semibold rounded-full
              ${
                selectedUser.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : selectedUser.status === "Inactive"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
          >
            {selectedUser.status}
          </span>
        </div>

        {/* ================= ACCOUNT INFO ================= */}
        <Section title="Account Information">
          <Info label="User since" value={formatToIST(selectedUser.createdAt)} />
          <Info label="Last login" value={formatToIST(selectedUser.last_login_date)} />
          <Info label="Updated at" value={formatToIST(selectedUser.updatedAt)} />
          <Info label="Email verified" value={selectedUser.verify_email ? "Yes" : "No"} />
          <Info label="Wishlist items" value={selectedUser.wishlist?.length || 0} />
          <Info label="Cart items" value={selectedUser.shopping_cart?.length || 0} />
        </Section>

        {/* ================= ADDRESS ================= */}
        <Section title="Addresses">
          {selectedUser.address_details?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedUser.address_details.map((address, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-slate-50 text-sm space-y-1"
                >
                  <p className="font-semibold text-slate-900">{address.name}</p>
                  <p className="text-slate-700">
                    {address.phone} {address.altPhone && `, ${address.altPhone}`}
                  </p>
                  <p className="text-slate-700">
                    {address.address}, {address.city}
                  </p>
                  <p className="text-slate-700">
                    {address.state} - {address.pin}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Created: {formatToIST(address.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No address added</p>
          )}
        </Section>

      </div>
    </div>
  </div>
)}


{showPromoMail && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
    <div className="w-[95%] md:w-[700px] bg-white rounded-xl shadow-2xl overflow-hidden text-slate-900"  onClick={(e) => e.stopPropagation()} >

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
        <h2 className="text-lg font-bold text-slate-900">
          Send Promotional Email
        </h2>
        <IoMdClose
          className="text-2xl cursor-pointer text-slate-800 hover:text-red-600"
          onClick={() => setShowPromoMail(false)}
        />
      </div>

      {/* ================= BODY ================= */}
      <div className="p-6 space-y-4">

        {/* To */}
        <Field label="To">
          <input
            value={selectedUser.email}
            disabled
            className="input text-slate-900 bg-slate-100 cursor-not-allowed"
          />
        </Field>

        {/* Name */}
        <Field label="User Name">
          <input
            value={selectedUser.name}
            disabled
            className="input text-slate-900 bg-slate-100 cursor-not-allowed"
          />
        </Field>

        {/* Subject */}
       <Field label="Subject">
  <input
    value={promoSubject}
    placeholder="Enter email subject"
    className="input text-slate-900 placeholder:text-slate-400"
    onChange={(e) => setPromoSubject(e.target.value)}
  />
</Field>


        {/* Type */}
        <div className="flex gap-6 text-sm font-medium text-slate-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!isHtml}
              onChange={() => setIsHtml(false)}
              className="accent-indigo-600"
            />
            Plain Text
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={isHtml}
              onChange={() => setIsHtml(true)}
              className="accent-indigo-600"
            />
            HTML
          </label>
        </div>

        {/* Content */}
        <Field label="Email Content">
  <textarea
    rows={6}
    value={promoContent}
    placeholder={isHtml ? "<p>Your HTML here</p>" : "Write your message"}
    className="input text-slate-900 placeholder:text-slate-400 resize-none"
    onChange={(e) => setPromoContent(e.target.value)}
  />
</Field>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
        <button
          onClick={() => setShowPromoMail(false)}
          className="px-4 py-2 text-sm font-medium text-slate-700 border rounded-lg hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={sendPromotionalMail}
          className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          Send Email
        </button>
      </div>

    </div>
  </div>
)}






      
    </div>
  );
};

export default Admins;
