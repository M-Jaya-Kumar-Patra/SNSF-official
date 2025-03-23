/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig; // ✅ Use 'export default' in ESM
