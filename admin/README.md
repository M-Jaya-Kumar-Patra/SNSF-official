# SNSF Admin Dashboard

This is the admin console for S N Steel Fabrication. It is built with Next.js and helps the operations team manage products, categories, media, homepage content, customer enquiries, and business analytics.

## Main features

- Product catalog and inventory management
- Category, subcategory, and nested structure updates
- Homepage sliders, posters, videos, and dynamic content sections
- User and enquiry management
- KPI dashboards with analytics and live activity tracking
- Promotional email workflows and content scheduling
- Support for media upload and business-content operations

## Run locally

```bash
npm install
npm run dev -- -p 3001
```

Open http://localhost:3001 to access the admin dashboard.

## Required environment variables

Create a `.env.local` file in this folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGODB_URI=your_mongodb_connection_string
MONGODB_URL=your_mongodb_connection_string
```

## Project notes

- The admin app connects to the API server in the root `server` folder.
- It is intended to run alongside the customer site and backend API in the same monorepo.
- For platform-wide setup and AI features, see the root README and the server-side RAG setup guide.
