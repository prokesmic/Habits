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
};

export default nextConfig;
