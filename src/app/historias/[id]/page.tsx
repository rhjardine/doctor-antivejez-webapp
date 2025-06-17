import { getPatientWithTests } from '@/lib/actions/patients';
import { notFound } from 'next/navigation';
import PatientDetailClient from './PatientDetailClient';

interface PageProps {
  params: {
    id: string;
  };
}

// La metadata puede ser dinámica, mostrando el nombre del paciente en el título de la pestaña del navegador.
export async function generateMetadata({ params }: PageProps) {
  const patient = await getPatientWithTests(params.id);
  if (!patient) {
    return { title: 'Paciente no Encontrado' };
  }
  return { title: `Historia de ${patient.names} ${patient.surnames}` };
}

/**
 * Esta es una página de servidor (Server Component).
 * 1. Obtiene el ID del paciente desde los parámetros de la URL.
 * 2. Llama a la Server Action `getPatientWithTests` para buscar los datos.
 * 3. Si el paciente no existe, muestra una página 404.
 * 4. Si el paciente existe, renderiza el componente de cliente `PatientDetailClient`,
 * pasándole los datos iniciales como props.
 */
export default async function PatientDetailPage({ params }: PageProps) {
  const patient = await getPatientWithTests(params.id);

  if (!patient) {
    notFound(); // Muestra la página 404 de Next.js
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Pasamos los datos obtenidos en el servidor al componente de cliente */}
      <PatientDetailClient initialPatient={patient} />
    </div>
  );
}
