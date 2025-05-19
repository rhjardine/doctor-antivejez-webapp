'use client';

import { useState, useEffect } from 'react';
import PatientInfo from './components/PatientInfo';
import RemovalPhase from './components/RemovalPhase';
import PrimaryNutraceuticals from './components/PrimaryNutraceuticals';
import MetabolicActivator from './components/MetabolicActivator';
import SecondaryNutraceuticals from './components/SecondaryNutraceuticals';
import ComplementaryNutraceuticals from './components/ComplementaryNutraceuticals';
import SerumShots from './components/SerumShots';
import PreviewSection from './components/PreviewSection';
import SendModal from './components/SendModal';
import './styles/guia-paciente.css';

export default function GuiaPacientePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handlePreview = () => {
    setPreviewVisible(true);
    setTimeout(() => {
      document.getElementById('patient-preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <form id="patient-form" onSubmit={handleSubmit}>
        <PatientInfo 
          patientName={formData.patient_name} 
          date={formData.date} 
          onPatientNameChange={handleInputChange}
          onDateChange={handleInputChange}
        />

        <RemovalPhase 
          formData={formData} 
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />

        <PrimaryNutraceuticals 
          formData={formData} 
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />

        <MetabolicActivator 
          formData={formData} 
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />

        <SecondaryNutraceuticals 
          formData={formData} 
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />

        <ComplementaryNutraceuticals 
          formData={formData} 
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />

        <SerumShots 
          formData={formData} 
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />

        {previewVisible && (
          <PreviewSection formData={formData} />
        )}

        <div className="action-buttons">
          <button 
            type="button" 
            className="btn btn-success" 
            onClick={handlePreview}
          >
            <i className="fas fa-eye"></i> Vista Previa
          </button>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-paper-plane"></i> Guardar y Enviar
          </button>
        </div>
      </form>

      <SendModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        patientName={formData.patient_name}
        date={formData.date}
      />
    </div>
  );
}