"use client";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import { BsBoxSeamFill, BsFillPeopleFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [state, setState] = useState({ right: false });
  const [selectedText, setSelectedText] = useState("Dashboard");
  const anchor = 'right';

  const toggleDrawer = (anchor, open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setState({ ...state, [anchor]: open });
  };

  const navItems = ['Dashboard', 'Products', 'Categories', 'Users', 'Customers'];
  const Router = useRouter();

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className='bg-red-50'>

        {/* Close Button */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleDrawer(anchor, false)}>
            <ListItemIcon>
              <RxCross2 />
            </ListItemIcon>
            <ListItemText primary="Close" />
          </ListItemButton>
        </ListItem>

        {/* Menu Items */}
        {navItems.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => {
              setSelectedText(text);
              text === "Dashboard" ? Router.push("/") : Router.push(`/${text}`);
              setState({ ...state, [anchor]: false });
            }}>
              <ListItemIcon>
                {index === 0 ? <DashboardIcon /> :
                  index === 1 ? <BsBoxSeamFill size={20} /> :
                    index === 2 ? <CategoryIcon /> :
                    index === 3 ? <BsFillPeopleFill size={20} />:
                      <BsFillPeopleFill size={20} />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {/* Top Navbar */}
      <div className="py-2 w-full border border-slate-100 shadow-md bg-white font-bold flex items-center justify-between px-7">
        <div className='w-16 h-16'>
          <img src="images/logo.png" alt="Logo" className='rounded-full' />
        </div>
        {/* ✅ Fixed the menu click issue */}
        <MenuIcon
          onClick={(e) => toggleDrawer(anchor, true)(e)}
          className="text-black cursor-pointer"
        />
        <SwipeableDrawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          {list()}
        </SwipeableDrawer>
      </div>
    </div>
  );
};

export default Navbar;
