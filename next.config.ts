import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@solana/wallet-adapter-react', '@solana/wallet-adapter-base'],
  },
  eslint: {
    // Disable ESLint during build for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during build for deployment
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Handle pino-pretty module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Handle pino-pretty in client-side builds
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': false,
      };
    }

    return config;
  },
  // Optimize for Vercel
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
};

export default nextConfig;
