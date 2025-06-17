// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeo de los rangos de edad del sistema antiguo (1-14)
const ageRangeMap = {
  1: { min_age: 21, max_age: 28 },
  2: { min_age: 28, max_age: 35 },
  3: { min_age: 35, max_age: 42 },
  4: { min_age: 42, max_age: 49 },
  5: { min_age: 49, max_age: 56 },
  6: { min_age: 56, max_age: 63 },
  7: { min_age: 63, max_age: 70 },
  8: { min_age: 70, max_age: 77 },
  9: { min_age: 77, max_age: 84 },
  10: { min_age: 84, max_age: 91 },
  11: { min_age: 91, max_age: 98 },
  12: { min_age: 98, max_age: 105 },
  13: { min_age: 105, max_age: 112 },
  14: { min_age: 112, max_age: 120 }
};

// **TODOS los datos del seeder PHP, transcritos y consolidados en un solo array**
const oldBaremData = [
  // Grasa Masculina
  { r: 1, n: 'male_ fat', min: 10, max: 14 },
  { r: 2, n: 'male_ fat', min: 14, max: 18 },
  { r: 3, n: 'male_ fat', min: 18, max: 21 },
  { r: 4, n: 'male_ fat', min: 21, max: 24 },
  { r: 5, n: 'male_ fat', min: 24, max: 27 },
  { r: 6, n: 'male_ fat', min: 27, max: 30 },
  { r: 7, n: 'male_ fat', min: 30, max: 33 },
  { r: 7, n: 'male_ fat', min: 7, max: 9.99, inv: true },
  { r: 8, n: 'male_ fat', min: 33, max: 36 },
  { r: 8, n: 'male_ fat', min: 6, max: 7, inv: true },
  { r: 9, n: 'male_ fat', min: 36, max: 39 },
  { r: 9, n: 'male_ fat', min: 5, max: 6, inv: true },
  { r: 10, n: 'male_ fat', min: 39, max: 42 },
  { r: 10, n: 'male_ fat', min: 4, max: 5, inv: true },
  { r: 11, n: 'male_ fat', min: 42, max: 45 },
  { r: 11, n: 'male_ fat', min: 3, max: 4, inv: true },
  { r: 12, n: 'male_ fat', min: 45, max: 48 },
  { r: 12, n: 'male_ fat', min: 2, max: 3, inv: true },
  { r: 13, n: 'male_fat', min: 48, max: 51 },
  { r: 13, n: 'male_fat', min: 11, max: 22, inv: true },
  { r: 14, n: 'male_fat', min: 51, max: 54 },
  { r: 14, n: 'male_fat', min: 0, max: 11, inv: true },
  // Grasa Masculina Deportiva
  { r: 11, n: 'sporty_male_fat', min: 11, max: 7 },
  { r: 22, n: 'sporty_male_fat', min: 7, max: 14 },
  { r: 33, n: 'sporty_male_fat', min: 14, max: 17 },
  { r: 44, n: 'sporty_male_fat', min: 17, max: 21 },
  { r: 55, n: 'sporty_male_fat', min: 21, max: 25 },
  { r: 66, n: 'sporty_male_fat', min: 25, max: 28 },
  { r: 77, n: 'sporty_male_fat', min: 28, max: 31 },
  { r: 88, n: 'sporty_male_fat', min: 31, max: 34 },
  { r: 99, n: 'sporty_male_fat', min: 34, max: 37 },
  { r: 10, n: 'sporty_male_fat', min: 37, max: 40 },
  { r: 11, n: 'sporty_male_fat', min: 40, max: 43 },
  { r: 12, n: 'sporty_male_fat', min: 43, max: 46 },
  { r: 13, n: 'sporty_male_fat', min: 46, max: 49 },
  { r: 14, n: 'sporty_male_fat', min: 48, max: 52 },
  // Grasa Femenina
  { r: 11, n: 'female_fat', min: 18, max: 22 },
  { r: 22, n: 'female_fat', min: 22, max: 26 },
  { r: 33, n: 'female_fat', min: 26, max: 29 },
  { r: 44, n: 'female_fat', min: 29, max: 32 },
  { r: 55, n: 'female_fat', min: 32, max: 35 },
  { r: 66, n: 'female_fat', min: 35, max: 38 },
  { r: 77, n: 'female_fat', min: 38, max: 41 },
  { r: 77, n: 'female_fat', min: 15, max: 17.99, inv: true },
  { r: 88, n: 'female_fat', min: 41, max: 44 },
  { r: 88, n: 'female_fat', min: 14, max: 15, inv: true },
  { r: 99, n: 'female_fat', min: 44, max: 47 },
  { r: 99, n: 'female_fat', min: 13, max: 14, inv: true },
  { r: 10, n: 'female_fat', min: 47, max: 50 },
  { r: 10, n: 'female_fat', min: 12, max: 13, inv: true },
  { r: 11, n: 'female_fat', min: 50, max: 53 },
  { r: 11, n: 'female_fat', min: 11, max: 12, inv: true },
  { r: 12, n: 'female_fat', min: 53, max: 56 },
  { r: 12, n: 'female_fat', min: 10, max: 11, inv: true },
  { r: 13, n: 'female_fat', min: 56, max: 59 },
  { r: 13, n: 'female_fat', min: 9, max: 10, inv: true },
  { r: 14, n: 'female_fat', min: 59, max: 62 },
  { r: 14, n: 'female_fat', min: 8, max: 9, inv: true },
  // Grasa Femenina Deportiva
  { r: 11, n: 'sporty_female_fat', min: 11, max: 9 },
  { r: 22, n: 'sporty_female_fat', min: 9, max: 18 },
  { r: 33, n: 'sporty_female_fat', min: 18, max: 22 },
  { r: 44, n: 'sporty_female_fat', min: 22, max: 25 },
  { r: 55, n: 'sporty_female_fat', min: 25, max: 27 },
  { r: 66, n: 'sporty_female_fat', min: 27, max: 30 },
  { r: 77, n: 'sporty_female_fat', min: 30, max: 33 },
  { r: 88, n: 'sporty_female_fat', min: 33, max: 36 },
  { r: 99, n: 'sporty_female_fat', min: 36, max: 39 },
  { r: 10, n: 'sporty_female_fat', min: 39, max: 42 },
  { r: 11, n: 'sporty_female_fat', min: 42, max: 45 },
  { r: 12, n: 'sporty_female_fat', min: 45, max: 48 },
  { r: 13, n: 'sporty_female_fat', min: 48, max: 51 },
  { r: 14, n: 'sporty_female_fat', min: 51, max: 54 },
  // Masa Corporal (IMC)
  { r: 11, n: 'body_mass', min: 18, max: 22 },
  { r: 22, n: 'body_mass', min: 22, max: 25 },
  { r: 33, n: 'body_mass', min: 25, max: 27 },
  { r: 44, n: 'body_mass', min: 27, max: 30 },
  { r: 55, n: 'body_mass', min: 30, max: 33 },
  { r: 66, n: 'body_mass', min: 33, max: 36 },
  { r: 77, n: 'body_mass', min: 36, max: 39 },
  { r: 88, n: 'body_mass', min: 39, max: 42 },
  { r: 88, n: 'body_mass', min: 16, max: 17.99, inv: true },
  { r: 99, n: 'body_mass', min: 42, max: 45 },
  { r: 99, n: 'body_mass', min: 15, max: 16, inv: true },
  { r: 10, n: 'body_mass', min: 45, max: 48 },
  { r: 10, n: 'body_mass', min: 14, max: 15, inv: true },
  { r: 11, n: 'body_mass', min: 48, max: 51 },
  { r: 11, n: 'body_mass', min: 12, max: 13, inv: true },
  { r: 12, n: 'body_mass', min: 51, max: 54 },
  { r: 12, n: 'body_mass', min: 11, max: 12, inv: true },
  { r: 13, n: 'body_mass', min: 54, max: 57 },
  { r: 13, n: 'body_mass', min: 10, max: 11, inv: true },
  { r: 14, n: 'body_mass', min: 57, max: 60 },
  { r: 14, n: 'body_mass', min: 9, max: 10, inv: true },
  // Reflejos digitales
  { r: 11, n: 'digital_reflections', min: 50, max: 45 },
  { r: 22, n: 'digital_reflections', min: 45, max: 35 },
  { r: 33, n: 'digital_reflections', min: 35, max: 30 },
  { r: 44, n: 'digital_reflections', min: 30, max: 25 },
  { r: 55, n: 'digital_reflections', min: 25, max: 20 },
  { r: 66, n: 'digital_reflections', min: 20, max: 15 },
  { r: 77, n: 'digital_reflections', min: 15, max: 10 },
  { r: 88, n: 'digital_reflections', min: 10, max: 8 },
  { r: 99, n: 'digital_reflections', min: 8, max: 6 },
  { r: 10, n: 'digital_reflections', min: 6, max: 4 },
  { r: 11, n: 'digital_reflections', min: 4, max: 3 },
  { r: 12, n: 'digital_reflections', min: 3, max: 2 },
  { r: 13, n: 'digital_reflections', min: 2, max: 1 },
  { r: 14, n: 'digital_reflections', min: 1, max: 0 },
  // Acomodación Visual
  { r: 11, n: 'visual_accommodation', min: 0, max: 10 },
  { r: 22, n: 'visual_accommodation', min: 10, max: 15 },
  { r: 33, n: 'visual_accommodation', min: 15, max: 18 },
  { r: 44, n: 'visual_accommodation', min: 18, max: 21 },
  { r: 55, n: 'visual_accommodation', min: 21, max: 24 },
  { r: 66, n: 'visual_accommodation', min: 24, max: 27 },
  { r: 77, n: 'visual_accommodation', min: 27, max: 30 },
  { r: 88, n: 'visual_accommodation', min: 30, max: 33 },
  { r: 99, n: 'visual_accommodation', min: 33, max: 37 },
  { r: 10, n: 'visual_accommodation', min: 37, max: 40 },
  { r: 11, n: 'visual_accommodation', min: 40, max: 43 },
  { r: 12, n: 'visual_accommodation', min: 43, max: 47 },
  { r: 13, n: 'visual_accommodation', min: 47, max: 50 },
  { r: 14, n: 'visual_accommodation', min: 50, max: 53 },
  // Balance Estatico
  { r: 11, n: 'static_balance', min: 120, max: 30 },
  { r: 22, n: 'static_balance', min: 30, max: 25 },
  { r: 33, n: 'static_balance', min: 25, max: 20 },
  { r: 44, n: 'static_balance', min: 20, max: 15 },
  { r: 55, n: 'static_balance', min: 15, max: 12 },
  { r: 66, n: 'static_balance', min: 12, max: 9 },
  { r: 77, n: 'static_balance', min: 9, max: 7 },
  { r: 88, n: 'static_balance', min: 7, max: 6 },
  { r: 99, n: 'static_balance', min: 6, max: 5 },
  { r: 10, n: 'static_balance', min: 5, max: 4 },
  { r: 11, n: 'static_balance', min: 4, max: 3 },
  { r: 12, n: 'static_balance', min: 3, max: 2 },
  { r: 13, n: 'static_balance', min: 2, max: 1 },
  { r: 14, n: 'static_balance', min: 1, max: 0 },
  // Hidratación Cutánea
  { r: 11, n: 'skin_hydration', min: 0, max: 1 },
  { r: 22, n: 'skin_hydration', min: 1, max: 2 },
  { r: 33, n: 'skin_hydration', min: 2, max: 4 },
  { r: 44, n: 'skin_hydration', min: 4, max: 8 },
  { r: 55, n: 'skin_hydration', min: 8, max: 16 },
  { r: 66, n: 'skin_hydration', min: 16, max: 32 },
  { r: 77, n: 'skin_hydration', min: 32, max: 64 },
  { r: 88, n: 'skin_hydration', min: 64, max: 74 },
  { r: 99, n: 'skin_hydration', min: 74, max: 84 },
  { r: 10, n: 'skin_hydration', min: 84, max: 94 },
  { r: 11, n: 'skin_hydration', min: 94, max: 104 },
  { r: 12, n: 'skin_hydration', min: 104, max: 108 },
  { r: 13, n: 'skin_hydration', min: 108, max: 112 },
  { r: 14, n: 'skin_hydration', min: 112, max: 120 },
  // Tensión Arterial sistólica
  { r: 11, n: 'systolic_blood_pressure', min: 100, max: 110 },
  { r: 22, n: 'systolic_blood_pressure', min: 110, max: 120 },
  { r: 33, n: 'systolic_blood_pressure', min: 120, max: 130 },
  { r: 33, n: 'systolic_blood_pressure', min: 95, max: 99.99, inv: true },
  { r: 44, n: 'systolic_blood_pressure', min: 130, max: 140 },
  { r: 44, n: 'systolic_blood_pressure', min: 90, max: 95, inv: true },
  { r: 55, n: 'systolic_blood_pressure', min: 140, max: 150 },
  { r: 55, n: 'systolic_blood_pressure', min: 85, max: 90, inv: true },
  { r: 66, n: 'systolic_blood_pressure', min: 150, max: 160 },
  { r: 66, n: 'systolic_blood_pressure', min: 80, max: 85, inv: true },
  { r: 77, n: 'systolic_blood_pressure', min: 160, max: 170 },
  { r: 77, n: 'systolic_blood_pressure', min: 75, max: 80, inv: true },
  { r: 88, n: 'systolic_blood_pressure', min: 170, max: 180 },
  { r: 88, n: 'systolic_blood_pressure', min: 70, max: 75, inv: true },
  { r: 99, n: 'systolic_blood_pressure', min: 180, max: 190 },
  { r: 99, n: 'systolic_blood_pressure', min: 65, max: 70, inv: true },
  { r: 10, n: 'systolic_blood_pressure', min: 190, max: 200 },
  { r: 10, n: 'systolic_blood_pressure', min: 60, max: 65, inv: true },
  { r: 11, n: 'systolic_blood_pressure', min: 200, max: 210 },
  { r: 11, n: 'systolic_blood_pressure', min: 55, max: 60, inv: true },
  { r: 12, n: 'systolic_blood_pressure', min: 210, max: 220 },
  { r: 12, n: 'systolic_blood_pressure', min: 50, max: 55, inv: true },
  { r: 13, n: 'systolic_blood_pressure', min: 220, max: 230 },
  { r: 13, n: 'systolic_blood_pressure', min: 45, max: 50, inv: true },
  { r: 14, n: 'systolic_blood_pressure', min: 230, max: 240 },
  { r: 14, n: 'systolic_blood_pressure', min: 40, max: 45, inv: true },
  // Tensión Arterial Diastolica
  { r: 11, n: 'diastolic_blood_pressure', min: 60, max: 65 },
  { r: 22, n: 'diastolic_blood_pressure', min: 65, max: 70 },
  { r: 33, n: 'diastolic_blood_pressure', min: 70, max: 75 },
  { r: 44, n: 'diastolic_blood_pressure', min: 75, max: 80 },
  { r: 55, n: 'diastolic_blood_pressure', min: 80, max: 85 },
  { r: 66, n: 'diastolic_blood_pressure', min: 85, max: 90 },
  { r: 77, n: 'diastolic_blood_pressure', min: 90, max: 95 },
  { r: 77, n: 'diastolic_blood_pressure', min: 57, max: 59.99, inv: true },
  { r: 88, n: 'diastolic_blood_pressure', min: 95, max: 100 },
  { r: 88, n: 'diastolic_blood_pressure', min: 53, max: 57, inv: true },
  { r: 99, n: 'diastolic_blood_pressure', min: 100, max: 110 },
  { r: 99, n: 'diastolic_blood_pressure', min: 50, max: 53, inv: true },
  { r: 10, n: 'diastolic_blood_pressure', min: 110, max: 120 },
  { r: 10, n: 'diastolic_blood_pressure', min: 47, max: 50, inv: true },
  { r: 11, n: 'diastolic_blood_pressure', min: 120, max: 130 },
  { r: 11, n: 'diastolic_blood_pressure', min: 44, max: 47, inv: true },
  { r: 12, n: 'diastolic_blood_pressure', min: 130, max: 140 },
  { r: 12, n: 'diastolic_blood_pressure', min: 41, max: 44, inv: true },
  { r: 13, n: 'diastolic_blood_pressure', min: 140, max: 150 },
  { r: 13, n: 'diastolic_blood_pressure', min: 38, max: 41, inv: true },
  { r: 14, n: 'diastolic_blood_pressure', min: 150, max: 160 },
  { r: 14, n: 'diastolic_blood_pressure', min: 35, max: 38, inv: true },
];

async function main() {
  console.log('Iniciando el proceso de "seeding" con datos completos...');
  await prisma.range.deleteMany({});
  await prisma.board.deleteMany({});
  console.log('Tablas de baremos limpiadas.');
  console.log('Creando los "Boards" (tipos de test)...');
  const boardsToCreate = [
    { name: 'fat', description: '% Grasa Corporal', inverse: false },
    { name: 'imc', description: 'Índice de Masa Corporal', inverse: false },
    { name: 'digital_reflex', description: 'Reflejos Digitales (ms)', inverse: true },
    { name: 'visual_accommodation', description: 'Acomodación Visual (cm)', inverse: true },
    { name: 'static_balance', description: 'Balance Estático (segundos)', inverse: false },
    { name: 'skin_hydration', description: 'Hidratación Cutánea (seg)', inverse: true },
    { name: 'systolic', description: 'Tensión Arterial Sistólica (mmHg)', inverse: false },
    { name: 'diastolic', description: 'Tensión Arterial Diastólica (mmHg)', inverse: false },
  ];
  await prisma.board.createMany({ data: boardsToCreate });
  const allBoards = await prisma.board.findMany();
  const boardIdMap = new Map(allBoards.map((bb) => [bb.name, bb.id]));
  console.log(`${allBoards.length} Boards creados.`);
  console.log('Preparando y traduciendo los "Ranges" (baremos)...');
  const rangesToCreate = [];
  for (const oldData of oldBaremData) {
    const ageRange = ageRangeMap[oldData.r];
    if (!ageRange) continue;
    let boardName = '';
    let gender = '';
    let is_athlete = false;
    if (oldData.n.includes('male')) gender = 'Masculino';
    if (oldData.n.includes('female')) gender = 'Femenino';
    if (oldData.n.includes('sporty')) is_athlete = true;
    // Mapeo del nombre del test al nombre del board
    if (oldData.n.includes('fat')) boardName = 'fat';
    else if (oldData.n.includes('mass')) boardName = 'imc';
    else if (oldData.n.includes('reflection')) boardName = 'digital_reflex';
    else if (oldData.n.includes('accommodation')) boardName = 'visual_accommodation';
    else if (oldData.n.includes('balance')) boardName = 'static_balance';
    else if (oldData.n.includes('hydration')) boardName = 'skin_hydration';
    else if (oldData.n.includes('systolic')) boardName = 'systolic';
    else if (oldData.n.includes('diastolic')) boardName = 'diastolic';
    const boardId = boardIdMap.get(boardName);
    if (!boardId) continue;
    rangesToCreate.push({
      boardId: boardId,
      min_age: ageRange.min_age,
      max_age: ageRange.max_age,
      gender: gender,
      is_athlete: is_athlete,
      min_value: Number(oldData.min),
      max_value: Number(oldData.max),
      bio_age_min: ageRange.min_age,
      bio_age_max: ageRange.max_age,
    });
  }
  await prisma.range.createMany({ data: rangesToCreate });
  console.log(`${rangesToCreate.length} Ranges creados.`);
  console.log('¡Proceso de "seeding" completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Error durante el proceso de seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });