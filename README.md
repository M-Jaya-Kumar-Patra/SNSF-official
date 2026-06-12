# SNSF - S N Steel Fabrication E-commerce Platform

A full-stack furniture e-commerce and business management platform built for **S N Steel Fabrication**. The repository contains a customer-facing website, an admin dashboard, an Express API, analytics tracking, recommendation jobs, and media/content management tools.

Live website: [snsteelfabrication.com](https://snsteelfabrication.com)

## Project Overview

This project is split into three main applications:

- `client` - Next.js customer website for browsing products, account flows, wishlist, enquiries, videos, posters, and home-page content.
- `admin` - Next.js admin dashboard for managing products, categories, homepage content, videos, posters, users, enquiries, and analytics.
- `server` - Node.js/Express API with MongoDB models, authentication, upload handling, analytics endpoints, recommendation services, queues, and workers.

## Features

### Customer Website

- Responsive product browsing for desktop and mobile.
- Category, subcategory, and third-level category product discovery.
- Product listing, filtering, sorting, search, suggestions, new arrivals, best sellers, and recently viewed products.
- Product detail pages with image galleries, specifications, related content, and pincode serviceability checks.
- Authentication flows for signup, login, email verification, OTP resend, forgot password, reset password, and Google sign-in.
- Account pages for profile, address book, wishlist, enquiries, notifications, and payments.
- Homepage sections for sliders, curated products, shop by room/category, posters, videos, style-your-space content, and trending content.
- Visitor, page, search, and product-event tracking for analytics.
- PWA/service-worker assets and SEO routes including sitemap and robots.txt.

### Admin Dashboard

- Secure admin authentication and account management.
- Product CRUD with image upload and Cloudinary integration.
- Category and subcategory management.
- Homepage manager, home slider manager, poster manager, video manager, and style-your-space manager.
- User and enquiry management.
- Analytics dashboard with KPIs, active users, live users, login activity, visitor trends, device/browser/country breakdowns, page engagement, product engagement, search insights, and wishlist leaderboard.
- Promotional email tooling.

### Backend API

- Express API with MongoDB/Mongoose data models.
- JWT and cookie-based authentication for users and admins.
- Google OAuth support.
- Cloudinary-backed media upload for products, categories, posters, profile images, and videos.
- Email services for verification, password reset, welcome, login, promotional, and recommendation emails.
- Analytics routes for visitor, session, page, product, search, user, and login metrics.
- Recommendation service and scheduled recommendation email jobs.
- Redis-backed cache, rate limiting, and BullMQ workers when Redis is configured.
- Security and performance middleware including Helmet, CORS, compression, request size limits, and rate limiting.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Customer site | Next.js, React, Tailwind CSS, MUI, styled-components, Framer Motion, Swiper, Zustand |
| Admin dashboard | Next.js, React, Tailwind CSS, MUI, Recharts, dnd-kit, Framer Motion |
| API server | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, cookies, Google OAuth |
| Media | Cloudinary, Multer |
| Email | Resend, Nodemailer |
| Analytics/jobs | Redis, BullMQ, node-cron |
| Other integrations | Firebase, Google Maps, Razorpay dependency support |

## Folder Structure

```text
.
├── admin/        # Admin dashboard built with Next.js
├── client/       # Customer storefront built with Next.js
├── server/       # Express API, models, controllers, routes, jobs, workers
├── screenShots/  # README screenshots
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.18 or newer. Node.js 20+ is recommended.
- npm.
- MongoDB database connection string.
- Cloudinary account for media uploads.
- Google OAuth credentials if Google login is enabled.
- Redis URL if you want caching, queues, workers, or distributed rate limiting.

### Install Dependencies

Install dependencies separately because each app has its own `package.json`.

```bash
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

### Environment Variables

Create environment files in each app folder. The values below show the main variables used by the codebase.

#### `server/.env`

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

JWT_SECRET=your_jwt_secret
SECRET_KEY_ACCESS_TOKEN=your_access_token_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret

GOOGLE_CLIENT_ID=your_google_client_id
RESEND_API_KEY=your_resend_api_key
DESTINATION_EMAIL=business_or_admin_email

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

cloudinary_Config_Cloud_Name=your_cloudinary_cloud_name
cloudinary_Config_API_Key=your_cloudinary_api_key
cloudinary_Config_API_Secret=your_cloudinary_api_secret

REDIS_URL=your_redis_url
QUEUE_ENABLED=true
RATE_LIMIT_ENABLED=true
```

Optional server settings include `JSON_BODY_LIMIT`, `UPLOAD_TMP_DIR`, `UPLOAD_MAX_FILE_SIZE_MB`, `UPLOAD_MAX_FILES`, `UPLOAD_ALLOWED_MIME_TYPES`, `VIDEO_UPLOAD_TMP_DIR`, `VIDEO_UPLOAD_MAX_FILE_SIZE_MB`, `RECOMMENDATION_CRON`, cache TTL values, and `SERVICEABLE_PINS_1`, `SERVICEABLE_PINS_2`, `SERVICEABLE_PINS_3`.

#### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGODB_URI=your_mongodb_connection_string
```

#### `admin/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGODB_URI=your_mongodb_connection_string
MONGODB_URL=your_mongodb_connection_string
```

### Run Locally

Start the API server:

```bash
cd server
npm run dev
```

Start the customer website:

```bash
cd client
npm run dev
```

Start the admin dashboard on a separate port:

```bash
cd admin
npm run dev -- -p 3001
```

Local URLs:

- Customer website: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3001](http://localhost:3001)
- API server: [http://localhost:8000](http://localhost:8000)

## Useful Scripts

| Location | Script | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Run the customer website in development mode |
| `client` | `npm run build` | Build the customer website |
| `client` | `npm run start` | Start the built customer website |
| `admin` | `npm run dev` | Run the admin dashboard in development mode |
| `admin` | `npm run build` | Build the admin dashboard |
| `admin` | `npm run start` | Start the built admin dashboard on port 3001 |
| `server` | `npm run dev` | Run the API with nodemon |
| `server` | `npm run start` | Run the API with Node |
| `server` | `npm run worker` | Run BullMQ background workers |
| `server` | `npm run cron:recommendations` | Run the recommendation cron process |
| `server` | `npm run recommendations:once` | Execute recommendation emails once |
| `server` | `npm run db:indexes` | Create configured MongoDB indexes |

## API Modules

The server mounts these main route groups:

| Route prefix | Purpose |
| --- | --- |
| `/api/user` | User auth, profile, addresses, password flows, login analytics |
| `/api/admin` | Admin auth, profile, stats, promotional email |
| `/api/category` | Category and nested category management |
| `/api/product` | Products, uploads, filters, search, best sellers, new arrivals, recently viewed |
| `/api/wishlist` | Wishlist operations |
| `/api/notice` | Notifications |
| `/api/enquiries` | Customer enquiries |
| `/api/visitor` | Visitor tracking |
| `/api/analytics` | Dashboard analytics and live user metrics |
| `/api/recommendations` | Product recommendation endpoints |
| `/api/productEvent` | Product engagement tracking |
| `/api/homeSlider` | Homepage slider content |
| `/api/home-sections` | Dynamic homepage sections |
| `/api/style-your-space` | Style-your-space content |
| `/api/poster` | Poster content |
| `/api/videos` | Video upload and listing |

## Deployment Notes

- The customer and admin apps are Next.js applications and can be deployed independently.
- The API server requires environment variables for MongoDB, token secrets, CORS origins, and any enabled integrations.
- Redis is optional for basic API development, but required for background workers and Redis-backed queues/cache/rate limiting.
- Keep `.env` and `.env.local` files out of version control.

## Author

**M Jaya Kumar Patra**  
B.Tech IT | Full-Stack Developer  
GitHub: [M-Jaya-Kumar-Patra](https://github.com/M-Jaya-Kumar-Patra)  
Email: jayapatra2004@gmail.com

