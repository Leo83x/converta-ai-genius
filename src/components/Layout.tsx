
import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import GeniusAgent from './GeniusAgent';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [isDark, setIsDark] = useState(true);
  const [isGeniusOpen, setIsGeniusOpen] = useState(false);

  // Iniciar sempre no modo escuro
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header com botão de tema */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>
        
        <main className={`flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 ${isMobile ? 'pt-4' : ''}`}>
          {children}
        </main>

        {/* Botão flutuante Genius AI */}
        <Button
          onClick={() => setIsGeniusOpen(true)}
          className="fixed bottom-6 right-6 h-14 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full flex items-center gap-2 z-50"
        >
          <span className="text-xl">✨</span>
          <span className="font-medium">Genius AI</span>
        </Button>

        <GeniusAgent
          isOpen={isGeniusOpen}
          onClose={() => setIsGeniusOpen(false)}
        />
      </div>
    </div>
  );
};

export default Layout;
