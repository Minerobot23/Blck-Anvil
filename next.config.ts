import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 2000],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
};

export default nextConfig;
