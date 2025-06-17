import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'auth-token';

// Lista de rutas que NO requieren autenticación
const PUBLIC_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Imprime en la consola del servidor para depuración.
  // Si no ves este mensaje, el middleware NO se está ejecutando.
  console.log(`[MIDDLEWARE] Interceptando ruta: ${pathname}`);

  // 1. Obtiene el token de la cookie
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 2. Comprueba si la ruta solicitada es pública
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // --- LÓGICA DE REDIRECCIÓN ---

  // Si el usuario está autenticado (tiene token)
  if (authToken) {
    // Y está intentando acceder a una ruta pública (como /login),
    // lo redirigimos al dashboard.
    if (isPublicRoute) {
      console.log('[MIDDLEWARE] Usuario autenticado en ruta pública. Redirigiendo a /dashboard...');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } 
  // Si el usuario NO está autenticado (no tiene token)
  else {
    // Y está intentando acceder a una ruta que NO es pública,
    // lo redirigimos a la página de login.
    if (!isPublicRoute) {
      console.log('[MIDDLEWARE] Usuario no autenticado en ruta protegida. Redirigiendo a /login...');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si ninguna de las condiciones de redirección se cumple,
  // permite que la petición continúe.
  return NextResponse.next();
}

// Configuración del matcher: Sigue siendo importante para el rendimiento.
// Este matcher es correcto y no necesita cambios.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};