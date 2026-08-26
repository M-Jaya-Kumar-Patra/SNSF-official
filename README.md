# SNSF - S N Steel Fabrication Business Platform

A full-stack commerce and operations platform for S N Steel Fabrication. The repository includes a customer storefront, an admin dashboard, an Express API, media management, analytics, recommendation workflows, and an AI-powered product assistant.

Live website: [snsteelfabrication.com](https://snsteelfabrication.com)

## What’s new

- AI-powered product assistant powered by a safe RAG pipeline with MongoDB vector search and product-safe prompt rules.
- Recommendation engine with scheduled recommendation emails and background worker jobs.
- Rich analytics and live user metrics for visits, product engagement, search, wishlist activity, and login trends.
- Expanded admin capabilities for homepage management, posters, videos, dynamic sections, and content operations.
- Improved storefront flows for product discovery, wishlist, profile, notifications, and serviceability checks.

## Project structure

This project is split into three main apps:

- `client` - Next.js storefront for browsing products, account flows, checkout-related actions, wishlist, enquiries, content pages, and PWA support.
- `admin` - Next.js admin dashboard for catalog management, homepage content, user and enquiry management, and business analytics.
- `server` - Express API with MongoDB models, authentication, Cloudinary uploads, analytics endpoints, recommendation jobs, and AI/RAG services.

## Core features

### Customer storefront

- Responsive product browsing with categories, subcategories, and third-level category filtering.
- Search, sort, filters, suggestions, new arrivals, best sellers, recently viewed, and related product discovery.
- Product detail pages with gallery, specifications, serviceability checks, and contextual content.
- Authentication flows including signup, login, OTP/email verification, password reset, and Google sign-in.
- Account pages for profile, addresses, wishlist, notifications, enquiries, and order-related actions.
- Homepage modules for sliders, curated sections, posters, videos, style-your-space content, and trending content.
- Visitor and product analytics tracking, page views, searches, and engagement events.
- PWA support and SEO assets such as sitemap and robots.txt.
- AI assistant for product guidance with safe, pricing-protected responses.

### Admin dashboard

- Admin authentication and account management.
- Product CRUD with Cloudinary upload support.
- Category, subcategory, and nested content management.
- Homepage manager, home sliders, poster manager, video manager, and style-your-space content management.
- User and enquiry management.
- KPI dashboards with live user metrics, device and country breakdowns, visitor trends, product and page engagement analytics, andwishlist leaderboards.
- Promotional email tooling and recommendation oversight.

### Backend and services

- Express API with MongoDB/Mongoose models.
- JWT and cookie-based authentication for users and admins.
- Google OAuth and related auth integrations.
- Cloudinary media uploads for products, categories, posters, profile photos, and videos.
- Email services for verification, reset, welcome, login, promotional, and recommendation flows.
- Analytics routes for visitor, session, page, product, search, user, and login metrics.
- Recommendation service and scheduled jobs for personalized email campaigns.
- Redis-backed cache, queues, and BullMQ workers when Redis is configured.
- RAG/AI service for product-safe knowledge ingestion and semantic retrieval.
- Security and performance middleware including Helmet, CORS, compression, upload limits, and rate limiting.

## Tech stack

| Area | Technologies |
| --- | --- |
| Customer site | Next.js, React, Tailwind CSS, MUI, styled-components, Framer Motion, Swiper, Zustand |
| Admin dashboard | Next.js, React, Tailwind CSS, MUI, Recharts, dnd-kit, Framer Motion |
| API server | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, cookies, Google OAuth |
| Media | Cloudinary, Multer |
| Email | Resend, Nodemailer |
| Analytics/jobs | Redis, BullMQ, node-cron |
| AI/RAG | MongoDB vector search, OpenAI/OpenRouter embeddings, semantic retrieval |
| Other integrations | Firebase, Google Maps, Razorpay support |

## Repository layout

```text
.
├── admin/          # Next.js admin dashboard
├── client/         # Next.js customer storefront
├── server/         # Express API + workers + RAG services
├── README.md       # Project overview and setup guide
├── server/RAG_SETUP.md  # AI assistant setup and vector index configuration
└── .gitignore
```

## Prerequisites

- Node.js 18.18+ (20+ recommended)
- npm
- MongoDB connection string
- Cloudinary account for media upload and transformations
- Google OAuth credentials if you enable social sign-in
- Redis URL when using queues, recommendations, or cache features
- API keys for OpenAI/OpenRouter if using the AI assistant/RAG flow

## Install dependencies

```bash
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

## Environment variables

### `server/.env`

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

EMBEDDING_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
AI_EMBEDDING_MODEL=text-embedding-3-small
AI_PROVIDER=openai
AI_CHAT_MODEL=gpt-4.1-mini
```

Additional server settings may include `JSON_BODY_LIMIT`, `UPLOAD_*`, `VIDEO_UPLOAD_*`, `RECOMMENDATION_CRON`, `RAG_VECTOR_DRIVER`, `MONGODB_VECTOR_INDEX`, and related cache or rate limit variables.

### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGODB_URI=your_mongodb_connection_string
```

### `admin/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGODB_URI=your_mongodb_connection_string
MONGODB_URL=your_mongodb_connection_string
```

## Run locally

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

- Customer storefront: http://localhost:3000
- Admin dashboard: http://localhost:3001
- API server: http://localhost:8000

## Useful scripts

| Location | Script | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Run the storefront |
| `client` | `npm run build` | Build the storefront |
| `client` | `npm run start` | Start the production storefront |
| `admin` | `npm run dev` | Run the admin dashboard |
| `admin` | `npm run build` | Build the admin dashboard |
| `admin` | `npm run start` | Start the production admin app |
| `server` | `npm run dev` | Run the API with nodemon |
| `server` | `npm run start` | Run the API with Node |
| `server` | `npm run worker` | Start BullMQ workers |
| `server` | `npm run cron:recommendations` | Run recommendation jobs |
| `server` | `npm run recommendations:once` | Trigger one-off recommendation processing |
| `server` | `npm run db:indexes` | Create MongoDB indexes |
| `server` | `npm run rag:ingest` | Ingest site knowledge for the AI assistant |

## Main API modules

The server mounts the following route groups:

- `/api/user` - user auth, profile, addresses, password flows, notifications, and login analytics
- `/api/admin` - admin auth, profile, stats, promotional email, and dashboard tools
- `/api/category` - category and nested category management
- `/api/product` - products, uploads, filters, search, best sellers, new arrivals, and similar catalog endpoints
- `/api/wishlist` - wishlist actions
- `/api/notice` - notification management
- `/api/enquiries` - customer enquiries
- `/api/visitor` - visitor tracking
- `/api/analytics` - dashboard analytics and live user metrics
- `/api/recommendations` - recommendation endpoints and queue jobs
- `/api/productEvent` - product engagement tracking
- `/api/home-sections` - homepage sections
- `/api/style-your-space` - style-your-space content
- `/api/poster` - poster content
- `/api/videos` - video upload and listing
- `/api/ai` - RAG-powered assistant endpoints

## AI assistant notes

The storefront AI assistant is designed to answer questions from curated SNSF knowledge without exposing pricing or sensitive product data. Price queries are redirected to direct contact channels. See `server/RAG_SETUP.md` for setup instructions, vector index configuration, and ingestion commands.

## Deployment notes

- Customer and admin apps can be deployed independently as Next.js projects.
- The API server requires database, media, auth, and optional AI/Redis configuration.
- Keep `.env` and `.env.local` file contents out of source control.

## Author

**M Jaya Kumar Patra**  
B.Tech IT | Full-Stack Developer  
GitHub: [M-Jaya-Kumar-Patra](https://github.com/M-Jaya-Kumar-Patra)  
Email: jayapatra2004@gmail.com
