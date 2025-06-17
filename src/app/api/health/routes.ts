// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  console.log("--- [API HEALTH CHECK] Petición recibida ---");
  try {
    const boardCount = await prisma.board.count();
    const rangeCount = await prisma.range.count();

    const isHealthy = boardCount > 0 && rangeCount > 0;

    console.log(`API Health Check: Boards=${boardCount}, Ranges=${rangeCount}. Estado: ${isHealthy ? 'SALUDABLE' : 'ERROR'}`);
    
    return NextResponse.json({
      status: isHealthy ? "ok" : "error",
      message: isHealthy ? "La base de datos está conectada y poblada." : "Error: La base de datos está conectada pero vacía.",
      data: {
        boardCount,
        rangeCount,
      }
    });

  } catch (error) {
    console.error("--- [API HEALTH CHECK] ERROR CRÍTICO ---", error);
    return NextResponse.json(
      { 
        status: "error",
        message: "Fallo crítico al conectar con la base de datos.",
        error_details: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    );
  }
}
