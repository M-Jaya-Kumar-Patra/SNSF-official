import createPWA from 'next-pwa';

const withPWA = createPWA.default ?? createPWA; // ✅ fix for CommonJS+ESM

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
})({
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
});

export default nextConfig;
