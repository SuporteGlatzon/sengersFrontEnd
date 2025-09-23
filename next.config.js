/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['admin.conexoesengenharia.com.br'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.conexoesengenharia.com.br',
        pathname: '/storage/**',
      },
    ],
    unoptimized: true,
  },
};
