// src/lib/actions/biophysicsTest.actions.ts

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Interface para los datos del test, asegura que los tipos son correctos.
interface BiophysicsTestData {
  patient_id: number;
  chronological_age: number;
  biological_age: number;
  differential_age: number;
  gender: string;
  is_athlete: boolean;
  measurements: string; // JSON
  partial_ages: string;   // JSON
  test_date: string;      // ISO Date String
}

/**
 * Guarda un nuevo registro de test biofísico en la base de datos.
 * @param data Los datos del test a guardar.
 */
export async function saveBiophysicalTest(data: BiophysicsTestData) {
  try {
    console.log("Guardando test biofísico con los siguientes datos:", data);

    // Validación básica de datos
    if (!data.patient_id || !data.biological_age) {
      throw new Error('Datos incompletos. Se requiere ID de paciente y edad biológica.');
    }

    await prisma.biophysicalTest.create({
      data: {
        ...data,
        test_date: new Date(data.test_date), // Convertir string a objeto Date para Prisma
      },
    });

    // Invalida el caché de la ruta de historias para que se muestren los datos actualizados.
    revalidatePath('/historias');
    
    return { success: true, message: 'Test guardado exitosamente.' };

  } catch (error: any) {
    console.error('Error al guardar el test biofísico:', error);
    // Devuelve un error que el componente del lado del cliente puede manejar.
    throw new Error(error.message || 'Ocurrió un error en el servidor al intentar guardar.');
  }
}
