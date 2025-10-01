import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Apresentacao = () => {
  const handleExperimenteClick = () => {
    window.location.href = 'https://convertamais.online/app/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 w-full overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-6 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/logo-c-v2.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Hero Section with Video */}
      <section className="pt-16 pb-24 px-4 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Para de perder clientes com seu atendimento atual
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Crie seu próprio Atendente de IA, em segundos na Converta+, sem precisar programar.
          </p>
          
          {/* Video Container */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)',
              border: '3px solid rgba(59, 130, 246, 0.9)'
            }}>
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/WaYx2aP4B5I"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleExperimenteClick}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg text-white mb-8"
          >
            Experimente Grátis
          </Button>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Se adapta ao seu negócio</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Atende e vende 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Conversas humanizadas</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apresentacao;
