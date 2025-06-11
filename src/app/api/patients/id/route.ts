// src/app/api/patients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Función para calcular la edad (reutilizada para mantener consistencia)
function calculateChronologicalAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * GET: Obtener un paciente específico por su ID.
 * Es usado por el PatientProvider para cargar los datos del paciente seleccionado.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        biophysics_tests: { // Opcional: Incluir el historial de tests
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ message: 'Paciente no encontrado' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error(`Error en GET /api/patients/[id]:`, error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}


/**
 * PUT: Actualizar un paciente existente.
 * Esta es la nueva lógica para el modo de edición del formulario.
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validar que el paciente exista antes de intentar actualizar
    const existingPatient = await prisma.patient.findUnique({ where: { id } });
    if (!existingPatient) {
      return NextResponse.json({ message: 'Paciente no encontrado para actualizar' }, { status: 404 });
    }
    
    // --- MANEJO DE FECHA Y EDAD ---
    let birthDateObj: Date | undefined = undefined;
    let chronological_age: number | undefined = undefined;

    if (body.birth_date && typeof body.birth_date === 'string') {
      birthDateObj = new Date(body.birth_date);
      if (isNaN(birthDateObj.getTime())) {
          return NextResponse.json({ message: 'Formato de fecha de nacimiento inválido' }, { status: 400 });
      }
      chronological_age = calculateChronologicalAge(birthDateObj);
    }
    
    // --- PREPARAR DATOS PARA PRISMA ---
    const patientDataToUpdate = {
      ...body, // Pasamos todos los campos del formulario
      birth_date: birthDateObj, // Sobrescribimos con el objeto Date
      chronological_age: chronological_age, // Sobrescribimos con la edad calculada
    };

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: patientDataToUpdate,
    });

    return NextResponse.json(updatedPatient, { status: 200 });

  } catch (error: any) {
    console.error(`Error en PUT /api/patients/[id]:`, error);
    // Manejar el caso donde se intenta cambiar la cédula a una que ya existe
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: `Conflicto: Los datos únicos (ej. Cédula o Email) ya pertenecen a otro paciente.` },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ message: 'Error del servidor al actualizar el paciente.', details: error.message }, { status: 500 });
  }
}
