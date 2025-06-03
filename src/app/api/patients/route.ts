// src/app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Suponiendo que existe una configuración de conexión a BD

export async function GET(request: NextRequest) {
  try {
    // Parámetros de búsqueda y paginación
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Consulta SQL para obtener pacientes
    const patientsQuery = `
      SELECT 
        p.id, p.names, p.surnames, p.identification, p.birthday, 
        p.gender, p.age, p.phone, p.email, p.created_at
      FROM persons p
      WHERE (p.names LIKE ? OR p.surnames LIKE ? OR p.identification LIKE ?)
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Consulta para contar total de registros (para paginación)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM persons p
      WHERE (p.names LIKE ? OR p.surnames LIKE ? OR p.identification LIKE ?)
    `;
    
    // Parámetros para búsqueda
    const searchParam = `%${search}%`;
    
    // Ejecutar consultas
    const patients = await query(patientsQuery, [searchParam, searchParam, searchParam, limit, offset]);
    const [{ total }] = await query(countQuery, [searchParam, searchParam, searchParam]);
    
    // Preparar respuesta con metadatos de paginación
    return NextResponse.json({
      data: patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error en GET /api/patients:', error);
    return NextResponse.json(
      { error: 'Error al obtener pacientes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const patientData = await request.json();
    
    // Validación básica
    if (!patientData.names || !patientData.surnames || !patientData.identification) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    // Insertar en la base de datos
    const insertQuery = `
      INSERT INTO persons (
        names, surnames, identification, birthday, gender, 
        age, phone, email, address, country, city, 
        birthplace, blood_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const result = await query(insertQuery, [
      patientData.names,
      patientData.surnames,
      patientData.identification,
      patientData.birthday || null,
      patientData.gender || null,
      patientData.age || null,
      patientData.phone || null,
      patientData.email || null,
      patientData.address || null,
      patientData.country || null,
      patientData.city || null,
      patientData.birthplace || null,
      patientData.blood_type || null
    ]);
    
    // Obtener el nuevo paciente insertado
    const newPatient = await query(
      'SELECT * FROM persons WHERE id = ?',
      [result.insertId]
    );
    
    return NextResponse.json(newPatient[0], { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/patients:', error);
    
    // Si es un error de duplicado (violación de clave única)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe un paciente con esta identificación' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear paciente' },
      { status: 500 }
    );
  }
}