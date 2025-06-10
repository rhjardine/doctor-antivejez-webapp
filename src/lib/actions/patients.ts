// src/lib/actions/patients.ts (COMPLETO Y CORREGIDO)
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Esquema de validación para la creación/actualización de pacientes
const PatientSchema = z.object({
  surnames: z.string().min(2, 'Los apellidos son requeridos.'),
  names: z.string().min(2, 'Los nombres son requeridos.'),
  identification_number: z.string().min(1, 'La identificación es requerida.'),
  nationality: z.string().min(1, 'La nacionalidad es requerida.'),
  birth_date: z.string().min(1, 'La fecha de nacimiento es requerida.'),
  gender: z.string().min(1, 'El género es requerido.'),
  email: z.string().email('Email no válido.').optional().or(z.literal('')),
  // Añade otros campos opcionales aquí si los validas
  phone_number: z.string().optional(),
  // ... etc
});

export type FormState = {
  errors?: { [key: string]: string[] | undefined; };
  message?: string | null;
  patientId?: string | null;
};

// --- ACCIONES CRUD PARA PACIENTES ---

export async function createPatient(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = PatientSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos o hay errores. No se pudo crear el paciente.',
    };
  }

  const { birth_date, ...data } = validatedFields.data;
  
  const birthDate = new Date(birth_date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  try {
    const newPatient = await prisma.patient.create({
      data: {
        ...data,
        birth_date: birthDate,
        chronological_age: age,
      },
    });

    revalidatePath('/historias'); // Invalida la caché de la página de historias
    return { message: 'Paciente creado con éxito.', patientId: newPatient.id };

  } catch (error: any) {
    console.error('Error de base de datos:', error);
    if (error.code === 'P2002') {
      return { message: 'Error: La identificación o el email ya existen.' };
    }
    return { message: 'Error de base de datos: No se pudo crear el paciente.' };
  }
}

export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return patients;
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return []; // Devuelve un array vacío en caso de error
  }
}

export async function getPatientWithHistory(patientId: string) {
  if (!patientId) return null;
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        biophysics_tests: { orderBy: { createdAt: 'desc' } },
      },
    });
    return patient;
  } catch (error) {
    console.error(`Error al obtener paciente ${patientId}:`, error);
    return null;
  }
}

// ... funciones para update y delete si las necesitas ...