import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const whereClause = query
      ? {
          OR: [
            { names: { contains: query, mode: 'insensitive' } },
            { surnames: { contains: query, mode: 'insensitive' } },
            { identification_number: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};

    const patients = await prisma.patient.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(patients, { status: 200 });
  } catch (error: any) {
    console.error('Error en GET /api/patients:', error);
    return NextResponse.json(
      { message: 'Error al obtener pacientes', error: error.message },
      { status: 500 }
    );
  }
}

// Función auxiliar para calcular la edad cronológica
function calculateChronologicalAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export async function POST(request: Request) {
  try {
    // Extraemos los datos del cuerpo de la solicitud
    const { birth_date, history_date, chronological_age: received_chronological_age, ...restOfData } = await request.json();

    // Convertir birth_date a Date. Si no existe, se considera null.
    const parsedBirthDate = birth_date ? new Date(birth_date) : null;

    // Calcular la edad cronológica en el backend si birth_date es válida
    let finalChronologicalAge: number | null = null;
    if (parsedBirthDate instanceof Date && !isNaN(parsedBirthDate.getTime())) {
      finalChronologicalAge = calculateChronologicalAge(parsedBirthDate);
    } else if (typeof received_chronological_age === 'number') {
      // Si no se puede calcular desde birth_date pero se recibe un número válido, usarlo
      finalChronologicalAge = received_chronological_age;
    } else if (typeof received_chronological_age === 'string' && !isNaN(parseFloat(received_chronological_age))) {
        finalChronologicalAge = parseFloat(received_chronological_age);
    }


    // Convertir history_date a string con formato 'YYYY-MM-DD' o null
    const parsedHistoryDate = history_date ? new Date(history_date).toISOString().split('T')[0] : null;

    // Validar que chronological_age no sea null antes de crear el paciente si es un campo requerido
    if (finalChronologicalAge === null) {
      throw new Error('La edad cronológica es obligatoria y no pudo ser calculada.');
    }


    const patient = await prisma.patient.create({
      data: {
        ...restOfData, // El resto de los campos de data
        chronological_age: finalChronologicalAge, // Usamos la edad calculada/parseada en el backend
        birth_date: parsedBirthDate, // Campo birth_date con el tipo correcto (Date o null)
        history_date: parsedHistoryDate, // Campo history_date con el tipo correcto (string o null)
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/patients:', error);
    return NextResponse.json(
      { message: 'Error al crear paciente', error: error.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID de paciente no proporcionado' }, { status: 400 });
        }

        const { chronological_age: received_chronological_age, birth_date, history_date, ...restOfData } = await request.json();

        // Convertir birth_date a Date. Si no existe, se considera null.
        const parsedBirthDate = birth_date ? new Date(birth_date) : null;

        // Calcular la edad cronológica en el backend si birth_date es válida
        let finalChronologicalAge: number | null = null;
        if (parsedBirthDate instanceof Date && !isNaN(parsedBirthDate.getTime())) {
            finalChronologicalAge = calculateChronologicalAge(parsedBirthDate);
        } else if (typeof received_chronological_age === 'number') {
            finalChronologicalAge = received_chronological_age;
        } else if (typeof received_chronological_age === 'string' && !isNaN(parseFloat(received_chronological_age))) {
            finalChronologicalAge = parseFloat(received_chronological_age);
        }

        // Convertir history_date a string con formato 'YYYY-MM-DD' o null
        const parsedHistoryDate = history_date ? new Date(history_date).toISOString().split('T')[0] : null;

        // Validar que chronological_age no sea null antes de actualizar el paciente si es un campo requerido
        if (finalChronologicalAge === null) {
            throw new Error('La edad cronológica es obligatoria y no pudo ser calculada.');
        }

        const updatedPatient = await prisma.patient.update({
            where: { id: parseInt(id) },
            data: {
                ...restOfData,
                birth_date: parsedBirthDate,
                history_date: parsedHistoryDate,
                chronological_age: finalChronologicalAge,
            },
        });

        return NextResponse.json(updatedPatient, { status: 200 });
    } catch (error: any) {
        console.error('Error en PUT /api/patients:', error);
        return NextResponse.json(
            { message: 'Error al actualizar paciente', error: error.message || 'Error desconocido' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID de paciente no proporcionado' }, { status: 400 });
        }

        await prisma.patient.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Paciente eliminado exitosamente' }, { status: 200 });
    } catch (error: any) {
        console.error('Error en DELETE /api/patients:', error);
        return NextResponse.json(
            { message: 'Error al eliminar paciente', error: error.message || 'Error desconocido' },
            { status: 500 }
        );
    }
}
