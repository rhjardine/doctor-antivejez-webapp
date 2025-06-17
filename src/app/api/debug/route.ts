// src/app/api/debug/db-check/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  console.log("--- INICIANDO DIAGNÓSTICO DE BASE DE DATOS ---");
  try {
    const boardCount = await prisma.board.count();
    const rangeCount = await prisma.range.count();

    console.log(`Conteo de 'Board': ${boardCount}`);
    console.log(`Conteo de 'Range': ${rangeCount}`);
    console.log("--- DIAGNÓSTICO FINALIZADO ---");

    return NextResponse.json({
      message: "Diagnóstico completado.",
      database_connection: "Exitosa",
      data_found: {
        boardCount,
        rangeCount,
      }
    });

  } catch (error) {
    console.error("ERROR CRÍTICO DURANTE EL DIAGNÓSTICO:", error);
    return NextResponse.json(
      { 
        message: "Error en el diagnóstico.",
        database_connection: "Fallida",
        error_details: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    );
  }
}
