'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse, faFlask, faSeedling, faDna, faPenToSquare, faBrain, faLungs, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// --- Sub-componente para las tarjetas de perfil ---
interface AgingProfileCardProps {
  icon: IconProp;
  title: string;
  value: number;
  onClick?: () => void;
  className?: string;
}

const AgingProfileCard: React.FC<AgingProfileCardProps> = ({ icon, title, value, onClick, className }) => (
  <button 
    onClick={onClick}
    disabled={!onClick}
    className={`flex-1 min-w-[220px] p-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 ${className} ${!onClick ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
  >
    <div className="flex items-center mb-2">
      <FontAwesomeIcon icon={icon} className="mr-4 text-3xl" />
      <h3 className="font-bold text-xl">{title}</h3>
    </div>
    <div className="flex justify-center items-baseline mt-4">
        <p className="text-5xl font-bold">{value}</p>
        <span className="text-lg font-medium ml-1">años</span>
    </div>
  </button>
);


// --- Sub-componente para la gráfica de medidor ---
interface GaugeChartProps {
    value: number;
    label: string;
    differential: number;
    color: string;
    tag: string;
    tagColor: string;
    icon: IconProp;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label, differential, color, tag, tagColor, icon }) => {
    const radius = 55;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const maxAge = 100;
    const progress = Math.min(value, maxAge) / maxAge;
    const strokeDashoffset = circumference * (1 - progress);
    const differentialSign = differential > 0 ? '+' : '';
    const differentialColor = differential >= 0 ? 'text-red-500' : 'text-green-500';

    return (
        <div className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-center w-full mb-3">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={icon} style={{ color }} />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{label}</h3>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full`} style={{ backgroundColor: tagColor }}>
                    {tag}
                </span>
            </div>
            <div className="relative w-36 h-36">
                <svg className="w-full h-full" viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-200 dark:text-gray-700" />
                    <circle cx="65" cy="65" r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(-90 65 65)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color }}>{value}</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">años</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">vs. Edad Cronológica</p>
                <p className={`text-xl font-bold ${differentialColor}`}>
                    {differentialSign}{differential} años
                </p>
            </div>
        </div>
    );
};


// --- Componente Principal ---
interface EdadBiologicaMainProps {
  cronoAge: number;
  patientId: string;
  onNavigateToTestBiofisico: () => void;
}

const EdadBiologicaMain: React.FC<EdadBiologicaMainProps> = ({ cronoAge, patientId, onNavigateToTestBiofisico }) => {
  // NOTA: Datos de ejemplo para demostración visual.
  const bioData = {
    biofisica: { age: cronoAge - 5, diff: -5 },
    bioquimica: { age: cronoAge - 2, diff: -2 },
    ortomolecular: { age: cronoAge + 4, diff: 4 },
    genetica: { age: cronoAge + 1, diff: 1 },
    celular: { age: cronoAge - 3, diff: -3 },
  };

  return (
    <div className="p-4 sm:p-8 space-y-10 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
      {/* Sección de Tarjetas Azules Superiores */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
          Edad Cronológica Vs Edad Biológica
        </h2>
        <div className="flex flex-wrap justify-center gap-5">
          <AgingProfileCard 
            icon={faHeartPulse} 
            title="Edad Biofísica" 
            value={bioData.biofisica.age} 
            onClick={onNavigateToTestBiofisico} 
            className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
          />
          <AgingProfileCard 
            icon={faFlask} 
            title="Edad Bioquímica" 
            value={bioData.bioquimica.age} 
            className="bg-gradient-to-br from-emerald-500 to-green-600 text-white"
          />
          <AgingProfileCard 
            icon={faSeedling} 
            title="Edad Ortomolecular" 
            value={bioData.ortomolecular.age} 
            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white"
          />
          <AgingProfileCard 
            icon={faDna} 
            title="Edad Genética" 
            value={bioData.genetica.age} 
            className="bg-gradient-to-br from-violet-500 to-purple-600 text-white"
          />
        </div>
      </section>
      
      {/* Sección de Perfil Multidimensional (Medidores) */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
          Perfil Multidimensional de Envejecimiento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <GaugeChart icon={faBrain} value={bioData.celular.age} label="Edad Biológica" differential={bioData.celular.diff} color="#3b82f6" tag="Celular" tagColor="#3b82f6" />
            <GaugeChart icon={faHeartPulse} value={bioData.biofisica.age} label="Edad Biofísica" differential={bioData.biofisica.diff} color="#10b981" tag="Cardio-Fitness" tagColor="#10b981" />
            <GaugeChart icon={faLeaf} value={bioData.ortomolecular.age} label="Edad Ortomolecular" differential={bioData.ortomolecular.diff} color="#f59e0b" tag="Nutrientes" tagColor="#f59e0b" />
            <GaugeChart icon={faFlask} value={bioData.bioquimica.age} label="Edad Bioquímica" differential={bioData.bioquimica.diff} color="#ef4444" tag="Metabólica" tagColor="#ef4444" />
            <GaugeChart icon={faDna} value={bioData.genetica.age} label="Edad Genética" differential={bioData.genetica.diff} color="#8b5cf6" tag="SNPs" tagColor="#8b5cf6" />
        </div>
      </section>
    </div>
  );
};

export default EdadBiologicaMain;
