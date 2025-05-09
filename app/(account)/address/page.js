"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, CreditCard, Bell, Heart, LogOut } from "lucide-react";
import { useRef } from "react";
import { v4 as uuidv4 } from 'uuid';


const Account = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const fullName = session?.user?.name || "";
    const initialFirstName = fullName.split(" ")[0] || "";
    const initialLastName = fullName.split(" ")[1] || "";

    // Load from localStorage if available
    // const storedFirstName = typeof window !== "undefined" ? localStorage.getItem("firstName") : null;
    // const storedLastName = typeof window !== "undefined" ? localStorage.getItem("lastName") : null;

    const [storedFirstName, setStoredFirstName] = useState(null);
    const [storedLastName, setStoredLastName] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);


    useEffect(() => {
        if (typeof window !== "undefined") {
            setStoredFirstName(localStorage.getItem("firstName") || "");
            setStoredLastName(localStorage.getItem("lastName") || "");
        }
    }, []);



    // // States for input fields
    // const [firstName, setFirstName] = useState(storedFirstName || initialFirstName);
    // const [lastName, setLastName] = useState(storedLastName || initialLastName);

    const [firstName, setFirstName] = useState(() => storedFirstName || initialFirstName);
    const [lastName, setLastName] = useState(() => storedLastName || initialLastName);


    // Edit mode states

    // Temporary states for new values
    const [newFirstName, setNewFirstName] = useState(firstName);
    const [newLastName, setNewLastName] = useState(lastName);


    const [addAddress, setAddAddress] = useState(false);

    const [editIndex, setEditIndex] = useState(null);
    const [editAddress, setEditAddress] = useState({});


    // Save name updates
    // Save email updates


    const addressRef = useRef()
    const [address, setAddress] = useState({ cName: "", phone: "", pincode: "", locality: "", area: "", city: "", state: "" })
    const [addressArray, setaddressArray] = useState([])


    const [showEditDelAddr, setShowEditDelAddr] = useState(Array(addressArray.length).fill(false));


    // useEffect(() => {
    //     let addresses = localStorage.getItem("addresses");
    //     if (addresses) {
    //         setaddressArray(JSON.parse(addresses))
    //     }
    // }, [])

    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowEditDelAddr(Array(addressArray.length).fill(false));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [addressArray]);




    useEffect(() => {
        if (typeof window !== "undefined") {
            const addresses = localStorage.getItem("addresses");
            if (addresses) {
                setaddressArray(JSON.parse(addresses));
                setShowAddressForm(false)
            }
        }
    }, []);


    const deleteAddress = (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            const updatedAddresses = addressArray.filter(item => item.id !== id);
            setaddressArray(updatedAddresses);
            localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
        }
    };


    const toggleEditDel = (index) => {
        const updatedState = [...showEditDelAddr];
        updatedState[index] = !updatedState[index];
        setShowEditDelAddr(updatedState);
    };


    // const saveAddress = () => {
    //     const updatedAddressArray = [...addressArray, { ...address, id: uuidv4() }]

    //     setaddressArray(updatedAddressArray);

    //     localStorage.setItem("addresses", JSON.stringify(updatedAddressArray));
    //     console.log("saved addresses: ", updatedAddressArray);
    // }

    const saveAddress = () => {
        if (
            !address.cName || !address.phone || !address.pincode || !address.locality ||
            !address.address || !address.city 
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        const newAddress = { ...address, id: uuidv4() };
        if (newAddress !== null) {
            const updatedAddressArray = [...addressArray, newAddress];

            setaddressArray(updatedAddressArray);
            localStorage.setItem("addresses", JSON.stringify(updatedAddressArray));
            setShowAddressForm(false)
        }
    };



    const saveEditedAddress = () => {
        const updatedAddresses = [...addressArray];
        updatedAddresses[editIndex] = editAddress;
        setaddressArray(updatedAddresses);
        localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
        setEditIndex(null);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditAddress(addressArray[index]);
    };


    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    }


    const handleEditChange = (e) => {
        
        setEditAddress({ ...editAddress, [e.target.name]: e.target.value });
    };



    return (
        <>
            <div className="flex w-full min-h-screen justify-center bg-slate-100">
                <div className="w-[1020px] my-3 mx-auto flex justify-between">

                    {/* Left Sidebar */}
                    <div className="left h-full">
                        <div className="leftupper h-16 bg-white shadow-lg p-2 flex gap-3 items-center">
                            <img
                                className="h-full rounded-full"
                                src={session?.user?.image || "/images/account.png"}
                                alt="User Profile"
                            />
                            <h1 className="text-black font-sans font-semibold">{firstName} {lastName}</h1>
                        </div>

                        <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
                            <ul className="text-gray-600 font-sans">
                                <li>
                                    <Link href="/orders">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <Package size={18} /> My Orders
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
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer  text-[#131e30] bg-slate-100 active:bg-slate-100">
                                            Manage Address
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/payments">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <CreditCard size={18} /> Payments
                                        </div>
                                    </Link>
                                </li>
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
                                    <div
                                        onClick={handleLogout}
                                        className="h-[50px] flex items-center pl-5 font-semibold text-red-600 cursor-pointer active:bg-slate-100 gap-2">
                                        <LogOut size={18} /> Logout
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Profile Section */}
                    <div className="right h-full w-[750px] bg-white shadow-lg p-5">
                        <div className="mb-6">
                            <span className="text-black font-semibold font-sans text-[20px]">Manage addresses</span>
                        </div>

                        {!showAddressForm && (
                            <button
                                onClick={() => setShowAddressForm(true)}
                                className=" border border-[#131e30] h-10 bg-[#131e30] flex items-center font-sans p-5 text-lg font-normal gap-2 rounded-md">
                                <b>+</b>Add a new address
                            </button>
                        )}
                        {showAddressForm && (
                            <div className='w-full bg-slate-100 h-auto text-black font-sans p-5 border border-slate-300'>
                                <h1 className="font-medium">Add a new address</h1>
                                <br />
                                {/* cName: " ", phone: " ", pincode: " ", locality:" ", area:" ", city:" ", state:"  */}
                                {/* Name filed */}


                                <div className="flex justify-between w-full gap-3 mb-3">
                                    <input value={editIndex !== null ? editAddress.cName : address.cName} onChange={editIndex !== null ? handleEditChange : handleChange} type="text" placeholder='Name' name="cName" className="outline-none rounded-sm border placeholder-slate-500 border-slate-300 w-[50%] px-4 py-2" />

                                    <input value={editIndex !== null ? editAddress.phone : address.phone} onChange={editIndex !== null ? handleEditChange : handleChange} type="number" placeholder='Phone number' className="outline-none rounded-sm border border-slate-300 w-[50%] placeholder-slate-500 px-4 py-2 " name="phone" id="phone" />
                                </div>


                                <div className="flex justify-between w-full gap-3 mb-3">
                                <input value={editIndex !== null ? editAddress.pincode : address.pincode} onChange={editIndex !== null ? handleEditChange : handleChange} type="number" placeholder='Pincode' className="outline-none rounded-sm border border-slate-300 w-[50%] placeholder-slate-500 px-4 py-2 " name="pincode" id="pincode" />


                                <input value={editIndex !== null ? editAddress.locality : address.locality} onChange={editIndex !== null ? handleEditChange : handleChange} type="text" placeholder='Locality' className="outline-none rounded-sm border border-slate-300 w-[50%] placeholder-slate-500 px-4 py-2 " name="locality" id="locality" />
                                </div>

                                <textarea value={editIndex !== null ? editAddress.address : address.address} onChange={editIndex !== null ? handleEditChange : handleChange} type="text" placeholder='Address' className="mb-3 text-wrap  outline-none rounded-sm border border-slate-300 w-full placeholder-slate-500 px-4 py-2 " name="address" id="address" />

                                <div className="flex justify-between w-full gap-3 mb-3">

                                    <input value={editIndex !== null ? editAddress.area : address.area} onChange={editIndex !== null ? handleEditChange : handleChange} type="text" placeholder='Area' className="outline-none rounded-sm border border-slate-300 w-[50%] placeholder-slate-500 px-4 py-2 " name="area" id="area" />

                                    <input value={editIndex !== null ? editAddress.city : address.city} onChange={editIndex !== null ? handleEditChange : handleChange} type="text" placeholder='City' className="outline-none rounded-sm border border-slate-300 w-[50%] placeholder-slate-500 px-4 py-2    " name="city" id="city" />


                                </div>



                                <div className="flex  justify-center items-center w-full">
                                <button onClick={saveAddress} className=' flex justify-center items-center gap-2 py-1  bg-[#131e30] text-white w-fit rounded-full hover:bg-[#445570]  mt-10 mx-auto px-3 font-medium py-auto align centeer border border-gray-700'>
                                    Save Address</button>
                                <button onClick={()=>setShowAddressForm(false)} className=' flex justify-center items-center gap-2 py-1   text-[#131e30] w-fit rounded-full hover:bg-red-500 hover:text-white mt-10 mx-auto px-5 font-medium py-auto align centeer border border-gray-700'>Cancel</button>
                                </div>
                            </div>)}    


                        <div className="address">
                            {addressArray.length === 0 ? (
                                <div>
                                    <h1>No address to show</h1>
                                </div>
                            ) : (
                                addressArray.map((item, index) => (
                                    <div key={index} className="flex border border-slate-300 my-2">
                                        <div className="p-3 text-[#131e30] font-sans w-[90%]">
                                            {editIndex === index ? (
                                                <>
                                                    <input value={editAddress.cName} name="cName" onChange={handleEditChange} />
                                                    <input value={editAddress.phone} name="phone" onChange={handleEditChange} />
                                                    <input value={editAddress.locality} name="locality" onChange={handleEditChange} />
                                                    <input value={editAddress.city} name="city" onChange={handleEditChange} />
                                                    <input value={editAddress.state} name="state" onChange={handleEditChange} />
                                                    <input value={editAddress.pincode} name="pincode" onChange={handleEditChange} />
                                                    <button onClick={saveEditedAddress}>Save</button>
                                                </>
                                            ) : (
                                                <>
                                                    <p>{item.cName}</p>
                                                    <p>{item.phone}</p>
                                                    <p>{item.locality}, {item.address}, {item.area}</p>
                                                    <p>{item.city} - {item.pincode}</p>
                                                    <p>{item.state}</p>
                                                </>
                                            )}
                                        </div>

                                        {!showEditDelAddr[index] ? (
                                            <div className="p-3">
                                                <img
                                                    onClick={() => toggleEditDel(index)}
                                                    className="w-[30px]  cursor-pointer"
                                                    src="/images/menu.png"
                                                    alt="Menu"
                                                />
                                            </div>
                                        ) : (
                                            <div ref={menuRef} className="p-3 text-black font-normal text-sm font-sans h-full">
                                                <ul className="shadow-md">
                                                    <li
                                                        className="h-[50%] bt-0 border-gray-400 px-2 py-1 text-center bg-white hover:bg-gray-100 cursor-pointer   "
                                                        onClick={() => handleEdit(index)}>
                                                        Edit
                                                    </li>
                                                    <li
                                                        onClick={() => deleteAddress(item.id)}
                                                        className="h-[50%] border-gray-400 border-t-0 px-2 py-1 text-center bg-white cursor-pointer hover:bg-gray-100"
                                                    >
                                                        Delete
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>



                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
