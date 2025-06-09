import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Datos para la tabla `ranges` (los mismos de tu RangesTableSeeder)
const rangesData = [
  { min: 21, max: 28 }, { min: 28, max: 35 }, { min: 35, max: 42 },
  { min: 42, max: 49 }, { min: 49, max: 56 }, { min: 56, max: 63 },
  { min: 63, max: 70 }, { min: 70, max: 77 }, { min: 77, max: 84 },
  { min: 84, max: 91 }, { min: 91, max: 98 }, { min: 98, max: 105 },
  { min: 105, max: 112}, { min: 112, max: 120},
];

// Datos para la tabla `boards` (un extracto de tu BiophysicistTableSeeder)
// NOTA: Se ha adaptado a la nueva estructura de la tabla (min_val, max_val)
const boardsData = [
    // Grasa Masculina
    { rangeId: 1, type: 1, name: 'male_fat', min_val: '10', max_val: '14', inverse: false },
    { rangeId: 2, type: 1, name: 'male_fat', min_val: '14', max_val: '18', inverse: false },
    { rangeId: 3, type: 1, name: 'male_fat', min_val: '18', max_val: '21', inverse: false },
    // Grasa Femenina
    { rangeId: 1, type: 1, name: 'female_fat', min_val: '18', max_val: '22', inverse: false },
    { rangeId: 2, type: 1, name: 'female_fat', min_val: '22', max_val: '26', inverse: false },
    { rangeId: 3, type: 1, name: 'female_fat', min_val: '26', max_val: '29', inverse: false },
    // Índice de masa corporal
    { rangeId: 1, type: 1, name: 'body_mass', min_val: '18', max_val: '22', inverse: false },
    { rangeId: 2, type: 1, name: 'body_mass', min_val: '22', max_val: '25', inverse: false },
    // Acomodación Visual (cm)
    { rangeId: 1, type: 1, name: 'visual_accommodation', min_val: '0', max_val: '10', inverse: false },
    { rangeId: 2, type: 1, name: 'visual_accommodation', min_val: '10', max_val: '15', inverse: false },
    // ... Puedes agregar el resto de los datos de tu seeder aquí para una prueba completa
];


async function main() {
  console.log('Start seeding ...');
  
  // Limpiar datos existentes
  await prisma.board.deleteMany();
  await prisma.range.deleteMany();
  
  // Crear Ranges y obtener sus IDs
  await prisma.range.createMany({
    data: rangesData,
  });
  console.log('Seeded ranges.');
  
  // Crear Boards
  await prisma.board.createMany({
      data: boardsData
  });
  console.log('Seeded boards.');
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
