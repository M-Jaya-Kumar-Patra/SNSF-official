"use client";
import React from "react";
import { WifiOff } from "lucide-react"; // or any icon of your choice
import Button from "@mui/material/Button";

const NoInternet = ({ onRetry }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <WifiOff className="w-28 h-28 text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Internet Connection</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Please check your connection and try again.
      </p>
      <Button
        variant="contained"
        className="!bg-primary-gradient"
        onClick={onRetry || (() => window.location.reload())}
      >
        Retry
      </Button>
    </div>
  );
};

export default NoInternet;
