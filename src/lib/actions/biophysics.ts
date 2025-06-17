'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * Server Action para obtener todos los 'Boards' y sus 'Ranges' asociados.
 * Esto es necesario para que el formulario de test sepa qué baremos usar.
 * @returns Una promesa que resuelve a un array de Boards con sus Ranges.
 */
export async function getBiophysicsBoards() {
  try {
    const boards = await prisma.board.findMany({
      include: {
        ranges: true, // Incluye todos los baremos para cada tipo de test
      },
    });
    return boards;
  } catch (error) {
    console.error("Error fetching biophysics boards:", error);
    // Retornar un array vacío o lanzar un error para que el cliente lo maneje
    return [];
  }
}

// Creamos un tipo para el payload para asegurar que los datos son correctos
export type SaveTestPayload = {
    patientId: string;
    chronological_age: number;
    biological_age: number;
    differential_age: number;
    form_data: Prisma.JsonValue;
};

/**
 * Server Action para guardar un nuevo resultado de test biofísico.
 * @param payload - Los datos del test a guardar.
 * @returns El objeto del test recién creado o null en caso de error.
 */
export async function saveBiophysicsTest(payload: SaveTestPayload) {
  try {
    const newTest = await prisma.biophysicsTest.create({
      data: {
        patientId: payload.patientId,
        chronological_age: payload.chronological_age,
        biological_age: payload.biological_age,
        differential_age: payload.differential_age,
        form_data: payload.form_data, // Guardamos el formulario completo como JSON
      },
    });
    return newTest;
  } catch (error) {
    console.error("Error saving biophysics test:", error);
    // Podrías retornar el mensaje de error para mostrarlo en la UI
    return null;
  }
}
