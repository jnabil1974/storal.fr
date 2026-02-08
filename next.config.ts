import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'qctnvyxtbvnvllchuibu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storal.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.storal.fr',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/kissimy',
        destination: '/products/kissimy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
