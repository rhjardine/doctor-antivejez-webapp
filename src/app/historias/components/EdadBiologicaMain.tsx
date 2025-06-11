// src/app/historias/components/EdadBiologicaMain.tsx
'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse, faFlask, faSeedling, faDna } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// --- Card Componente para la sección superior ---
interface MetricCardProps {
  title: string;
  value: number;
  icon: IconProp;
  colorClass: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, colorClass, onClick }) => {
  const cardContent = (
    <div className={`p-4 rounded-lg shadow-md text-white ${colorClass} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <FontAwesomeIcon icon={icon} />
      </div>
      <p className="text-4xl font-bold mt-2">{value}</p>
      <p className="text-sm">años</p>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="w-full text-left">{cardContent}</button>
  ) : (
    cardContent
  );
};


// --- Card Componente para el Perfil Multidimensional ---
interface ProfileGaugeCardProps {
  title: string;
  tag: string;
  tagColor: string;
  value: number;
  diff: number;
}

const ProfileGaugeCard: React.FC<ProfileGaugeCardProps> = ({ title, tag, tagColor, value, diff }) => {
    const diffColor = diff <= 0 ? 'text-green-500' : 'text-red-500';
    const diffSign = diff > 0 ? '+' : '';

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
            <div className="w-full flex justify-between items-start">
                <h4 className="font-bold text-gray-700 dark:text-gray-200">{title}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${tagColor}`}>{tag}</span>
            </div>
            <div className="relative w-32 h-32 my-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="text-[#23BCEF]"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        strokeDasharray={`${value}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">{value}</span>
                    <span className="block text-sm text-gray-500">años</span>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">vs. Edad Cronológica</p>
            <p className={`font-bold text-lg ${diffColor}`}>{diffSign}{diff} años</p>
        </div>
    );
};


interface EdadBiologicaMainProps {
  cronoAge: number;
  patientId: string;
  onNavigateToTestBiofisico: () => void;
}

const EdadBiologicaMain: React.FC<EdadBiologicaMainProps> = ({ onNavigateToTestBiofisico }) => {
  // Datos de ejemplo, deberías obtenerlos desde el estado del paciente
  const biofisicaAge = 54;
  const bioquimicaAge = 54;
  const ortomolecularAge = 49;
  const geneticaAge = 59;
  
  const profileData = {
    biologicaCelular: { value: 45, diff: -3 },
    biofisicaFitness: { value: 43, diff: -5 },
    ortomolecularNutrientes: { value: 52, diff: 4 },
    bioquimicaMetabolica: { value: 46, diff: -2 },
    geneticaSNPs: { value: 49, diff: 1 },
  };


  return (
    <div className="space-y-12 p-4">
      {/* SECCIÓN 1: EDAD CRONOLÓGICA VS BIOLÓGICA */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Edad Cronológica Vs Edad Biológica
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Edad Biofísica" value={biofisicaAge} icon={faHeartPulse} colorClass="bg-[#23BCEF]" onClick={onNavigateToTestBiofisico} />
          <MetricCard title="Edad Bioquímica" value={bioquimicaAge} icon={faFlask} colorClass="bg-[#23BCEF]" />
          <MetricCard title="Edad Ortomolecular" value={ortomolecularAge} icon={faSeedling} colorClass="bg-[#23BCEF]" />
          <MetricCard title="Edad Genética" value={geneticaAge} icon={faDna} colorClass="bg-[#23BCEF]" />
        </div>
      </div>
      
      {/* SECCIÓN 2: PERFIL MULTIDIMENSIONAL */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Perfil Multidimensional de Envejecimiento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ProfileGaugeCard title="Edad Biológica" tag="Celular" tagColor="bg-blue-500" value={profileData.biologicaCelular.value} diff={profileData.biologicaCelular.diff} />
            <ProfileGaugeCard title="Edad Biofísica" tag="Cardio-Fitness" tagColor="bg-green-500" value={profileData.biofisicaFitness.value} diff={profileData.biofisicaFitness.diff} />
            <ProfileGaugeCard title="Edad Ortomolecular" tag="Nutrientes" tagColor="bg-yellow-500" value={profileData.ortomolecularNutrientes.value} diff={profileData.ortomolecularNutrientes.diff} />
            <ProfileGaugeCard title="Edad Bioquímica" tag="Metabólica" tagColor="bg-red-500" value={profileData.bioquimicaMetabolica.value} diff={profileData.bioquimicaMetabolica.diff} />
            <ProfileGaugeCard title="Edad Genética" tag="SNPs" tagColor="bg-purple-500" value={profileData.geneticaSNPs.value} diff={profileData.geneticaSNPs.diff} />
        </div>
      </div>
    </div>
  );
};

export default EdadBiologicaMain;
