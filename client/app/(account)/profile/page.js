"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, CreditCard, Bell, Heart, LogOut } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';




const Account = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        let c = confirm("Are you sure?")
        if (c) {
            await signOut({ callbackUrl: '/' });
        }
    };

    const fullName = session?.user?.name || "";
    const initialFirstName = fullName.split(" ")[0] || "";
    const initialLastName = fullName.split(" ")[1] || "";
    const initialEmail = session?.user?.email || "";
    const initialPhone = "+91 ";

    // // Load from localStorage if available
    // const storedFirstName = typeof window !== "undefined" ? localStorage.getItem("firstName") : null;
    // const storedLastName = typeof window !== "undefined" ? localStorage.getItem("lastName") : null;
    // const storedEmail = typeof window !== "undefined" ? localStorage.getItem("email") : null;
    // const storedPhone = typeof window !== "Undefined" ? localStorage.getItem("phone") :null;

    // // States for input fields
    // const [firstName, setFirstName] = useState(initialFirstName);
    // const [lastName, setLastName] = useState(initialLastName);
    // const [email, setEmail] = useState(initialEmail);
    // const [phone, setPhone] = useState(initialPhone);
    // States for input fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");



    useEffect(() => {
        const storedFirstName = localStorage.getItem("firstName") || initialFirstName;
        const storedLastName = localStorage.getItem("lastName") || initialLastName;
        const storedEmail = localStorage.getItem("email") || initialEmail;
        const storedPhone = localStorage.getItem("phone") || initialPhone;

        setFirstName(storedFirstName);
        setLastName(storedLastName);
        setEmail(storedEmail);
        setPhone(storedPhone);
    }, [session]); // Runs when session data changes



    // Edit mode states
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);

    // Temporary states for new values
    const [newFirstName, setNewFirstName] = useState(firstName);
    const [newLastName, setNewLastName] = useState(lastName);
    const [newEmail, setNewEmail] = useState(email);
    const [newPhone, setNewPhone] = useState(phone);

    // localStorage.setItem("firstName", firstName);
    // localStorage.setItem("lastName", lastName);
    // localStorage.setItem("email", email);
    // localStorage.setItem("phone", phone);

    // Save name updates
    const handleUpdateName = () => {
        setFirstName(newFirstName);
        setLastName(newLastName);
        localStorage.setItem("firstName", newFirstName);
        localStorage.setItem("lastName", newLastName);
        setEditName(false);
    };

    // Save email updates
    const handleUpdateEmail = () => {
        setEmail(newEmail);
        localStorage.setItem("email", newEmail);
        setEditEmail(false);
    };

    const handleUpdatePhone = () => {
        setPhone(newPhone);
        localStorage.setItem("phone", newPhone);
        setEditPhone(false);
    }

    

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
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer text-[#131e30] bg-slate-100 active:bg-slate-100">
                                            Profile Information
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/address">
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer active:bg-slate-100">
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

                        {/* Name Section */}
                        <div className="mb-6">
                            <span className="text-black font-semibold font-sans text-[20px]">Profile Information</span>
                            {!editName ? (
                                <div className="mt-4 flex gap-3 items-center">
                                    <div className="text-lg font-sans text-slate-600 w-[200px] px-2 bg-gray-100 rounded-sm border border-gray-300">
                                        {firstName}
                                    </div>
                                    <div className="text-lg font-sans text-slate-600 w-[200px] px-2 bg-gray-100 rounded-sm border border-gray-300">
                                        {lastName}
                                    </div>
                                    <img
                                        onClick={() => setEditName(true)}
                                        className="h-7 cursor-pointer"
                                        src="/images/edit.png"
                                        alt="Edit"
                                    />
                                </div>
                            ) : (
                                <div className="mt-4 flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={newFirstName}
                                        onChange={(e) => setNewFirstName(e.target.value)}
                                        className="text-lg font-sans text-slate-600 w-[200px] px-2 bg-gray-100 rounded-sm border border-gray-300 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={newLastName}
                                        onChange={(e) => setNewLastName(e.target.value)}
                                        className="text-lg font-sans text-slate-600 w-[200px] px-2 bg-gray-100 rounded-sm border border-gray-300 outline-none"
                                    />
                                    <img
                                        onClick={handleUpdateName}
                                        className="h-7 cursor-pointer"
                                        src="/images/check.png"
                                        alt="Update"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Email Section */}
                        <div className="mb-6">
                            <span className="text-black font-semibold font-sans text-[20px]">Email address</span>
                            {!editEmail ? (
                                <div className="mt-4 flex gap-3 items-center">
                                    <div className="text-lg font-sans text-slate-600 w-[300px] px-2 bg-gray-100 rounded-sm border border-gray-300">
                                        {email}
                                    </div>
                                    <img
                                        onClick={() => setEditEmail(true)}
                                        className="h-7 cursor-pointer"
                                        src="/images/edit.png"
                                        alt="Edit"
                                    />
                                </div>
                            ) : (
                                <div className="mt-4 flex gap-3 items-center">
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="text-lg font-sans text-slate-600 w-[300px] px-2 bg-gray-100 rounded-sm border border-gray-300 outline-none"
                                    />
                                    <img
                                        onClick={handleUpdateEmail}
                                        className="h-7 cursor-pointer"
                                        src="/images/check.png"
                                        alt="Update"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mb-6">
                            <span className="text-black font-semibold font-sans text-[20px]">Phone number</span>
                            {!editPhone ? (
                                <div className="mt-4 flex gap-3 items-center">
                                    <div className="text-lg font-sans text-slate-600 w-[200px] px-2 bg-gray-100 rounded-sm border border-gray-300">
                                        {phone}
                                    </div>
                                    <img
                                        onClick={() => setEditPhone(true)}
                                        className="h-7 cursor-pointer"
                                        src="/images/edit.png"
                                        alt="Edit"
                                    />
                                </div>
                            ) : (
                                <div className="mt-4 flex gap-3 items-center">
                                    <input
                                        type="tel"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className=" text-lg font-sans text-slate-600 w-[200px] px-2 bg-gray-100 rounded-sm border border-gray-300 outline-none"
                                    />
                                    <img
                                        onClick={handleUpdatePhone}
                                        className="h-7 cursor-pointer"
                                        src="/images/check.png"
                                        alt="Update"
                                    />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;