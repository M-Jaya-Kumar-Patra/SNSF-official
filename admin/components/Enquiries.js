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
      if (res?.success) setEnquiries(res.data);
    } catch {
      setEnquiries([]);
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
    } catch {
      return;
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200">
        <Typography variant="h6" className="font-semibold text-slate-800">
          Customer Enquiries
        </Typography>
        <p className="text-sm text-slate-500 mt-1">
          All customer product enquiries in one place
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <CircularProgress size={28} />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          No enquiries found.
        </div>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow className="bg-slate-50">
                <TableCell className="font-semibold">Product ID</TableCell>
                <TableCell className="font-semibold">Image</TableCell>
                <TableCell className="font-semibold">Product</TableCell>
                <TableCell className="font-semibold">Customer</TableCell>
                <TableCell className="font-semibold">Contact</TableCell>
                <TableCell className="font-semibold">Message</TableCell>
                <TableCell className="font-semibold">Date</TableCell>
                <TableCell align="center" className="font-semibold">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {enquiries.slice().reverse().map((enq) => (
                <TableRow
                  key={enq._id}
                  hover
                  className="transition hover:bg-slate-50"
                >
                  <TableCell className="text-xs text-slate-500">
                    {enq.productId?._id}
                  </TableCell>

                  <TableCell>
                    {enq?.image ? (
                      <img
                        src={enq.image}
                        alt="Product"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <span className="text-slate-400 italic text-sm">
                        No image
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="font-medium text-slate-800">
                    {enq.productId?.name || "-"}
                  </TableCell>

                  <TableCell>
                    {enq.contactInfo?.name || "-"}
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <div>{enq.contactInfo?.email || "-"}</div>
                      <div className="text-slate-500">
                        {enq.contactInfo?.phone || "-"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={enq.message || ""}>
                      <span className="text-sm text-slate-600 cursor-help">
                        {enq.message?.slice(0, 30)}…
                      </span>
                    </Tooltip>
                  </TableCell>

                  <TableCell className="text-sm text-slate-500">
                    {new Intl.DateTimeFormat("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(enq.createdAt))}
                  </TableCell>

                  <TableCell align="center">
                    <div className="flex justify-center gap-1">
                      <Tooltip title="View Product">
                        <IconButton
                          size="small"
                          onClick={() =>
                            window.open(
                              `/product/${enq.productId?._id}`,
                              "_blank"
                            )
                          }
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Enquiry">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(enq._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
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
