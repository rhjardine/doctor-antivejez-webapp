'use client';

import { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@/utils/helpers';
import { ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ChatAssistantProps {
  patientId: string;
  initialMessages?: ChatMessage[];
}

export default function ChatAssistant({ patientId, initialMessages = [] }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll al final cuando se añaden mensajes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Añade el mensaje del usuario
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // En una implementación real, esto sería una llamada a la API
      // const response = await chatAPI.sendMessage(input, patientId);
      
      // Simulamos una respuesta del asistente
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: uuidv4(),
          content: `He procesado tu consulta sobre "${input.substring(0, 30)}...". Aquí tienes una respuesta simulada. Necesitaría más contexto o acceso a datos reales para dar una respuesta detallada.`,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      console.error("Error sending message:", error);
      // En una app real, mostrar un toast de error
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Aquí se procesarían los archivos adjuntos
    console.log("Files attached:", files);
    
    // En una app real, subiríamos el archivo y añadiríamos un mensaje con el adjunto
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 pr-2 min-h-[300px]"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "mb-5 flex flex-col animate-messageSlide",
              message.sender === 'ai' ? 'items-start' : 'items-end'
            )}
          >
            <div 
              className={cn(
                "max-w-[80%] py-3 px-4 rounded-lg relative shadow-sm transition-all duration-200 leading-relaxed",
                message.sender === 'ai' 
                  ? "bg-bg-card dark:bg-[#2E3A4A] rounded-bl-none" 
                  : "bg-primary dark:bg-primary-dark text-white dark:text-[#E0E6ED] rounded-br-none"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-1 px-4 py-2 bg-bg-card dark:bg-[#2E3A4A] rounded-lg w-fit mb-4">
            <div className="w-2 h-2 rounded-full bg-text-light dark:bg-[#8D99A4] animate-typingAnimation delay-[-0.32s]"></div>
            <div className="w-2 h-2 rounded-full bg-text-light dark:bg-[#8D99A4] animate-typingAnimation delay-[-0.16s]"></div>
            <div className="w-2 h-2 rounded-full bg-text-light dark:bg-[#8D99A4] animate-typingAnimation"></div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-border dark:border-[#3A4858] relative items-end">
        <TextareaAutosize
          className="flex-1 py-3 pl-4 pr-14 border border-border dark:border-[#3A4858] rounded-md text-base text-text-dark dark:text-[#E0E6ED] bg-bg-white dark:bg-[#242F3F] transition-all duration-200 resize-none focus:outline-none focus:border-primary dark:focus:border-primary-light focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-light/20 min-h-[45px] max-h-[200px]"
          placeholder="Haga una pregunta detallada sobre la salud de Isabel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          maxRows={6}
        />
        
        <div className="absolute right-[4.5rem] bottom-[0.6rem] flex gap-1">
          <button 
            className="bg-transparent border-none text-lg text-text-medium dark:text-[#B8C4CF] cursor-pointer transition-all duration-200 p-1 hover:text-primary dark:hover:text-primary-light hover:scale-110 w-7 h-7 flex items-center justify-center"
            title="Entrada de voz"
          >
            <FontAwesomeIcon icon="microphone" />
          </button>
          
          <button 
            className="bg-transparent border-none text-lg text-text-medium dark:text-[#B8C4CF] cursor-pointer transition-all duration-200 p-1 hover:text-primary dark:hover:text-primary-light hover:scale-110 w-7 h-7 flex items-center justify-center"
            title="Adjuntar documento"
            onClick={handleFileAttach}
          >
            <FontAwesomeIcon icon="paperclip" />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".pdf,image/*,.docx,.xlsx"
            multiple
            onChange={handleFileChange}
          />
        </div>
        
        <button 
          className="py-[0.6rem] px-4 bg-primary dark:bg-primary-light text-white dark:text-[#13293D] border-none rounded-md font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 h-[45px] hover:bg-primary-dark dark:hover:bg-primary hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          <FontAwesomeIcon icon="paper-plane" />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  );
}