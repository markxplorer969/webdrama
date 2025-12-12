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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dramabox.web.id',
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
