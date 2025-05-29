// src/app/api/boards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fallbackBoards from './fallbackBoards.json'; // Importamos datos fallback

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.doctorantivejez.com/api';

export async function GET(request: NextRequest) {
  try {
    // Obtener form de la query
    const searchParams = request.nextUrl.searchParams;
    const form = searchParams.get('form') || '1';
    
    // Validar que la URL esté configurada correctamente
    if (!API_BASE_URL || API_BASE_URL.includes('your-production-api.com')) {
      console.warn('API_BASE_URL no configurada correctamente, usando datos fallback');
      return NextResponse.json(fallbackBoards);
    }
    
    // Intentar llamar al backend de producción
    console.log(`Conectando a: ${API_BASE_URL}/boards?form=${form}`);
    const response = await fetch(`${API_BASE_URL}/boards?form=${form}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Agregar un timeout para evitar esperas prolongadas
      signal: AbortSignal.timeout(5000), // 5 segundos de timeout
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn(`Error del servidor: ${response.status} ${response.statusText}`);
      // Si hay un error 4xx o 5xx, usar datos fallback
      return NextResponse.json(fallbackBoards);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en boards proxy:', error);
    
    // En caso de error, devolver datos fallback en lugar de un error 500
    console.log('Usando datos fallback debido a error de conexión');
    return NextResponse.json(fallbackBoards);
  }
}