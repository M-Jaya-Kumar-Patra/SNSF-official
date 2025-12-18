import createPWA from 'next-pwa';

const withPWA = createPWA.default ?? createPWA;
const isDev = process.env.NODE_ENV === 'development';

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
      {
        protocol: 'https',
        hostname: 'snsteelfabrication.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ Google avatar images
      },
       {
        protocol: 'https',
        hostname: 'img.youtube.com', // ✅ Google avatar images
      },
    ],
  },

  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },

  experimental: {
    optimizeCss: true,
  },
});

export default nextConfig;
