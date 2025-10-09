import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoConverta from "@/assets/logo-converta.png";

const AffiliateConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
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
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <CheckCircle2 className="w-16 h-16 text-green-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Cadastro Realizado com Sucesso!
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-8">
            Bem-vindo ao Programa de Representantes Converta+
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <div className="flex items-start gap-4 mb-6">
              <MessageCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  Próximo Passo: Confira seu WhatsApp
                </h3>
                <p className="text-purple-100">
                  Em instantes você receberá a apresentação completa do programa de representantes 
                  diretamente no seu WhatsApp, com todos os detalhes sobre comissões, materiais 
                  de apoio e como começar a ganhar.
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-100 text-sm">
                <strong>Importante:</strong> Verifique também sua pasta de spam/lixo eletrônico 
                caso não receba a mensagem em alguns minutos.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/afiliados")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Voltar para a Página Inicial
          </Button>
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
