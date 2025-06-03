// src/app/api/patients/[id]/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    console.error(`Error en GET /api/patients/${params.id}/history:`, error);
    return NextResponse.json(
      { error: 'Error al obtener la historia clínica' },
      { status: 500 }
    );
  }
}