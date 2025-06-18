'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

// Helper para calcular la edad
function calculateChronologicalAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Esquema de validación para los datos del paciente
const PatientSchema = z.object({
  id: z.string().cuid().optional().or(z.literal('')),
  names: z.string().min(2, { message: 'El nombre es requerido.' }),
  surnames: z.string().min(2, { message: 'El apellido es requerido.' }),
  document_number: z.string().min(3, { message: 'El documento es requerido.' }),
  birth_date: z.coerce.date({ message: 'La fecha de nacimiento es inválida.' }),
  email: z.string().email({ message: 'El correo electrónico no es válido.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  gender: z.string().optional(),
  // Añade aquí el resto de campos que vengan del formulario para validarlos
});

export type FormState = {
  errors?: { [key: string]: string[] };
  message?: string | null;
};

/**
 * Server Action para CREAR o ACTUALIZAR un paciente.
 */
export async function createOrUpdatePatient(prevState: FormState, formData: FormData) {
  const validatedFields = PatientSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos o son inválidos. Por favor, revise el formulario.',
    };
  }

  const { id, birth_date, ...patientData } = validatedFields.data;
  const chronological_age = calculateChronologicalAge(birth_date);

  try {
    if (id) {
      await prisma.patient.update({
        where: { id },
        data: { ...patientData, birth_date, chronological_age },
      });
    } else {
      await prisma.patient.create({
        data: { ...patientData, birth_date, chronological_age },
      });
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { message: 'Error: El número de documento o email ya existe.' };
    }
    return { message: 'Error de base de datos: No se pudo guardar el paciente.' };
  }

  revalidatePath('/historias');
  redirect('/historias');
}

/**
 * Server Action para OBTENER TODOS los pacientes (para la lista).
 */
export async function getPatients() {
  try {
    return await prisma.patient.findMany({ orderBy: { surnames: 'asc' } });
  } catch (error) {
    console.error("Database Error (getPatients):", error);
    throw new Error('No se pudieron obtener los pacientes.');
  }
}

/**
 * Server Action para OBTENER UN paciente específico con sus tests.
 */
export async function getPatientWithTests(patientId: string) {
  try {
    return await prisma.patient.findUnique({
      where: { id: patientId },
      include: { biophysics_tests: { orderBy: { test_date: 'desc' } } },
    });
  } catch (error) {
    console.error("Database Error (getPatientWithTests):", error);
    throw new Error('No se pudo obtener el detalle del paciente.');
  }
}
