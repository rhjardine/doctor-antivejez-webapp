// ./next.config.mjs (EN LA RAÍZ DEL PROYECTO)
/** @type {import('next').NextConfig} */

// Lee la URL base de la API desde las variables de entorno, con un fallback
const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'; // Ajusta el fallback

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http', // o 'https'
        hostname: 'localhost',
        // port: '8000', // si es necesario
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig; // Correcto para .mjs