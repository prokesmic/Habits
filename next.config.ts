import type { NextConfig } from "next";
// Temporarily disable PWA wrapper to ensure dev server stability

const nextConfig: NextConfig = {
  /* other config options here */
  turbopack: {
    // Ensure Next.js uses this project as the workspace root
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
