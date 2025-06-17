// src/app/api/boards/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('API: Obteniendo baremos (boards) con sus rangos...');

    const boards = await prisma.board.findMany({
      // 1. Incluimos la relación 'ranges' (plural), como está definida en el schema.
      include: {
        ranges: true, 
      },
      // 2. CORRECCIÓN: Ordenamos solo por el nombre del 'Board'.
      //    No podemos ordenar por un campo de la relación 'ranges' en este nivel.
      orderBy: {
        name: 'asc',
      },
    });

    if (boards.length === 0) {
      console.warn('API Advertencia: No se encontraron baremos en la base de datos.');
      // Devolvemos un array vacío, el frontend mostrará el error.
      return NextResponse.json([]); 
    }
    
    console.log(`API: Se encontraron ${boards.length} baremos.`);
    return NextResponse.json(boards);

  } catch (error) {
    console.error('API Error en /api/boards:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener los baremos.' },
      { status: 500 }
    );
  }
}