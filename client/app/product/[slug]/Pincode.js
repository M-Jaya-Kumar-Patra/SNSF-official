"use client";

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useAuth } from "@/app/context/AuthContext";

const Pincode = () => {
   const { isCheckingToken } = useAuth()
      if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;
    const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState(null);

  const checkAvailability = () => {
    if (!pincode || pincode.length !== 6) {
      setStatus("invalid");
      return;
    }

    const availablePincodes = [761146, 761102, 760008]

    const isAvailable = availablePincodes.includes(Number(pincode));
    setStatus(isAvailable ? "available" : "unavailable");
  };
  return (
    <div className="w-full max-w-md mx-auto pt-4 sm:p-4 sm:pt-0">
      <div className="flex sm:flex-col flex-row gap-3">
        <TextField
          label="Enter Pincode"
          variant="outlined"
          fullWidth
          size="small"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          inputProps={{ maxLength: 6 }}
          className="border border-[#2563eb] text-[#2563eb]"
        />
        <Button variant="contained" className="!bg-primary-gradient" onClick={checkAvailability}>
          Check
        </Button>
      </div>

      {status === "available" && (
        <div className="mt-4 text-green-600 flex items-center gap-2">
          <CheckCircle /> Delivery is available at this pincode!
        </div>
      )}
      {status === "unavailable" && (
        <div className="mt-4 text-red-600 flex items-center gap-2">
          <Cancel /> Sorry, delivery is not available at this pincode.
        </div>
      )}
      {status === "invalid" && (
        <div className="mt-4 text-yellow-600 flex items-center gap-2">
          <Cancel /> Please enter a valid 6-digit pincode.
        </div>
      )}
    </div>
  )
}

export default Pincode
