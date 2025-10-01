import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Apresentacao = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Entrar
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Seu Funcionário de IA que
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Atende e Vende no WhatsApp
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Automatize seu atendimento com IA avançada que conversa naturalmente, 
              qualifica leads e aumenta suas vendas 24/7
            </p>

            <div className="flex flex-col items-center gap-6 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/demo')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
              >
                Experimente Grátis por 7 Dias
              </Button>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Se adapta ao seu negócio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Atende e vende 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Conversas humanizadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(59, 130, 246, 0.8)'
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
          
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => window.location.href = 'https://convertamais.online/app/auth'}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-12 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
            >
              Experimente Grátis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apresentacao;
