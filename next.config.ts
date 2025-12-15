import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
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
