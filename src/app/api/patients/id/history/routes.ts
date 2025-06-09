// src/app/api/patients/[id]/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface DatabaseError {
  code: string;
  errno: number;
  sqlMessage: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    
    // Obtener la historia clínica más reciente del paciente
    const historyQuery = `
      SELECT *
      FROM clinical_histories
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const histories = await query(historyQuery, [patientId]);
    
    if (histories.length === 0) {
      return NextResponse.json(
        { error: 'Historia clínica no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(histories[0]);
  } catch (error) {
    console.error('Error al crear paciente:', error);
  
    // Manejo seguro del error unknown
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string; [key: string]: any };
      
      // Si es un error de duplicado (violación de clave única)
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'Ya existe un paciente con esta identificación' },
          { status: 409 }
        );
      }
    }
  
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}