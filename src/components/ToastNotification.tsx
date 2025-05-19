'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@/utils/helpers';
import { Toast as ToastType } from '@/types';

interface ToastNotificationProps {
  toast: ToastType;
  onClose: (id: string) => void;
  autoClose?: boolean;
  duration?: number;
}

export default function ToastNotification({ 
  toast, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Auto-cierre después de la duración especificada
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300); // Esperar a que termine la animación
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [toast.id, autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  const iconMap = {
    success: 'check-circle',
    warning: 'exclamation-triangle',
    error: 'times-circle',
    info: 'info-circle',
  };

  return (
    <div 
      className={cn(
        `py-3 px-4 bg-bg-white dark:bg-[#2E3A4A] rounded-md shadow-lg flex items-center gap-3 transform transition-transform duration-300 max-w-[350px] border-l-4 border-l-${toast.type === 'success' ? 'success' : toast.type === 'warning' ? 'warning' : toast.type === 'error' ? 'danger' : 'info'}`,
        isVisible ? 'translate-x-0' : 'translate-x-[120%]'
      )}
    >
      <div className={`text-xl flex-shrink-0 text-${toast.type === 'success' ? 'success' : toast.type === 'warning' ? 'warning' : toast.type === 'error' ? 'danger' : 'info'}`}>
        <FontAwesomeIcon icon={iconMap[toast.type]} />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="font-semibold text-text-dark dark:text-[#E0E6ED] text-sm mb-1">
          {toast.title}
        </div>
        <div className="text-text-medium dark:text-[#B8C4CF] text-xs">
          {toast.message}
        </div>
      </div>
      
      <button 
        className="bg-transparent border-none text-base text-text-light dark:text-[#8D99A4] cursor-pointer transition-all duration-200 p-1 flex-shrink-0 hover:text-danger dark:hover:text-danger hover:scale-110"
        onClick={handleClose}
      >
        <FontAwesomeIcon icon="times" />
      </button>
    </div>
  );
}