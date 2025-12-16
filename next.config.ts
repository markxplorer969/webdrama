import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure allowed origins for development
  allowedDevOrigins: [
    'preview-chat-760e527f-2aad-4bda-ad3b-3c73595a265b.space.z.ai'
  ],
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  // Configure image domains for Next.js Image component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thwztchapter.dramaboxdb.com',
        port: '',
        pathname: '/data/**',
      },
      {
        protocol: 'https',
        hostname: 'hwztchapter.dramaboxdb.com',
        port: '',
        pathname: '/data/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dramabox.web.id',
        port: '',
        pathname: '/**',
      },
    ],
    // Fallback for unconfigured domains
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
};

export default nextConfig;
