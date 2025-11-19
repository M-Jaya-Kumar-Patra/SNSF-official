import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import {
  Box,
  Typography,
  Rating,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import { useAuth } from "@/app/context/AuthContext";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

 const { isCheckingToken } = useAuth()
 
 
 useEffect(() => {
   if (!productId) return;
   
   fetchDataFromApi(`/api/user/getReviews?productId=${productId}`)
   .then((res) => {
     setReviews(res?.reviews || []);
    })
    .catch((err) => {
      console.error("Failed to fetch reviews:", err);
    });
  }, [productId]);
  
  if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;
  return (
    <Box className="w-full mt-10">
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: "20px",
          color: "#1e293b",
          mb: 2,
          borderBottom: "2px solid #e2e8f0",
          pb: 1,
        }}
      >
        Customer Reviews
      </Typography>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              display: "flex",
              gap: 2,
              p: 2.5,
              mb: 2,
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <Avatar sx={{ bgcolor: "#3b82f6" }}>
              {review?.userName?.[0]?.toUpperCase() || "U"}
            </Avatar>

            <Box flex={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>
                  {review.userName || "Anonymous"}
                </Typography>
                <Rating
                  name="read-only"
                  value={review.rating || 0}
                  readOnly
                  size="small"
                />
              </Box>

              <Typography sx={{ fontSize: "14px", color: "#4b5563", mt: 0.5 }}>
                {review.review}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography
          sx={{
            fontSize: "15px",
            fontStyle: "italic",
            color: "#6b7280",
            mt: 2,
          }}
        >
          No reviews yet. Be the first to review this product.
        </Typography>
      )}
    </Box>
  );
};

export default Reviews;
