'use client';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function PersistentLoader() {
  return (
    <Backdrop
      sx={(theme) => ({
        color: '#fff',
        zIndex: theme.zIndex.drawer + 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      })}
      open={true} // always visible
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
