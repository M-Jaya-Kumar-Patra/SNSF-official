/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
  ],
},
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig; // ✅ ESM style
