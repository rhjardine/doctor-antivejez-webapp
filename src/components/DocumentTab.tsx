'use client';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatFileSize, getFileIcon } from '@/utils/helpers';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/utils/constants';
import { DocumentFile } from '@/types';

interface DocumentTabProps {
  patientId: string;
  initialDocuments?: DocumentFile[];
}

export default function DocumentTab({ patientId, initialDocuments = [] }: DocumentTabProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<DocumentFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // En una implementación real, esto subiría los archivos a una API
    setIsUploading(true);
    
    // Simulamos la subida de archivos
    setTimeout(() => {
      const newDocuments: DocumentFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        isAnalyzed: false,
        category: 'other',
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
      setIsUploading(false);
      
      // Seleccionar el primer documento para previsualización
      if (!previewDocument && newDocuments.length > 0) {
        setPreviewDocument(newDocuments[0]);
      }
    }, 1500);
  };

  const browseFiles = () => {
    fileInputRef.current?.click();
  };

  const analyzeDocument = (document: DocumentFile) => {
    // Simular análisis
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, isAnalyzed: true } 
          : doc
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Área de subida de documentos */}
      <div 
        className={`border-2 border-dashed ${dragActive ? 'border-primary dark:border-primary-light bg-primary/5 dark:bg-primary-light/5' : 'border-border dark:border-[#3A4858] bg-bg-light dark:bg-[#2E3A4A]'} rounded-lg p-8 text-center transition-all duration-200 cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={browseFiles}
      >
        <div className="text-5xl text-primary dark:text-primary-light mb-4 transition-transform duration-200 hover:translate-y-[-5px]">
          <FontAwesomeIcon icon="file-upload" />
        </div>
        <h3 className="text-lg font-medium text-text-dark dark:text-[#E0E6ED] mb-2">
          Subir Documentos Médicos
        </h3>
        <p className="text-text-medium dark:text-[#B8C4CF] mb-6">
          Arrastre y suelte archivos aquí o haga clic para buscar (PDF, Imagen, Word, Excel)
        </p>
        <button className="py-3 px-6 bg-primary dark:bg-primary-light text-white dark:text-[#13293D] border-none rounded-md font-medium cursor-pointer transition-all duration-200 inline-flex items-center gap-2 hover:bg-primary-dark dark:hover:bg-primary hover:-translate-y-0.5 hover:shadow-sm">
          <FontAwesomeIcon icon="folder-open" />
          <span>Buscar Archivos</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept={ACCEPTED_FILE_TYPES.all}
          multiple
          onChange={handleFileInput}
        />
      </div>

      {/* Previsualización del documento */}
      {previewDocument && (
        <div className="flex flex-col gap-6 bg-bg-card dark:bg-[#2E3A4A] rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-text-dark dark:text-[#E0E6ED] flex items-center gap-2">
              <FontAwesomeIcon icon={getFileIcon(previewDocument.name) as any} />
              <span>{previewDocument.name}</span>
            </h3>
            <div className="flex gap-2">
              <button className="p-2 border-none bg-bg-white dark:bg-[#242F3F] text-text-medium dark:text-[#B8C4CF] rounded-md cursor-pointer transition-all duration-200 hover:bg-primary hover:text-white hover:-translate-y-0.5">
                <FontAwesomeIcon icon="download" />
              </button>
              <button className="p-2 border-none bg-bg-white dark:bg-[#242F3F] text-text-medium dark:text-[#B8C4CF] rounded-md cursor-pointer transition-all duration-200 hover:bg-primary hover:text-white hover:-translate-y-0.5">
                <FontAwesomeIcon icon="times" />
              </button>
            </div>
          </div>
          
          <div className="bg-bg-white dark:bg-[#242F3F] rounded-md p-6 max-h-[300px] overflow-y-auto shadow-sm border border-border dark:border-[#3A4858]">
            <div className="text-center text-text-medium dark:text-[#B8C4CF] py-8">
              <FontAwesomeIcon icon={getFileIcon(previewDocument.name) as any} className="text-4xl mb-4" />
              <p className="mb-2">Vista previa no disponible</p>
              <p className="text-sm">{previewDocument.type} • {formatFileSize(previewDocument.size)}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 flex-wrap">
            <button className="py-[0.6rem] px-4 bg-bg-card dark:bg-[#242F3F] border border-border dark:border-[#3A4858] text-text-medium dark:text-[#B8C4CF] rounded-md font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 text-sm hover:bg-bg-light dark:hover:bg-[#1A2634] hover:-translate-y-0.5">
              <FontAwesomeIcon icon="arrow-right" />
              <span>Cargar más</span>
            </button>
            
            <button 
              className="py-[0.6rem] px-4 bg-primary dark:bg-primary-light text-white dark:text-[#13293D] border-none rounded-md font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 text-sm hover:bg-primary-dark dark:hover:bg-primary hover:-translate-y-0.5 hover:shadow-sm"
              onClick={() => analyzeDocument(previewDocument)}
              disabled={previewDocument.isAnalyzed}
            >
              <FontAwesomeIcon icon="brain" />
              <span>Analizar Documento</span>
            </button>
          </div>
        </div>
      )}

      {/* Lista de documentos */}
      <div className="flex flex-col gap-4">
        <h3 className="text-left text-lg font-medium text-text-dark dark:text-[#E0E6ED] mb-2">
          Documentos Analizados Previamente
        </h3>
        
        {documents.length > 0 ? (
          <div className="flex flex-col gap-4">
            {documents.map(doc => (
              <div 
                key={doc.id}
                className="bg-bg-white dark:bg-[#242F3F] rounded-md p-3 border border-border dark:border-[#3A4858] flex items-center justify-between transition-all duration-200 cursor-pointer hover:border-primary dark:hover:border-primary-light hover:translate-x-0.5 hover:shadow-sm"
                onClick={() => setPreviewDocument(doc)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FontAwesomeIcon 
                    icon={getFileIcon(doc.name) as any}
                    className="text-xl text-primary dark:text-primary-light flex-shrink-0" 
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-text-dark dark:text-[#E0E6ED] whitespace-nowrap overflow-hidden text-ellipsis">
                      {doc.name}
                    </span>
                    <span className="text-xs text-text-light dark:text-[#8D99A4]">
                      {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <span className={`text-xs py-1 px-2 rounded-sm text-white bg-${doc.category === 'genomic' ? 'success' : doc.category === 'lab' ? 'info' : doc.category === 'report' ? 'warning' : 'primary'}`}>
                    {doc.category === 'genomic' ? 'Genómico' : 
                      doc.category === 'lab' ? 'Laboratorio' : 
                      doc.category === 'report' ? 'Reporte' : 'Documento'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-text-light dark:text-[#8D99A4] mt-4">
            No hay documentos analizados.
          </p>
        )}
      </div>
    </div>
  );
}