import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Función para calcular edad cronológica
function calculateChronologicalAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('GET /api/patients/[id] - id:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'ID del paciente es requerido' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      console.log('Patient not found:', id);
      return NextResponse.json(
        { error: `Paciente con ID ${id} no encontrado` },
        { status: 404 }
      );
    }

    console.log('Patient found:', patient.id);
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error in GET /api/patients/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log('PUT /api/patients/[id] - id:', id, 'body:', body);

    if (!id) {
      return NextResponse.json(
        { error: 'ID del paciente es requerido' },
        { status: 400 }
      );
    }

    // Calcular edad cronológica si se proporciona fecha de nacimiento
    let updateData = { ...body };
    if (body.birth_date && !body.chronological_age) {
      updateData.chronological_age = calculateChronologicalAge(body.birth_date);
    }

    // Remover campos que no existen en el esquema
    delete updateData.birthday;
    delete updateData.age;

    updateData.updatedAt = new Date();

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: updateData,
    });

    console.log('Patient updated:', updatedPatient.id);
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error in PUT /api/patients/[id]:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('DELETE /api/patients/[id] - id:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'ID del paciente es requerido' },
        { status: 400 }
      );
    }

    await prisma.patient.delete({
      where: { id },
    });

    console.log('Patient deleted:', id);
    return NextResponse.json({ message: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('Error in DELETE /api/patients/[id]:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}