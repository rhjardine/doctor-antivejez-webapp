// src/components/UI/Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    // Opcional: para ajustar el tamaño máximo
    maxWidthClass?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidthClass = 'max-w-2xl' // Tamaño por defecto (ej. mediano)
}) => {
    if (!isOpen) return null;

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose} // Cierra al hacer clic fuera
        >
            {/* Contenedor del Modal */}
            {/* Aplicar maxWidthClass aquí */}
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col overflow-hidden z-50 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear`}
                onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre el modal
                style={{ animationFillMode: 'forwards' }} // Mantiene el estado final de la animación
            >
                {/* Encabezado */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title || ' '}</h3> {/* Añadir espacio si no hay título */}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        {/* Icono X */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Contenido (con scroll si es necesario) */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                    {children}
                </div>
            </div>
            {/* Definir animación en CSS global o con Tailwind */}
            <style jsx global>{`
                @keyframes modal-appear {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-modal-appear {
                    animation: modal-appear 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;