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

// --- GET: Obtener un paciente específico por su ID ---
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const patientIdNum = parseInt(id, 10);
    if (isNaN(patientIdNum)) {
      return NextResponse.json({ message: 'ID de paciente inválido. Debe ser un número.' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientIdNum },
      include: {
        biophysical_tests: { orderBy: { created_at: 'desc' } },
      },
    });

    if (!patient) {
      return NextResponse.json({ message: `Paciente con ID ${patientIdNum} no encontrado` }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error: any) {
    console.error(`Error en GET /api/patients/${params.id}:`, error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// --- PUT: Actualizar un paciente existente ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const patientIdNum = parseInt(id, 10);
    if (isNaN(patientIdNum)) {
      return NextResponse.json({ message: 'ID de paciente inválido.' }, { status: 400 });
    }

    const body = await request.json();

    const existingPatient = await prisma.patient.findUnique({ where: { id: patientIdNum } });
    if (!existingPatient) {
      return NextResponse.json({ message: 'Paciente no encontrado para actualizar' }, { status: 404 });
    }
    
    let birthDateObj: Date | null = body.birth_date ? new Date(body.birth_date) : null;
    let finalChronologicalAge: number | null = birthDateObj ? calculateChronologicalAge(birthDateObj) : null;

    const patientDataToUpdate = {
      ...body,
      birth_date: birthDateObj,
      chronological_age: finalChronologicalAge,
    };

    const updatedPatient = await prisma.patient.update({
      where: { id: patientIdNum },
      data: patientDataToUpdate,
    });

    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error: any) {
    console.error(`Error en PUT /api/patients/${params.id}:`, error);
    return NextResponse.json({ message: 'Error del servidor al actualizar el paciente' }, { status: 500 });
  }
}

// --- DELETE: Eliminar un paciente específico por su ID ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const patientIdNum = parseInt(id, 10);
    if (isNaN(patientIdNum)) {
      return NextResponse.json({ message: 'ID de paciente inválido.' }, { status: 400 });
    }

    await prisma.patient.delete({
      where: { id: patientIdNum },
    });

    return new NextResponse(null, { status: 204 }); // Respuesta estándar para DELETE exitoso
  } catch (error: any) {
    console.error(`Error en DELETE /api/patients/${params.id}:`, error);
    return NextResponse.json({ message: 'Error al eliminar paciente' }, { status: 500 });
  }
}