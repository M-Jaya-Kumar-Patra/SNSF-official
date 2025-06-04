"use client"

import React, { useState } from 'react';
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

const Admins = () => {
  const [admins, setAdmins] = useState([
    {
      id: "U001",
      name: "Ravi Kumar",
      email: "ravi.kumar@example.com",
      phone: 9876543210,
      password: "mypassword123",
      avatar: "https://via.placeholder.com/40",
      verify_email: true,
      last_login_date: "2024-12-01",
      status: "Active",
    },
    {
      id: "U002",
      name: "Anjali Mehta",
      email: "anjali.mehta@example.com",
      phone: 9988776655,
      password: "securepass456",
      avatar: "https://via.placeholder.com/40",
      verify_email: false,
      last_login_date: "2024-11-15",
      status: "Suspended",
    },
    {
      id: "U003",
      name: "Shubham Roy",
      email: "shubham.roy@example.com",
      phone: 9123456789,
      password: "testpass789",
      avatar: "https://via.placeholder.com/40",
      verify_email: true,
      last_login_date: "2025-01-10",
      status: "Inactive",
    },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddAdmin = () => {
    const id = `U00${admins.length + 1}`;
    setAdmins([...admins, { ...newAdmin, id, avatar: "https://via.placeholder.com/40", verify_email: false, last_login_date: "", status: "Active" }]);
    setNewAdmin({ name: '', email: '', phone: '', password: '' });
    setShowAddModal(false);
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-blue-900 font-sans text-xl font-semibold">Manage Admins</h1>
        <button className="p-2 bg-green-700 text-white rounded-md" onClick={() => setShowAddModal(true)}>Add New Admin</button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative w-full h-10 px-2 gap-2 border border-slate-300 rounded-md flex items-center">
          <SearchIcon className="text-gray-600" />
          <input type="text" placeholder="Search..." className="outline-none w-full text-black" />
        </div>
        <div className="h-10 w-10 border border-slate-300 rounded-md flex items-center justify-center cursor-pointer">
          <FilterAltIcon />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full text-center border-collapse border border-slate-200 shadow-sm">
          <thead className="h-12 bg-blue-100 border-b border-slate-300">
            <tr>
              <th className="w-[50px]"><Checkbox /></th>
              <th className="text-black">Avatar</th>
              <th className="text-black">Name</th>
              <th className="text-black">Email</th>
              <th className="text-black">Phone</th>
              <th className="text-black">Password</th>
              <th className="text-black">Verified Email</th>
              <th className="text-black">Last Login</th>
              <th className="text-black">Status</th>
              <th className="text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((admin) => (
              <tr key={admin.id} className="border-b border-slate-200">
                <td><Checkbox /></td>
                <td>
                  <img src={admin.avatar} alt="avatar" className="w-10 h-10 rounded-full mx-auto" />
                </td>
                <td className="text-black">{admin.name}</td>
                <td className="text-black">{admin.email}</td>
                <td className="text-black">{admin.phone}</td>
                <td className="text-black">{showPassword ? admin.password : '********'}</td>
                <td className="text-black">{admin.verify_email ? 'Yes' : 'No'}</td>
                <td className="text-black">{admin.last_login_date}</td>
                <td className="text-black">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    admin.status === 'Active' ? 'bg-green-100 text-green-700' :
                    admin.status === 'Inactive' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {admin.status}
                  </span>
                </td>
                <td>
                  <ModeEditOutlineIcon className="text-blue-600 cursor-pointer mr-2" onClick={() => setSelectedAdmin(admin)} />
                  <DeleteOutlineIcon className="text-red-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={admins.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal open={!!selectedAdmin} onClose={() => setSelectedAdmin(null)}>
        <Box className="absolute top-1/2 left-1/2 bg-white p-6 rounded-md shadow-lg w-[400px] -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-700">Edit Admin</h2>
            <IconButton onClick={() => setSelectedAdmin(null)}><CloseIcon /></IconButton>
          </div>
          {selectedAdmin && (
            <form className="flex flex-col gap-3">
              <TextField label="Name" defaultValue={selectedAdmin.name} fullWidth />
              <TextField label="Email" defaultValue={selectedAdmin.email} fullWidth />
              <TextField label="Phone" defaultValue={selectedAdmin.phone} fullWidth />
              <TextField 
                label="Password"
                type={showPassword ? "text" : "password"}
                defaultValue={selectedAdmin.password}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
              <button type="button" className="mt-2 bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600">Save Changes</button>
            </form>
          )}
        </Box>
      </Modal>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <Box className="absolute top-1/2 left-1/2 bg-white p-6 rounded-md shadow-lg w-[400px] -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-700">Add New Admin</h2>
            <IconButton onClick={() => setShowAddModal(false)}><CloseIcon /></IconButton>
          </div>
          <form className="flex flex-col gap-3">
            <TextField label="Name" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} fullWidth />
            <TextField label="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} fullWidth />
            <TextField label="Phone" value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })} fullWidth />
            <TextField 
              label="Password"
              type={showPassword ? "text" : "password"}
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            <button type="button" className="mt-2 bg-green-700 text-white py-2 rounded-md hover:bg-green-600" onClick={handleAddAdmin}>Add Admin</button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Admins;
