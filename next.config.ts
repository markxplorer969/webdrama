import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // config options here
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Dramaflex configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dramaflex.xyz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thwztchapter.dramaboxdb.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
