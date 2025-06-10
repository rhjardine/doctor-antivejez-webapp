// src/app/historias/layout.tsx (COMPLETO Y CORREGIDO)
import { PatientProvider } from '@/contexts/PatientProvider';

// Este layout envuelve a la página de historias y a cualquier futura sub-ruta.
// Proporciona el contexto del paciente a todos sus hijos.
export default function HistoriasLayout({ children }: { children: React.ReactNode }) {
  return <PatientProvider>{children}</PatientProvider>;
}