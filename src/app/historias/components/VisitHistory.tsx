// src/app/historias/components/VisitHistory.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, faFileMedical, faSpinner, 
  faChevronLeft, faChevronRight, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { usePatient } from '@/contexts/PatientProvider';

interface VisitHistoryProps {
  patientId: string;
  onViewVisitDetail: (visitId: string) => void;
  onBack: () => void;
}

export default function VisitHistory({ patientId, onViewVisitDetail, onBack }: VisitHistoryProps) {
  // Estados
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Contexto del paciente
  const { currentPatient, historicalVisits, fetchHistoricalVisits } = usePatient();
  
  // Cargar visitas al montar el componente
  useEffect(() => {
    if (patientId) {
      loadVisits();
    }
  }, [patientId]);
  
  // Función para cargar visitas
  const loadVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await fetchHistoricalVisits(patientId);
    } catch (error) {
      console.error('Error loading visits:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b-2 border-[#23BCEF]/20 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#293B64] dark:text-[#23BCEF] flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-[#23BCEF]" />
            Historial de Visitas
          </h2>
          {currentPatient && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Paciente: {currentPatient.surnames} {currentPatient.names}
            </p>
          )}
        </div>
        
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border-2 border-[#23BCEF]/30 text-[#23BCEF] hover:bg-[#23BCEF]/10 transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>Volver</span>
        </button>
      </div>
      
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Lista de visitas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#23BCEF] text-3xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando historial de visitas...</p>
        </div>
      ) : historicalVisits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <FontAwesomeIcon icon={faFileMedical} className="text-[#23BCEF]/50 text-5xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No hay visitas registradas para este paciente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historicalVisits.map((visit) => (
            <div 
              key={visit.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-[#23BCEF]" />
                    <span className="font-semibold text-[#293B64] dark:text-[#23BCEF]">
                      {formatDate(visit.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Historia Clínica #{visit.id}
                  </p>
                  
                  {visit.biological_age && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#23BCEF]/10 text-[#23BCEF] font-medium text-sm">
                      Edad Biológica: {visit.biological_age} años
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => onViewVisitDetail(visit.id)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#23BCEF] to-[#293B64] text-white hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Ver Detalles
                </button>
              </div>
              
              {/* Resumen de la visita si hay diagnóstico */}
              {visit.diagnosis && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">
                    Diagnóstico:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {visit.diagnosis}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}