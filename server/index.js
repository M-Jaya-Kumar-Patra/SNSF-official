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
import adminRouter from './route/admin.route.js';
import sliderRouter from './route/homeSlider.route.js';
import wishRouter from './route/wishlist.route.js';
import noticeRouter from './route/notification.route.js';
import visitRouter from './route/visitCount.js';
import enquiryRouter from './route/enquiry.route.js';

const app = express();

console.log('Starting server setup...');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://snsf-o5mp.onrender.com',
    'https://snsteelfabrication.com',
    'https://snsf-admin.onrender.com',
    'https://snsteelfabrication.com',
    'https://snsf-ar3m.onrender.com',
    'https://snsf-admin-jrst.onrender.com',
    'https://snsf-ydwh.onrender.com',
    'https://snsf-admin-n27n.onrender.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
console.log('CORS middleware configured');


app.use(express.json());
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

connectDB().then(() => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to database:', err);
});
