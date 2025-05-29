// src/app/historias/components/EdadBiologicaMain.tsx
'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faProcedures, faVial, faAtom, faDna, faFilePdf,
  faChartLine, faChartBar, faChartPie, faDotCircle
} from '@fortawesome/free-solid-svg-icons';

interface EdadBiologicaMainProps {
  cronoAge: number;
  patientId: string;
  onNavigateToTestBiofisico: () => void;
}

export default function EdadBiologicaMain({ 
  cronoAge, 
  patientId, 
  onNavigateToTestBiofisico 
}: EdadBiologicaMainProps) {
  
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Sección: Edad Cronológica Vs Edad Biológica */}
      <section aria-labelledby="bio-age-comparison-title" className="mb-8">
        <h2 id="bio-age-comparison-title" className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Edad Cronológica Vs Edad Biológica (Paciente Real: {cronoAge} años)
        </h2>
        
        {/* Grid con ajustes responsivos mejorados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Tarjeta Edad Biofísica */}
          <div className="w-full">
            <button
              onClick={onNavigateToTestBiofisico}
              className="w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md hover:bg-[#23BCEF]/90 focus:outline-none focus:ring-2 focus:ring-[#23BCEF] focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:-translate-y-1 flex flex-col items-center justify-center text-center h-full"
              title="Realizar o ver Test Edad Biofísica"
            >
              <FontAwesomeIcon icon={faProcedures} className="text-3xl mb-2 opacity-80" />
              <h3 className="text-sm font-medium uppercase tracking-wider mb-1">EDAD BIOFÍSICA</h3>
              <p className="text-4xl font-bold">55 <span className="text-lg font-normal">años</span></p>
            </button>
          </div>
          
          {/* Tarjeta Edad Bioquímica */}
          <div className="w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <FontAwesomeIcon icon={faVial} className="text-3xl mb-2 opacity-80" />
            <h3 className="text-sm font-medium uppercase tracking-wider mb-1">EDAD BIOQUÍMICA</h3>
            <p className="text-4xl font-bold">53 <span className="text-lg font-normal">años</span></p>
          </div>
          
          {/* Tarjeta Edad Ortomolecular */}
          <div className="w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <FontAwesomeIcon icon={faAtom} className="text-3xl mb-2 opacity-80" />
            <h3 className="text-sm font-medium uppercase tracking-wider mb-1">EDAD ORTOMOLECULAR</h3>
            <p className="text-4xl font-bold">50 <span className="text-lg font-normal">años</span></p>
          </div>
          
          {/* Tarjeta Edad Genética */}
          <div className="w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <FontAwesomeIcon icon={faDna} className="text-3xl mb-2 opacity-80" />
            <h3 className="text-sm font-medium uppercase tracking-wider mb-1">EDAD GENÉTICA</h3>
            <p className="text-4xl font-bold">58 <span className="text-lg font-normal">años</span></p>
          </div>
        </div>
      </section>
      
      {/* Sección: Perfil Multidimensional de Envejecimiento */}
      <section aria-labelledby="aging-profile-title" className="mb-8">
        <h2 id="aging-profile-title" className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Perfil Multidimensional de Envejecimiento
        </h2>
        
        {/* Grid adaptable con scroll horizontal en versiones pequeñas */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="grid grid-cols-5 gap-4 min-w-max md:min-w-0 md:grid-cols-3 lg:grid-cols-5">
            {/* Perfil Celular */}
            <div className="w-[220px] md:w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Celular
                </span>
                
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="62.8" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">45</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-center">Edad Biológica</h3>
                
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-100">vs. Edad Cronológica (58)</span>
                  <p className="text-lg font-semibold text-green-300">- 13 años</p>
                </div>
              </div>
            </div>
            
            {/* Perfil Cardio-Fitness */}
            <div className="w-[220px] md:w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Cardio-Fitness
                </span>
                
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="100.48" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">43</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-center">Edad Biofísica</h3>
                
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-100">vs. Edad Cronológica (58)</span>
                  <p className="text-lg font-semibold text-green-300">- 15 años</p>
                </div>
              </div>
            </div>
            
            {/* Perfil Nutrientes */}
            <div className="w-[220px] md:w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Nutrientes
                </span>
                
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="75.36" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">52</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-center">Edad Ortomolecular</h3>
                
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-100">vs. Edad Cronológica (58)</span>
                  <p className="text-lg font-semibold text-green-300">- 6 años</p>
                </div>
              </div>
            </div>
            
            {/* Perfil Metabólica */}
            <div className="w-[220px] md:w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Metabólica
                </span>
                
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="125.6" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">46</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-center">Edad Bioquímica</h3>
                
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-100">vs. Edad Cronológica (58)</span>
                  <p className="text-lg font-semibold text-green-300">- 12 años</p>
                </div>
              </div>
            </div>
            
            {/* Perfil SNPs */}
            <div className="w-[220px] md:w-full bg-[#23BCEF] text-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  SNPs
                </span>
                
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="100.48" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">49</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-center">Edad Genética</h3>
                
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-100">vs. Edad Cronológica (58)</span>
                  <p className="text-lg font-semibold text-green-300">- 9 años</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Botón para generar informe */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => alert('Generando informe (simulación)...')}
          className="px-6 py-2.5 text-sm bg-[#23BCEF] text-white font-semibold rounded-lg hover:bg-[#23BCEF]/90 focus:outline-none focus:ring-2 focus:ring-[#23BCEF] focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Generar Informe PDF
        </button>
      </div>
    </div>
  );
}