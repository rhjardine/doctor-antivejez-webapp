import type { Prisma, Patient, BiophysicsTest } from '@prisma/client';

/**
 * --- TIPOS BASE DE PRISMA ---
 * Exportamos los tipos directamente desde el cliente de Prisma
 * para mantener la consistencia en toda la aplicación.
 */
export type { Patient, BiophysicsTest };


/**
 * --- TIPOS EXTENDIDOS PARA COMPONENTES ---
 * Aquí creamos tipos más específicos que incluyen relaciones
 * y son útiles para las props de los componentes.
 */

// Paciente con todos sus tests biofísicos asociados
export type PatientWithBiophysicsTests = Prisma.PatientGetPayload<{
  include: {
    biophysics_tests: true;
  }
}>;

// Un solo test biofísico con la información del paciente
export type BiophysicsTestWithPatient = Prisma.BiophysicsTestGetPayload<{
  include: {
    patient: true;
  }
}>;

/**
 * --- TIPOS PARA FORMULARIOS Y ESTADOS DE UI ---
 */

// Define la estructura de los campos en el formulario de Edad Biofísica
export interface BiofisicaFormField {
  name: string;
  translate: string;
  value: number | null;
  biologicalAge: number | null;
}

// Define el estado de la UI para la página de detalles del paciente
export type PatientDetailView = 'detail' | 'test_form';
export type PatientDetailTab = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';

