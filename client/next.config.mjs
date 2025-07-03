import createPWA from 'next-pwa';

const withPWA = createPWA.default ?? createPWA; // ✅ handles both ESM & CommonJS
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
    ],
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  experimental: {
    legacyBrowsers: false, // ✅ Disables old JS fallback for modern browsers
  },
});

export default nextConfig;
