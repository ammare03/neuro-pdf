import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 120,
      static: 120,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
