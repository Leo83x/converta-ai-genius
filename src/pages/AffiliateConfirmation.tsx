import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Sparkles, TrendingUp, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logoConverta from "@/assets/logo-converta.png";

const AffiliateConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <img 
          src={logoConverta} 
          alt="Converta+" 
          className="h-8 md:h-10 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-purple-500/20 p-4">
                <Calendar className="w-16 h-16 text-purple-400" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Agende Sua Reunião Online
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8">
              Escolha o melhor horário para conhecer o Programa de Representantes Converta+
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <p className="text-purple-100 text-lg">
                Agende sua reunião online e conheça todos os detalhes sobre comissões, 
                materiais de apoio e como começar a ganhar com o programa de representantes.
              </p>
            </div>
          </div>

          {/* Calendly Inline Widget */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/contato-convertamais/30min" 
              style={{ minWidth: '320px', height: '700px' }}
            />
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("/afiliados")}
              variant="outline"
              className="border-purple-400/50 text-purple-200 bg-purple-800/30 hover:bg-purple-700/50 hover:text-white px-8 py-6 text-lg"
            >
              Voltar para a Página Inicial
            </Button>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            O que você vai receber
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-purple-500/20 rounded-full p-3 w-fit mb-4">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Material de Apresentação
              </h3>
              <p className="text-purple-100">
                Receba apresentações prontas, vídeos explicativos e argumentos de vendas 
                para usar com seus clientes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-green-500/20 rounded-full p-3 w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Sistema de Comissões
              </h3>
              <p className="text-purple-100">
                Acompanhe suas vendas e comissões em tempo real através do seu painel 
                exclusivo de representante.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-blue-500/20 rounded-full p-3 w-fit mb-4">
                <MessageCircle className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Suporte Exclusivo
              </h3>
              <p className="text-purple-100">
                Tenha acesso direto ao nosso time de suporte para tirar dúvidas e 
                receber orientações sobre vendas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <img 
            src={logoConverta} 
            alt="Converta+" 
            className="h-8 mx-auto mb-4 opacity-70"
          />
          <p className="text-purple-300 text-sm">
            © 2025 Converta+. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AffiliateConfirmation;
