// src/app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 

// --- GET: OBTENER LISTA DE PACIENTES ---
export async function GET(request: NextRequest) {
  // Envolvemos TODO en un bloque try...catch para garantizar una respuesta.
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Cláusula de búsqueda opcional
    const whereClause = search ? {
      OR: [
        { names: { contains: search, mode: 'insensitive' as const } },
        { surnames: { contains: search, mode: 'insensitive' as const } },
        { identification_number: { contains: search, mode: 'insensitive' as const } }
      ],
    } : {};

    const patients = await prisma.patient.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    // Éxito: Devolvemos los pacientes encontrados (puede ser un array vacío).
    return NextResponse.json(patients);

  } catch (error) {
    // Falla: Capturamos cualquier error y devolvemos una respuesta de error 500.
    console.error('Error en GET /api/patients:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener los pacientes.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// --- POST: CREAR UN NUEVO PACIENTE ---
// Función para calcular la edad (más seguro hacerlo en el backend)
function calculateChronologicalAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export async function POST(request: NextRequest) {
  // Envolvemos TODO en un bloque try...catch.
  try {
    const body = await request.json();

    // Validación de campos esenciales
    if (!body.names || !body.surnames || !body.identification_number || !body.birth_date) {
      return NextResponse.json(
        { message: 'Los campos nombres, apellidos, identificación y fecha de nacimiento son requeridos.' },
        { status: 400 }
      );
    }

    // Conversión y validación de la fecha
    const birthDateObj = new Date(body.birth_date);
    if (isNaN(birthDateObj.getTime())) {
      return NextResponse.json({ message: 'Formato de fecha de nacimiento inválido. Use YYYY-MM-DD.' }, { status: 400 });
    }

    // Preparar los datos para Prisma
    const patientData = {
      surnames: body.surnames,
      names: body.names,
      identification_number: body.identification_number,
      nationality: body.nationality,
      birth_date: birthDateObj, // Usar el objeto Date
      chronological_age: calculateChronologicalAge(birthDateObj), // Calcular la edad aquí
      gender: body.gender,
      // ... resto de los campos ...
      birth_place: body.birth_place,
      marital_status: body.marital_status,
      occupation: body.occupation,
      address: body.address,
      country: body.country,
      state_province: body.state_province,
      city: body.city,
      phone_number: body.phone_number,
      email: body.email,
      blood_type: body.blood_type,
      general_observations: body.general_observations,
      photo_url: body.photo_url?.startsWith('blob:') ? null : body.photo_url, // Evitar guardar blob URLs
    };

    const newPatient = await prisma.patient.create({
      data: patientData,
    });

    // Éxito: Devolvemos el paciente recién creado.
    return NextResponse.json(newPatient, { status: 201 });

  } catch (error: any) {
    console.error('Error en POST /api/patients:', error);

    // Manejo específico para violación de constraint 'unique' (ej. cédula o email duplicado)
    if (error.code === 'P2002') {
      const fields = error.meta?.target || ['campo'];
      return NextResponse.json(
        { message: `Ya existe un paciente con estos datos: ${fields.join(', ')}` },
        { status: 409 } // 409 Conflict
      );
    }

    // Falla genérica: Devolvemos un error 500.
    return NextResponse.json(
      { message: 'Error del servidor al crear el paciente.', details: error.message },
      { status: 500 }
    );
  }
}