import { getPatientWithTests } from '@/lib/actions/patientActions'; // Importamos la Server Action
import PatientDetailClient from '@/components/features/patient/PatientDetailClient'; // Importamos el componente desde su NUEVA ubicación
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string; // El ID del paciente viene de la URL
  };
}

/**
 * Esta es la página del SERVIDOR para el detalle de un paciente.
 * Su única función es obtener los datos y pasarlos al componente cliente.
 */
export default async function PatientDetailPage({ params }: PageProps) {
  // 1. Obtenemos los datos del paciente en el servidor
  const patient = await getPatientWithTests(params.id);

  // 2. Si el paciente no existe, mostramos una página 404
  if (!patient) {
    notFound();
  }

  // 3. Renderizamos el componente cliente, pasándole los datos iniciales
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PatientDetailClient initialPatient={patient} />
    </div>
  );
}
