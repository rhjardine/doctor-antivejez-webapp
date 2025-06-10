// src/app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Función para calcular edad cronológica (ajustada para recibir un objeto Date)
function calculateChronologicalAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// La función GET se mantiene igual, ya que funcionaba correctamente.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    console.log('GET /api/patients - search:', search);

    const whereClause = search ? {
      OR: [
        { names: { contains: search, mode: 'insensitive' as const } },
        { surnames: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const patients = await prisma.patient.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      // El select se puede omitir si quieres devolver todos los campos por defecto
    });

    console.log('Patients found:', patients.length);
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error in GET /api/patients:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// La función POST ha sido ajustada para manejar correctamente las fechas y la URL de la foto.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST /api/patients - body received:', body);

    // Validación básica
    if (!body.names || !body.surnames) {
      return NextResponse.json(
        { error: 'Nombres y apellidos son requeridos' },
        { status: 400 }
      );
    }

    // --- AJUSTE CLAVE: MANEJO DE FECHA Y EDAD ---
    let birthDateObj: Date | null = null;
    let chronological_age = 0;

    if (body.birth_date && typeof body.birth_date === 'string') {
      birthDateObj = new Date(body.birth_date);
      // Validar que la fecha sea un objeto Date válido
      if (isNaN(birthDateObj.getTime())) {
          return NextResponse.json({ error: 'Formato de fecha de nacimiento inválido' }, { status: 400 });
      }
      chronological_age = calculateChronologicalAge(birthDateObj);
    }
    
    // --- AJUSTE CLAVE: MANEJO DE PHOTO URL ---
    // Si la foto es un 'blob:', no es una URL persistente y no debe guardarse.
    // En un futuro, aquí iría la lógica para subir el archivo a un servidor y obtener una URL real.
    let finalPhotoUrl = body.photo_url;
    if (finalPhotoUrl && finalPhotoUrl.startsWith('blob:')) {
      finalPhotoUrl = null; // O una URL por defecto: '/images/default-avatar.png'
    }

    // Preparar los datos para Prisma de forma segura
    const patientData = {
      surnames: body.surnames,
      names: body.names,
      identification_number: body.identification_number,
      nationality: body.nationality,
      birth_date: birthDateObj, // Usamos el objeto Date, no el string
      chronological_age: chronological_age,
      gender: body.gender,
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
      photo_url: finalPhotoUrl, // Usamos la URL procesada
    };

    console.log('Creating patient with processed data:', patientData);

    const newPatient = await prisma.patient.create({
      data: patientData,
    });

    console.log('Patient created successfully:', newPatient.id);
    return NextResponse.json(newPatient, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/patients:', error);
    // Devuelve un mensaje de error más específico si es un error de Prisma
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        return NextResponse.json(
            { error: 'Error de validación', details: `Ya existe un paciente con ese número de identificación o email.` },
            { status: 409 } // 409 Conflict
        );
    }
    
    return NextResponse.json(
      { error: 'Error del servidor al guardar la historia.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}