import PatientForm from '@/components/features/patient/PatientForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

/**
 * Página dedicada para crear un nuevo paciente.
 * Es un Server Component. Su única responsabilidad es renderizar el formulario.
 */
export default function NuevoPacientePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Nueva Historia Clínica"
        icon={faUserPlus}
        description="Complete la información a continuación para registrar un nuevo paciente."
      />
      
      {/* El componente PatientForm se encarga de la captura de datos y la comunicación con la Server Action */}
      <PatientForm />
    </div>
  );
}
