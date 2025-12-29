import createPWA from "next-pwa";

const withPWA = createPWA.default ?? createPWA;
const isDev = process.env.NODE_ENV === "development";

const nextConfig = withPWA({
  dest: "public",
  disable: true,
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: false, // ✅ REQUIRED for Google One Tap (dev)

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "snsteelfabrication.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
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
