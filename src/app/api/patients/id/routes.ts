// src/app/api/patients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Consulta para obtener paciente por ID
    const patientQuery = `
      SELECT *
      FROM persons
      WHERE id = ?
    `;
    
    const patients = await query(patientQuery, [id]);
    
    if (patients.length === 0) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(patients[0]);
  } catch (error) {
    console.error(`Error en GET /api/patients/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error al obtener el paciente' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const patientData = await request.json();
    
    // Validación básica
    if (!patientData.names || !patientData.surnames || !patientData.identification) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    // Actualizar en la base de datos
    const updateQuery = `
      UPDATE persons
      SET 
        names = ?,
        surnames = ?,
        identification = ?,
        birthday = ?,
        gender = ?,
        age = ?,
        phone = ?,
        email = ?,
        address = ?,
        country = ?,
        city = ?,
        birthplace = ?,
        blood_type = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    
    await query(updateQuery, [
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
      patientData.blood_type || null,
      id
    ]);
    
    // Obtener el paciente actualizado
    const updatedPatient = await query(
      'SELECT * FROM persons WHERE id = ?',
      [id]
    );
    
    if (updatedPatient.length === 0) {
      return NextResponse.json(
        { error: 'Paciente no encontrado después de actualizar' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPatient[0]);
  } catch (error) {
    console.error(`Error en PUT /api/patients/${params.id}:`, error);
    
    // Si es un error de duplicado (violación de clave única)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe un paciente con esta identificación' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar paciente' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar que el paciente existe
    const patientExists = await query(
      'SELECT id FROM persons WHERE id = ?',
      [id]
    );
    
    if (patientExists.length === 0) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }
    
    // Eliminar historias relacionadas primero (integridad referencial)
    await query('DELETE FROM clinical_histories WHERE patient_id = ?', [id]);
    
    // Eliminar paciente
    await query('DELETE FROM persons WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error en DELETE /api/patients/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error al eliminar paciente' },
      { status: 500 }
    );
  }
}