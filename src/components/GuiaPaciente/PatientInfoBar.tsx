// src/components/GuiaPaciente/PatientInfoBar.tsx
'use client';
import { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';

interface PatientInfoBarProps {
  patientName: string;
  onPatientNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  date: string;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PatientInfoBar({
  patientName, onPatientNameChange, date, onDateChange
}: PatientInfoBarProps) {
  return (
    <div className="bg-primary text-white p-4 rounded-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <FontAwesomeIcon icon={faUser} className="text-lg" />
        <label htmlFor="patient-name-guide" className="font-semibold text-sm whitespace-nowrap">Nombre Paciente:</label>
        <input
          type="text"
          id="patient-name-guide"
          name="patientName"
          value={patientName}
          onChange={onPatientNameChange}
          placeholder="Ingrese nombre"
          className="bg-white/90 text-secondary rounded-md p-2 text-sm w-full flex-grow sm:w-auto focus:ring-2 focus:ring-primary-light outline-none"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <FontAwesomeIcon icon={faCalendar} className="text-lg" />
        <label htmlFor="date-guide" className="font-semibold text-sm">Fecha:</label>
        <input
          type="date"
          id="date-guide"
          name="date"
          value={date}
          onChange={onDateChange}
          className="bg-white/90 text-secondary rounded-md p-2 text-sm w-full sm:w-auto focus:ring-2 focus:ring-primary-light outline-none"
        />
      </div>
    </div>
  );
}