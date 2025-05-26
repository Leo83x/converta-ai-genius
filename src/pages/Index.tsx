
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after a short delay to show the landing page briefly
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 animate-pulse">
            Converta+
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Automação inteligente de leads com agentes de IA
          </p>
          <div className="space-y-4 text-lg text-blue-100">
            <p>✨ Agentes de IA personalizados</p>
            <p>📱 Integração WhatsApp, Instagram e Messenger</p>
            <p>🎯 Captação e atendimento automatizado</p>
            <p>📊 Dashboard inteligente com métricas</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
          >
            Acessar Plataforma
          </Button>
          <p className="text-sm text-blue-200">
            Redirecionando automaticamente...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
