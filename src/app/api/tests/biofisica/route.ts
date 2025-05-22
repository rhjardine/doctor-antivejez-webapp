// src/app/api/tests/biofisica/route.ts

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise'; // Importa la versión promise de mysql2

// Configuración de la conexión a la base de datos usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Asegúrate de convertir el puerto a número
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true, // Opciones de pool
  connectionLimit: 10,
  queueLimit: 0
};

// Crear un pool de conexiones para mejor rendimiento
const pool = mysql.createPool(dbConfig);

// Handler para peticiones POST (Guardar nuevo test biofísico)
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Obtiene los datos enviados en el cuerpo de la petición

    // --- Validación Básica (¡Importante!) ---
    // Debes validar que los datos recibidos son correctos y seguros
    if (!body || typeof body !== 'object') {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    // Ejemplo de validación para algunos campos (adapta a todos los campos necesarios)
    // Asegúrate de que patient_id esté presente y sea válido
    if (typeof body.patient_id !== 'string' || !body.patient_id.trim()) {
        return NextResponse.json({ message: 'patient_id is required' }, { status: 400 });
    }
    // Valida otros campos numéricos, string, etc.
    if (typeof body.Edad_cronologica_input === 'undefined' || body.Edad_cronologica_input === null) {
         return NextResponse.json({ message: 'Edad_cronologica_input is required' }, { status: 400 });
    }
     // ... valida todos los campos que vas a insertar ...


    // --- Conexión y Ejecución de la Consulta ---
    const connection = await pool.getConnection(); // Obtiene una conexión del pool

    try {
      // Consulta SQL para insertar los datos en la tabla biofisica_tests
      // Asegúrate de que los nombres de las columnas coincidan exactamente con tu tabla
      const [result] = await connection.execute(
        `INSERT INTO biofisica_tests (
           patient_id, test_date, Edad_cronologica_input, Peso_kg, imc_calculado,
           Cintura_cm, Cadera_cm, icc_calculado, Grasa_corporal_pct,
           Masa_visceral_nivel, Masa_muscular_kg, Masa_osea_kg, Presion_sistolica,
           Presion_diastolica, Frecuencia_cardiaca, Saturacion_o2_pct,
           Fuerza_agarre_kg, Flexibilidad_cm, Edad_Diferencial_texto
         ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.patient_id,
          body.Edad_cronologica_input,
          body.Peso_kg,
          body.imc_calculado,
          body.Cintura_cm,
          body.Cadera_cm,
          body.icc_calculado,
          body.Grasa_corporal_pct,
          body.Masa_visceral_nivel,
          body.Masa_muscular_kg,
          body.Masa_osea_kg,
          body.Presion_sistolica,
          body.Presion_diastolica,
          body.Frecuencia_cardiaca,
          body.Saturacion_o2_pct,
          body.Fuerza_agarre_kg,
          body.Flexibilidad_cm,
          body.Edad_Diferencial_texto, // Asegúrate que este campo existe y es correcto
        ]
      );

      // El campo 'test_id' es AUTO_INCREMENT, la base de datos lo generará.
      // Puedes obtener el ID insertado así si lo necesitas:
      const insertId = (result as any).insertId;

      // Respuesta exitosa
      return NextResponse.json({ message: 'Test data saved successfully', id: insertId }, { status: 201 }); // 201 Created

    } catch (dbError: any) {
      console.error('Database error during insert:', dbError);
      // Manejar errores específicos de la base de datos si es necesario
      return NextResponse.json({ message: 'Database operation failed', error: dbError.message }, { status: 500 });

    } finally {
      connection.release(); // Siempre libera la conexión de vuelta al pool
    }

  } catch (requestError: any) {
    console.error('Request processing error:', requestError);
    // Manejar errores al leer el body de la petición (ej. JSON inválido)
    return NextResponse.json({ message: 'Failed to process request', error: requestError.message }, { status: 400 });
  }
}

// Opcional: Handler para peticiones GET (Ejemplo - Para obtener datos existentes)
// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const patientId = searchParams.get('patient_id');
//     // ... lógica para obtener datos ...
//     return NextResponse.json({ message: 'GET handler not fully implemented' });
//   } catch (error) {
//     console.error('GET error:', error);
//     return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
//   }
// }