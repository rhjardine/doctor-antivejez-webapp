import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/biophysics-tests - Guardar un nuevo test
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validar que el paciente exista
    const patientExists = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patientExists) {
      return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
    }

    const newTest = await prisma.biophysicsTest.create({
      data: {
        patientId: data.patientId,
        chronological_age: data.chronological_age,
        biological_age: data.biological_age,
        differential_age: data.differential_age,
        form_data: data.form_data, // El frontend envía el JSON con los detalles
      },
    });

    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    console.error("Error saving biophysics test:", error);
    return NextResponse.json({ message: 'Error saving test' }, { status: 500 });
  }
}
