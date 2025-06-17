'use server';

import prisma from '@/lib/prisma';

// --- Server Action para obtener todos los pacientes ---
export async function getAllPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return patients;
  } catch (error) {
    console.error('Error en Server Action getAllPatients:', error);
    // En una aplicación real, podrías manejar el error de forma más elegante
    return [];
  }
}

// --- Server Action para obtener un paciente por su ID ---
export async function getPatientById(id: string) {
  try {
    // **LA CORRECCIÓN CLAVE:**
    // Convertimos el ID (que llega como string) a un número entero.
    const patientIdNum = parseInt(id, 10);

    // Verificamos si la conversión fue exitosa. Si no, es un ID inválido.
    if (isNaN(patientIdNum)) {
      console.error(`ID inválido proporcionado a getPatientById: ${id}`);
      return null;
    }

    const patient = await prisma.patient.findUnique({
      where: { 
        id: patientIdNum // <-- Ahora pasamos el número a Prisma
      },
      include: {
        biophysical_tests: {
          orderBy: {
            test_date: 'desc',
          },
        },
      },
    });
    
    return patient;

  } catch (error) {
    console.error(`Error en Server Action getPatientById con id ${id}:`, error);
    return null;
  }
}

// Aquí puedes añadir otras Server Actions como createPatient, updatePatient, deletePatient...