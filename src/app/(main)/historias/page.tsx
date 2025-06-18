import { getPatients } from '@/lib/actions/patientActions';
// CORRECCIÓN: La ruta ahora apunta a 'features' (plural)
import PatientListClient from '@/components/features/patient/PatientListClient';
import { PageHeader } from '@/components/ui/PageHeader';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

/**
 * Página principal de la sección de Historias (Gestión de Pacientes).
 * Es un Server Component. Su única función es obtener los datos y pasarlos al cliente.
 */
export default async function HistoriasPage() {
  // La obtención de datos ocurre aquí, en el servidor.
  const patients = await getPatients();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Gestión de Pacientes"
        icon={faUsers}
        description="Busque, cree o gestione las historias clínicas de sus pacientes."
      />
      
      <PatientListClient initialPatients={patients} />
    </div>
  );
}

// Nota: Si el componente PageHeader no existe, puedes crearlo en 
// src/components/ui/PageHeader.tsx o comentar la línea de importación y su uso
// para simplificar mientras depuras.
