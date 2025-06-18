import { PrismaClient } from '@prisma/client';

// Este bloque de código previene la creación de múltiples instancias de PrismaClient
// en el entorno de desarrollo debido a la recarga en caliente (hot-reloading) de Next.js.

// Declaramos una variable global para almacenar la instancia de Prisma.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Creamos una única instancia del cliente.
// Si ya existe una instancia global, la reutilizamos.
// Si no existe, creamos una nueva.
const prisma = global.prisma || new PrismaClient();

// En un entorno que no sea de producción (es decir, en desarrollo),
// asignamos la nueva instancia a la variable global.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Exportamos la instancia única del cliente para ser usada en toda la aplicación.
export default prisma;
