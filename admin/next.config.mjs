/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // ✅ fix spelling
      "res.cloudinary.com",        // ✅ add Cloudinary domain
    ],
  },
  devIndicators: {
    buildActivity: false,
    devIndicators: false,
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;
