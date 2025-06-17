// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Esta configuración es necesaria para que las Server Actions y otros
  // paquetes del lado del servidor funcionen correctamente con Prisma.
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },

  // La configuración de imágenes es opcional, pero la dejamos si la necesitas.
  images: {
    remotePatterns: [
      {
        protocol: 'http', // o 'https'
        hostname: 'localhost',
      },
      // Puedes añadir aquí otros dominios si usas imágenes externas.
    ],
  },
  
  // --- SECCIÓN DE REWRITES ELIMINADA ---
  // No necesitamos 'rewrites' para la API porque estamos construyendo
  // los endpoints directamente en Next.js dentro de `src/app/api`.
  // Mantenerla causa conflictos con el enrutamiento y el middleware.
};

export default nextConfig;