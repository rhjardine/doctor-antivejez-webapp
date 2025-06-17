import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/biophysics-tests
// Esta función crea un nuevo registro de test biofísico.
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      patientId,
      chronologicalAge,
      biologicalAge,
      differentialAge,
      gender,
      isAthlete,
      measurements,
      partialAges,
      testDate,
    } = data;

    // Validar datos requeridos básicos
    if (!patientId || chronologicalAge === undefined || biologicalAge === undefined || differentialAge === undefined) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (patientId, chronologicalAge, biologicalAge, differentialAge).' },
        { status: 400 }
      );
    }

    const parsedPatientId = parseInt(patientId);
    if (isNaN(parsedPatientId)) {
        return NextResponse.json(
            { error: 'ID de paciente inválido.' },
            { status: 400 }
        );
    }

    // Verificar que el paciente existe
    const patient = await prisma.patient.findUnique({
      where: { id: parsedPatientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado.' },
        { status: 404 }
      );
    }

    // Crear el test biofísico
    const biophysicalTest = await prisma.biophysicalTest.create({
      data: {
        patient_id: parsedPatientId,
        chronological_age: parseFloat(chronologicalAge),
        biological_age: parseFloat(biologicalAge),
        differential_age: parseFloat(differentialAge),
        gender: gender,
        is_athlete: Boolean(isAthlete), // Convierte a booleano
        measurements: JSON.stringify(measurements), // Guarda las mediciones como JSON string
        partial_ages: JSON.stringify(partialAges),   // Guarda las edades parciales como JSON string
        test_date: new Date(testDate), // Convierte la cadena de fecha a un objeto Date
      },
    });

    return NextResponse.json(biophysicalTest, { status: 201 });
  } catch (error: any) { // Tipado como 'any' para acceder a .message
    console.error('Error al crear test biofísico:', error);
    return NextResponse.json(
      { error: error.message || 'Error al guardar el test biofísico.' },
      { status: 500 }
    );
  }
}

// GET /api/biophysics-tests
// GET /api/biophysics-tests?patientId=<ID_DEL_PACIENTE>
// Esta función maneja las solicitudes GET para obtener tests biofísicos.
// Puede obtener todos los tests o filtrar por patientId.
export async function GET(request: NextRequest) { // Tipo de request actualizado a NextRequest
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId'); // Obtener patientId del query parameter

    let whereClause: any = {};
    if (patientId) {
      const parsedPatientId = parseInt(patientId);
      if (!isNaN(parsedPatientId)) {
        whereClause = {
          patient_id: parsedPatientId,
        };
      } else {
        return NextResponse.json({ message: 'ID de paciente inválido en la consulta.' }, { status: 400 });
      }
    }

    const tests = await prisma.biophysicalTest.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            names: true,
            surnames: true,
          },
        },
      },
      orderBy: { created_at: 'desc' }, // Ordena por fecha de creación descendente
    });

    return NextResponse.json(tests);
  } catch (error: any) { // Tipado como 'any' para acceder a .message
    console.error('Error al obtener tests biofísicos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener los tests biofísicos.' },
      { status: 500 }
    );
  }
}
