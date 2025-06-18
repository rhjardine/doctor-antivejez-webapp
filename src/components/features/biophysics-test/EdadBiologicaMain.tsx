'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse, faFlask, faSeedling, faDna, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import type { Patient, BiophysicalTest } from '@prisma/client';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// --- Componente de Tarjeta Métrica (Sección Superior) ---
interface MetricCardProps {
  title: string;
  value: string;
  icon: IconProp;
  colorClass: string;
  onClick?: () => void;
  cta?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, colorClass, onClick, cta }) => {
  const cardContent = (
    <div className={`p-4 rounded-lg shadow-md text-white flex flex-col justify-between h-full ${colorClass} transition-transform hover:scale-105`}>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase">{title}</h3>
          <FontAwesomeIcon icon={icon} />
        </div>
        <p className="text-5xl font-bold mt-2">{value}</p>
        <p className="text-sm">{value !== "N/A" ? "años" : "Sin Datos"}</p>
      </div>
      {cta && <span className="text-xs mt-2 font-bold">{cta}</span>}
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="w-full text-left h-full">{cardContent}</button>
  ) : (
    <div className="h-full">{cardContent}</div>
  );
};

// --- Componente de Perfil (Sección Inferior) ---
interface ProfileGaugeCardProps {
  title: string;
  tag: string;
  tagColor: string;
  value: number;
  diff: number;
}

const ProfileGaugeCard: React.FC<ProfileGaugeCardProps> = ({ title, tag, tagColor, value, diff }) => {
    const diffColor = diff <= -5 ? 'text-green-500' : diff <= 0 ? 'text-blue-500' : diff <= 5 ? 'text-yellow-500' : 'text-red-500';
    const diffSign = diff > 0 ? '+' : '';

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{title}</h4>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${tagColor}`}>{tag}</span>
            </div>
            <div className="relative w-28 h-28 my-2">
                <svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-gray-200 dark:text-gray-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><path className="text-cyan-500" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" strokeDasharray={`${Math.abs(value - 20), 100}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /></svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">{value}</span>
                    <span className="block text-xs text-gray-500">años</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">vs. Cronológica</p>
            <p className={`font-bold text-base ${diffColor}`}>{diffSign}{diff} años</p>
        </div>
    );
};

// --- Componente Principal ---
type PatientWithTests = Patient & {
  biophysical_tests?: BiophysicalTest[];
};

interface EdadBiologicaMainProps {
  patient: PatientWithTests;
  onNavigateToTestBiofisico: () => void;
}

const EdadBiologicaMain: React.FC<EdadBiologicaMainProps> = ({ patient, onNavigateToTestBiofisico }) => {
  const cronoAge = patient.chronological_age || 0;
  
  // Lógica para obtener el último test de cada tipo (aquí solo tenemos biofísico)
  const latestBiophysicalTest = (patient.biophysical_tests && patient.biophysical_tests.length > 0) ? patient.biophysical_tests[0] : null;

  // Extraemos los valores para las tarjetas. Si no hay test, mostramos "N/A" o un valor por defecto.
  const biofisicaAge = latestBiophysicalTest?.biological_age;
  const bioquimicaAge = 53; // Placeholder
  const ortomolecularAge = 50; // Placeholder
  const geneticaAge = 58; // Placeholder

  const profileData = {
    biologicaCelular: { value: 45, diff: 45 - cronoAge },
    biofisicaFitness: { value: biofisicaAge ? Math.round(biofisicaAge) : 0, diff: biofisicaAge ? Math.round(biofisicaAge) - cronoAge : 0 },
    ortomolecularNutrientes: { value: 52, diff: 52 - cronoAge },
    bioquimicaMetabolica: { value: 46, diff: 46 - cronoAge },
    geneticaSNPs: { value: 49, diff: 49 - cronoAge },
  };

  return (
    <div className="space-y-10 p-2 md:p-4">
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Edad Cronológica Vs Edad Biológica (Paciente Real: {cronoAge} años)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard 
            title="EDAD BIOFÍSICA" 
            value={biofisicaAge ? Math.round(biofisicaAge).toString() : "N/A"} 
            icon={faHeartPulse} 
            colorClass="bg-cyan-500" 
            onClick={onNavigateToTestBiofisico}
            cta="Realizar Test →"
          />
          <MetricCard title="EDAD BIOQUÍMICA" value={bioquimicaAge.toString()} icon={faFlask} colorClass="bg-cyan-500" />
          <MetricCard title="EDAD ORTOMOLECULAR" value={ortomolecularAge.toString()} icon={faSeedling} colorClass="bg-cyan-500" />
          <MetricCard title="EDAD GENÓMICA" value={geneticaAge.toString()} icon={faDna} colorClass="bg-cyan-500" />
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Perfil Multidimensional de Envejecimiento
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            <ProfileGaugeCard title="Edad Biológica" tag="Celular" tagColor="bg-blue-500" value={profileData.biologicaCelular.value} diff={profileData.biologicaCelular.diff} />
            <ProfileGaugeCard title="Edad Biofísica" tag="Cardio-Fitness" tagColor="bg-green-500" value={profileData.biofisicaFitness.value} diff={profileData.biofisicaFitness.diff} />
            <ProfileGaugeCard title="Edad Ortomolecular" tag="Nutrientes" tagColor="bg-yellow-500" value={profileData.ortomolecularNutrientes.value} diff={profileData.ortomolecularNutrientes.diff} />
            <ProfileGaugeCard title="Edad Bioquímica" tag="Metabólica" tagColor="bg-red-500" value={profileData.bioquimicaMetabolica.value} diff={profileData.bioquimicaMetabolica.diff} />
            <ProfileGaugeCard title="Edad Genética" tag="SNPs" tagColor="bg-purple-500" value={profileData.geneticaSNPs.value} diff={profileData.geneticaSNPs.diff} />
        </div>
      </section>
    </div>
  );
};

export default EdadBiologicaMain;