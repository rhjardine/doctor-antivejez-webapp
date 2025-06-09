// CÓDIGO CORRECTO Y DEFINITIVO para src/app/api/patients/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/patients - Obtener lista de pacientes
export async function GET(request: Request) {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/patients - Crear nueva historia/paciente
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.surnames || !data.names || !data.identification_number || !data.birth_date) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const birthDate = new Date(data.birth_date);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const chronological_age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const newPatient = await prisma.patient.create({
      data: {
        surnames: data.surnames,
        names: data.names,
        identification_number: data.identification_number,
        nationality: data.nationality,
        birth_date: birthDate,
        chronological_age: chronological_age,
        gender: data.gender,
        marital_status: data.marital_status,
        occupation: data.occupation,
        address: data.address,
        country: data.country,
        state_province: data.state_province,
        city: data.city,
        phone_number: data.phone_number,
        email: data.email,
        photo_url: data.photo_url,
        blood_type: data.blood_type,
        general_observations: data.general_observations,
      },
    });
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ message: 'Error creating patient' }, { status: 500 });
  }
}