import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import express from 'express';
import cors from 'cors';
import compression from "compression";
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimiter } from "./middlewares/rateLimiter.js";
import connectDB from './config/connectDb.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import productRouter from './route/product.route.js';
import adminRouter from './route/admin.route.js';
import sliderRouter from './route/homeSlider.route.js';
import wishRouter from './route/wishlist.route.js';
import noticeRouter from './route/notification.route.js';
import visitRouter from './route/visitCount.js';
import enquiryRouter from './route/enquiry.route.js';
import visitorRouter from './route/visitor.routes.js';
import recommendRouter from './route/recommendation.routes.js';
import productEventRouter from './route/productEvent.route.js';
import sectionRouter from './route/homeSection.route.js';
import styleSpaceRouter from './route/styleYourSpace.route.js';
import posterRouter from './route/poster.route.js';
import analyticsRouter from './route/analytics.route.js';
import videoRouter from './route/video.route.js';



const app = express();
app.set("trust proxy", 1);

console.log('Starting server setup...');
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`),
        false
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


console.log('CORS middleware configured');

app.use(compression());
console.log('Compression middleware enabled');

app.use(rateLimiter());
console.log('Rate limiter enabled');

app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "1mb" }));
app.use(express.urlencoded({ extended: true, limit: process.env.JSON_BODY_LIMIT || "1mb" }));
console.log('JSON body parser enabled');

app.use(cookieParser());
console.log('Cookie parser enabled');

app.use(morgan('dev'));
console.log('Morgan logger enabled');

app.use(helmet());
console.log('Helmet security middleware enabled');

// Test route
app.get("/", (req, res) => {
  console.log('GET / called');
  res.json({ message: "Server is running on the port " + process.env.PORT });
});

// Use routers and log when attached
app.use("/api/user", userRouter);

app.use('/api/category', categoryRouter);

app.use('/api/product', productRouter);

app.use('/api/admin', adminRouter);

app.use('/api/homeSlider', sliderRouter);

app.use('/api/wishlist', wishRouter);

app.use('/api/notice', noticeRouter);

app.use('/api/visit', visitRouter);

app.use('/api/enquiries', enquiryRouter);

app.use("/api/visitor", visitorRouter);

app.use("/api/recommendations", recommendRouter);

app.use("/api/productEvent", productEventRouter);

app.use("/api/home-sections", sectionRouter);

app.use("/api/style-your-space", styleSpaceRouter);

app.use("/api/poster", posterRouter);

app.use("/api/analytics", analyticsRouter);

app.use("/api/videos", videoRouter);

app.use((err, req, res, next) => {
  if (!err) return next();

  const isUploadError =
    err.name === "MulterError" ||
    err.message?.startsWith("Unsupported file type") ||
    err.message === "Only video files are allowed!";

  if (isUploadError) {
    const statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(statusCode).json({
      success: false,
      error: true,
      message: err.message,
    });
  }

  console.error("Unhandled request error:", err);
  return res.status(err.statusCode || 500).json({
    success: false,
    error: true,
    message: err.statusCode ? err.message : "Internal server error",
  });
});


connectDB().then(() => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to database:', err);
});
