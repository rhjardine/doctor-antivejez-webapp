'use server'; // ¡Importante! Marca esto como una Server Action.

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAME = 'auth-token';

// Simulación de una función que verifica las credenciales del usuario en la base de datos
async function verifyCredentials(email: string, password: string): Promise<{ success: boolean; token?: string }> {
  // --- EN UN PROYECTO REAL ---
  // 1. Buscar el usuario en la base de datos por email.
  // 2. Comparar el hash de la contraseña proporcionada con el hash almacenado.
  // 3. Si coinciden, generar un token (ej. JWT).
  // 4. Devolver { success: true, token: 'tu-jwt-aqui' }.
  
  // --- PARA ESTA DEMOSTRACIÓN ---
  // Simulamos un login exitoso con credenciales específicas.
  if (email === 'admin@doctor.com' && password === 'password123') {
    // Simulamos un token. En un caso real, esto sería un JWT.
    const token = `fake-token-${Date.now()}`; 
    return { success: true, token };
  }
  
  return { success: false };
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' };
  }

  const { success, token } = await verifyCredentials(email, password);

  if (!success || !token) {
    return { error: 'Credenciales inválidas.' };
  }

  // Si el login es exitoso, establecemos la cookie.
  // `httpOnly` y `secure` son importantes para la seguridad.
  cookies().set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: '/',
  });
  
  // Una vez establecida la cookie, redirigimos al dashboard.
  redirect('/dashboard');
}

export async function logout() {
  // Para cerrar sesión, simplemente eliminamos la cookie.
  cookies().set(AUTH_COOKIE_NAME, '', { expires: new Date(0) });
  redirect('/login');
}