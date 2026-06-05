import withPWAPlugin from '@ducanh2912/next-pwa';

const withPWA = withPWAPlugin({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disables PWA in dev mode for faster local reloads
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.fontshare.com',
      },
    ],
    unoptimized: true,
  },
};

export default withPWA(nextConfig);