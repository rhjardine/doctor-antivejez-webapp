// src/app/api/patients/[id]/visits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    
    // Obtener todas las historias clínicas del paciente ordenadas por fecha
    const visitsQuery = `
      SELECT 
        ch.*,
        bt.biological_age,
        bt.test_date
      FROM clinical_histories ch
      LEFT JOIN bio_tests bt ON ch.id = bt.history_id
      WHERE ch.patient_id = ?
      ORDER BY ch.created_at DESC
    `;
    
    const visits = await query(visitsQuery, [patientId]);
    
    return NextResponse.json(visits);
  } catch (error) {
    console.error(`Error en GET /api/patients/${params.id}/visits:`, error);
    return NextResponse.json(
      { error: 'Error al obtener el histórico de visitas' },
      { status: 500 }
    );
  }
}