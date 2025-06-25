/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // ✅ fix spelling
      "res.cloudinary.com",        // ✅ add Cloudinary domain
    ],
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  experimental: {
  appDir: true,
},
  
};

export default nextConfig;
