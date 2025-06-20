import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDb.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import adminRouter from './route/admin.route.js'
import sliderRouter from './route/homeSlider.route.js';
import wishRouter from './route/wishlist.route.js'
import orderRouter from './route/order.route.js'

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://snsf-o5mp.onrender.com', 'http://192.168.137.1:3000/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // ✅ Needed to allow cookies and auth headers
}));


app.use(express.json());

app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running on port " + process.env.PORT });
});

app.use("/api/user", userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/admin', adminRouter);
app.use('/api/homeSlider', sliderRouter);
app.use('/api/wishlist', wishRouter);
app.use('/api/order', orderRouter);







// Connect DB and start server  
connectDB().then(() => {
  const port = process.env.PORT || 8000; // Default port if .env doesn't provide one
  app.listen(port, () => {
    console.log("✅ Server is running on port", port);
  });
});
