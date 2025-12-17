import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for Vercel compatibility
  // output: "standalone", // Commented out for Vercel deployment
  
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
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Fallback for unconfigured domains
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
  
  // Environment-specific configuration
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
  },
  
  // API configuration for Vercel
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
