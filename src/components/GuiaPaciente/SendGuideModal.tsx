// src/components/GuiaPaciente/SendGuideModal.tsx
'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faBattleNet } from '@fortawesome/free-brands-svg-icons'; // faBattleNet es un placeholder, usa el icono correcto para tu app Flutter

interface SendGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendWhatsapp: () => void;
  onSendEmail: () => void;
  onSendToApp: () => void; // Para la app Flutter
}

export default function SendGuideModal({
  isOpen,
  onClose,
  onSendWhatsapp,
  onSendEmail,
  onSendToApp,
}: SendGuideModalProps) {
  if (!isOpen) return null;

  const buttonBaseStyles = "w-full px-4 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 text-sm sm:text-base";

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
      onClick={onClose} // Cierra al hacer clic en el overlay
    >
      <div
        className="bg-bg-card-light dark:bg-bg-card-dark p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm text-center relative"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 text-text-light-muted hover:text-danger dark:text-text-dark-muted dark:hover:text-danger rounded-full"
          aria-label="Cerrar modal"
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        <FontAwesomeIcon icon={faPaperPlane} className="text-3xl sm:text-4xl text-primary mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-text-light-base dark:text-text-dark-base mb-5">
          Enviar Guía al Paciente
        </h3>
        
        <div className="space-y-3">
          <button 
            onClick={onSendWhatsapp}
            className={`${buttonBaseStyles} bg-[#25D366] hover:bg-[#1DAF53]`} // Color WhatsApp
          >
            <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" /> WhatsApp
          </button>
          <button 
            onClick={onSendEmail}
            className={`${buttonBaseStyles} bg-primary hover:bg-primary-darker`}
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" /> Email {/* Necesitarás importar faEnvelope */}
          </button>
          <button 
            onClick={onSendToApp}
            className={`${buttonBaseStyles} bg-secondary hover:bg-secondary-light`}
          >
            <FontAwesomeIcon icon={faMobileAlt} className="w-5 h-5" /> App Paciente {/* Necesitarás importar faMobileAlt */}
          </button>
        </div>
      </div>
    </div>
  );
}

// Nota: Necesitarás importar faEnvelope y faMobileAlt de @fortawesome/free-solid-svg-icons
// en la parte superior de este archivo, o donde uses este modal.
// Ejemplo: import { faTimes, faPaperPlane, faEnvelope, faMobileAlt } from '@fortawesome/free-solid-svg-icons';