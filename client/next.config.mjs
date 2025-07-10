import createPWA from 'next-pwa';

const withPWA = createPWA.default ?? createPWA;
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
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
    ],
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  experimental: {
    optimizeCss: true,
  },
  pwa: {
    dest: 'public',
    disable: isDev,
    register: true,
    skipWaiting: true,
  },
};

export default withPWA(nextConfig);
