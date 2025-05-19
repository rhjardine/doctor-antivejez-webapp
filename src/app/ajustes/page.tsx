import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import ThemeToggle from '@/components/ThemeToggle';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar 
        user={{
          name: "Dr. María García",
          role: "Longevity Specialist"
        }}
      />
      
      <MainContent>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <i className="fas fa-cog text-primary"></i>
          Ajustes
        </h1>
        
        <div className="bg-bg-white dark:bg-[#242F3F] p-6 rounded-lg shadow-sm">
          <p className="text-text-medium dark:text-[#B8C4CF]">
            Esta página permitiría ajustar configuraciones del sistema y preferencias personales.
            (Funcionalidad en desarrollo)
          </p>
        </div>
      </MainContent>
      
      <ThemeToggle />
    </div>
  );
}