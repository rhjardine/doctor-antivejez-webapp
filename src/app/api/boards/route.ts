import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/boards - Obtener todos los baremos para el cálculo
export async function GET() {
    try {
        const boards = await prisma.board.findMany({
            include: {
                range: true, // Incluye los datos del rango de edad relacionado
            },
        });
        return NextResponse.json(boards);
    } catch (error) {
        console.error("Error fetching boards:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
