
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, BarChart3, Zap, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-blue-600" />,
      title: "Agentes de IA Personalizados",
      description: "Crie agentes inteligentes especializados no seu negócio para atendimento automatizado"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-600" />,
      title: "Multi-Canal",
      description: "WhatsApp, Instagram, Messenger e Widget - tudo integrado em uma plataforma"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Dashboard Inteligente",
      description: "Métricas avançadas e insights para otimizar sua conversão de leads"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Automação Completa",
      description: "Captação, qualificação e atendimento 24/7 sem intervenção manual"
    },
    {
      icon: <Users className="h-8 w-8 text-red-600" />,
      title: "CRM Integrado",
      description: "Gerencie todos os seus leads em um funil de vendas organizado"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Segurança Avançada",
      description: "Dados protegidos com criptografia e políticas de segurança rigorosas"
    }
  ];

  const benefits = [
    "Aumente suas vendas em até 300%",
    "Reduza custos operacionais em 70%",
    "Atendimento 24/7 sem pausas",
    "Qualificação automática de leads",
    "Integração com suas ferramentas existentes",
    "Suporte técnico especializado"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b5be6410-a8c5-4f8d-9eb5-a979ed0ffe83.png" 
                alt="Converta+" 
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Converta+
              </span>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Automação Inteligente de
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Leads com IA
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforme visitantes em clientes com agentes de inteligência artificial que trabalham 24/7 
            para captar, qualificar e converter seus leads automaticamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-4 text-lg"
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/afiliados')}
              className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Programa de Afiliados
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o Converta+?
            </h2>
            <p className="text-lg text-gray-600">
              Resultados comprovados que transformam negócios
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Poderosas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para automatizar e escalar seu processo de geração de leads
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Revolucionar suas Vendas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de empresas que já transformaram seus resultados com o Converta+
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Criar Conta Gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/b5be6410-a8c5-4f8d-9eb5-a979ed0ffe83.png" 
                alt="Converta+" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">Converta+</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 Converta+. Todos os direitos reservados.</p>
              <p className="mt-1">Automação inteligente de leads com IA</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
