"use client";

import React from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

export default function ProductSpecs({ specs, title = "Product Specifications" }) {
  if (!specs || Object.keys(specs).length === 0) return null;

  const formatKey = (key) =>
    key
      .replace(/([A-Z])/g, " $1") // camelCase to spaced words
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();

  return (  
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: "1px",
        backgroundColor: "#fff",
        overflow: "hidden",
        mt: 3,
      }}
    >
      <Typography
        variant="h6"
        component="h3"
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #e0e0e0",
          fontWeight: 600,
          fontSize: "18px",
          color: "#333",
          backgroundColor: "#f9fafb",
        }}
      >
        {title}
      </Typography>

      <Table size="small" sx={{ minWidth: 300 }}>
        <TableBody>
          {Object.entries(specs)
            .filter(([_, value]) => value && value !== "")
            .map(([key, value], index) => (
              <TableRow
                key={key}
                sx={{
                  "&:not(:last-child)": {
                    borderBottom: "1px solid #f0f0f0",
                  },
                  backgroundColor: index % 2 === 0 ? "#fcfcfc" : "#f8f8f8",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 500,
                    color: "#444",
                    textTransform: "capitalize",
                    width: "40%",
                    px: 3,
                    py: 1.5,
                    fontSize: "15px",
                  }}
                >
                  {formatKey(key)}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#333",
                    px: 3,
                    py: 1.5,
                    fontSize: "15px",
                  }}
                >
                  {value}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

ProductSpecs.propTypes = {
  specs: PropTypes.object.isRequired,
  title: PropTypes.string,
};
