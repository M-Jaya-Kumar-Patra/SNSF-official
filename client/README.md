# SNSF Customer Frontend

This is the customer-facing storefront for S N Steel Fabrication. It is built with Next.js and powers the product catalog, customer account experience, homepage content, and AI-assisted product support.

## Main features

- Product listing, filtering, sorting, and search
- Category and subcategory browsing with nested navigation
- Product detail pages with media galleries and serviceability checks
- Wishlist, cart, profile, address, and notification flows
- Login, signup, password recovery, and Google authentication
- Homepage content sections, posters, style-your-space modules, and videos
- PWA support and SEO-related routes
- AI assistant integration with the backend RAG service

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Required environment variables

Create a `.env.local` file in this folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGODB_URI=your_mongodb_connection_string
```

## Project notes

- The frontend expects the backend API to be running on the configured `NEXT_PUBLIC_API_URL`.
- The app is designed to work alongside the admin dashboard and Express API in the monorepo.
- For AI and recommendation setup details, see the root README and `server/RAG_SETUP.md`.
