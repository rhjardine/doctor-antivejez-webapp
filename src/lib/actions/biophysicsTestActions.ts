'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * Server Action para obtener todos los 'Boards' de baremos y sus 'Ranges' asociados.
 * Esta función se ejecuta en el servidor y es necesaria para el formulario del test.
 */
export async function getBiophysicsBoardsAndRanges() {
  try {
    const boards = await prisma.board.findMany({
      include: {
        ranges: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return boards;
  } catch (error) {
    console.error("Error en Server Action getBiophysicsBoardsAndRanges:", error);
    throw new Error('No se pudieron cargar los baremos desde la base de datos.');
  }
}

/**
 * Server Action para guardar un nuevo resultado de test biofísico.
 */
export async function saveBiophysicsTest(payload: {
    patientId: string;
    chronological_age: number;
    biological_age: number;
    differential_age: number;
    form_data: Prisma.JsonValue;
}) {
  try {
    const newTest = await prisma.biophysicsTest.create({
      data: payload,
    });
    return { success: true, data: newTest };
  } catch (error) {
    console.error("Error en Server Action saveBiophysicsTest:", error);
    return { success: false, message: 'Error de base de datos al guardar el test.' };
  }
}
