// src/components/Layout/Header.tsx - Con input de búsqueda blanco
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
// import { useAppState } from '@/contexts/AppStateProvider';

export default function Header() {
  // const { toggleSidebar } = useAppState();

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-40 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          {/* Lado Izquierdo */}
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">
              {/* Título de página dinámico */}
            </span>
          </div>

          {/* Centro: Barra de Búsqueda - MODIFICADA */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:mr-6">
            <div className="max-w-lg w-full lg:max-w-md">
              <label htmlFor="search-header" className="sr-only">Buscar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="h-5 w-5 text-gray-400" 
                    aria-hidden="true" 
                  />
                </div>
                <input
                  id="search-header"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 
                         rounded-full bg-white text-gray-800 
                         placeholder-gray-500 
                         focus:outline-none focus:ring-2 
                         focus:ring-primary focus:border-primary 
                         sm:text-sm shadow-sm transition-colors"
                  placeholder="Buscar paciente o historia..."
                  type="search"
                  name="search"
                />
              </div>
            </div>
          </div>

          {/* Lado Derecho: Notificaciones y Perfil */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="p-2 rounded-full text-white hover:text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white focus:ring-offset-primary"
              title="Notificaciones"
            >
              <span className="sr-only">Ver notificaciones</span>
              <FontAwesomeIcon icon={faBell} className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white focus:ring-offset-primary"
              title="Menú de Usuario"
            >
              <span className="sr-only">Abrir menú de usuario</span>
              <FontAwesomeIcon icon={faUserCircle} className="h-7 w-7 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}