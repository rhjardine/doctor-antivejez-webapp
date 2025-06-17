// src/lib/actions/patients.ts

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Nota: Asumo que tienes estos schemas y tipos definidos.
// Si no, puedes ajustarlos o eliminarlos si no los usas.
const PatientSchema = z.object({
  surnames: z.string().min(2, 'Los apellidos son requeridos.'),
  names: z.string().min(2, 'Los nombres son requeridos.'),
  identification_number: z.string().min(1, 'La identificación es requerida.'),
  nationality: z.string().min(1, 'La nacionalidad es requerida.'),
  birth_date: z.string().min(1, 'La fecha de nacimiento es requerida.'),
  gender: z.string().min(1, 'El género es requerido.'),
  email: z.string().email('Email no válido.').optional().or(z.literal('')),
  phone_number: z.string().optional(),
});

export type FormState = {
  errors?: { [key: string]: string[] | undefined; };
  message?: string | null;
  patientId?: string | null;
};


// --- FUNCIONES DE OBTENCIÓN DE DATOS ---

/**
 * Obtiene todos los pacientes de la base de datos.
 */
export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { created_at: 'desc' },
    });
    return patients;
  } catch (error) {
    console.error('Error al obtener la lista de pacientes:', error);
    return [];
  }
}

/**
 * Obtiene un paciente específico junto con su historial de pruebas biofísicas.
 * @param patientId El ID (como string) del paciente a buscar.
 */
export async function getPatientWithHistory(patientId: string) {
  if (!patientId) {
    console.error("getPatientWithHistory fue llamado sin un patientId.");
    return null;
  }

  try {
    // Prisma espera que los IDs numéricos se pasen como números.
    const numericId = parseInt(patientId, 10);
    if (isNaN(numericId)) {
        console.error(`El ID del paciente "${patientId}" no es un número válido.`);
        return null;
    }

    const patient = await prisma.patient.findUnique({
      where: { id: numericId },
      include: {
        // ✨ CORRECCIÓN DEFINITIVA: Se usa el nombre exacto del schema.prisma
        biophysical_tests: { 
          orderBy: { created_at: 'desc' } 
        },
      },
    });
    return patient;
  } catch (error) {
    console.error(`Error al obtener el paciente con ID ${patientId}:`, error);
    return null; // Devuelve null en caso de error para que la UI pueda manejarlo.
  }
}
