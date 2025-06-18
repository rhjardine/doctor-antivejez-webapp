// src/app/historias/components/ConnectionStatus.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/boards?form=1');
        if (response.ok) {
          setIsConnected(true);
          // Verificar si estamos usando datos mock
          const data = await response.json();
          setUsingMockData(data.length > 0 && data[0].id === 1); // Mock data tiene ID específicos
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        setIsConnected(false);
        setUsingMockData(true);
      }
    };

    checkConnection();
  }, []);

  if (isConnected === null) return null;

  return (
    <div className={`p-2 text-xs rounded-md ${
      usingMockData 
        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
        : 'bg-green-100 text-green-800 border border-green-300'
    }`}>
      {usingMockData 
        ? '⚠️ Usando datos de desarrollo (Mock Data)' 
        : '✅ Conectado al sistema de producción'
      }
    </div>
  );
}