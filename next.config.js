/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración actualizada para Prisma
  serverExternalPackages: ['@prisma/client'],
  
  // Configuración para evitar problemas de proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Configuración para desarrollo
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;