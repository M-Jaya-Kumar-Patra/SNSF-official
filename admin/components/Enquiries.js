"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { deleteProduct, fetchDataFromApi } from "@/utils/api";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi("/api/enquiries/admin");
      if (res?.success) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      const res = await deleteProduct(`/api/enquiries/${id}`);
      if (res?.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete enquiry", err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <Typography variant="h5" gutterBottom className="font-bold">
        Customer Enquiries
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <CircularProgress />
        </div>
      ) : enquiries.length === 0 ? (
        <Typography className="text-center text-gray-500 py-5">
          No enquiries found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="enquiries table">
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Phone & Email</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Date & Time</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiries.slice().reverse().map((enq) => (
                <TableRow key={enq._id}>


                  <TableCell>{enq.productId?._id}</TableCell>

                  <TableCell>
                    {enq?.image ? (
                      <img
                        src={enq.image}
                        alt="Product"
                        className="w-40 h-[30] object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </TableCell>
                  <TableCell>{enq.productId?.name || "-"}</TableCell>
                  <TableCell>{enq.contactInfo?.name || "-"}</TableCell>



                  <TableCell><div className="!flex !flex-col !gap-5">
                    <div>{enq.contactInfo?.email || "-"} </div> 
                    <div>{enq.contactInfo?.phone || "-"}</div>
                    </div>
                  </TableCell>

                  <TableCell>{enq.message?.slice(0, 40)}...</TableCell>
                  <TableCell>
                    {new Date(enq.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Product">
                      <IconButton
                        onClick={() =>
                          window.open(`/product/${enq.productId?._id}`, "_blank")
                        }
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Enquiry">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(enq._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Enquiries;
