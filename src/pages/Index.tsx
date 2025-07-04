
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, BarChart3, Zap, Users, Shield, ArrowRight, CheckCircle, Play, DollarSign } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-purple-400" />,
      title: "Agentes de IA Personalizados",
      description: "Crie agentes inteligentes especializados no seu negócio para atendimento automatizado"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-400" />,
      title: "Multi-Canal",
      description: "WhatsApp, Instagram, Messenger e Widget - tudo integrado em uma plataforma"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-400" />,
      title: "Dashboard Inteligente",
      description: "Métricas avançadas e insights para otimizar sua conversão de leads"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Automação Completa",
      description: "Captação, qualificação e atendimento 24/7 sem intervenção manual"
    },
    {
      icon: <Users className="h-8 w-8 text-red-400" />,
      title: "CRM Integrado",
      description: "Gerencie todos os seus leads em um funil de vendas organizado"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-400" />,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 w-full overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-6 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ce25a7c1-b528-4a12-802a-3ccc77677d04.png" 
              alt="Converta+" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-white">
              Converta+
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              onClick={() => navigate('/demo')}
              variant="outline"
              size="sm"
              className="border-purple-400/50 text-purple-200 bg-purple-800/30 hover:bg-purple-700/50 hover:text-white text-xs sm:text-sm px-3 py-2"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Ver Demo
            </Button>
            <Button
              onClick={() => window.open('https://live.convertamais.online/afiliados', '_blank')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs sm:text-sm px-3 py-2"
            >
              Torne-se um Representante
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Automação Inteligente de
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Leads com IA
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transforme visitantes em clientes com agentes de inteligência artificial que trabalham 24/7 
            para captar, qualificar e converter seus leads automaticamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg text-white"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
            <Button
              size="lg"
              onClick={() => window.open('https://live.convertamais.online/afiliados', '_blank')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-8 py-4 text-lg text-white"
            >
              Torne-se um Representante
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-100 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Por que escolher o{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Converta+?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Resultados comprovados que transformam negócios
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Funcionalidades{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Poderosas
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tudo que você precisa para automatizar e escalar seu processo de geração de leads
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-slate-100 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Planos de{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Assinatura
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Valores que serão comercializados após o lançamento oficial
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Plano Mensal</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-purple-600">R$ 129</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Todas as funcionalidades
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Suporte prioritário
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Atualizações gratuitas
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                  MAIS POPULAR
                </span>
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold mb-2">Plano Anual</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">R$ 1.297</span>
                  <span className="text-purple-200">/ano</span>
                </div>
                <p className="text-purple-200 text-sm">Economize R$ 251 por ano</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Todas as funcionalidades
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Suporte prioritário
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Atualizações gratuitas
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    2 meses grátis
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Pronto para Revolucionar suas Vendas?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Conheça o sistema na prática ou torne-se um representante oficial e comece a faturar
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg text-white font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
            <Button
              size="lg"
              onClick={() => window.open('https://live.convertamais.online/afiliados', '_blank')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-8 py-4 text-lg text-white font-semibold"
            >
              Torne-se um Representante
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/40 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/ce25a7c1-b528-4a12-802a-3ccc77677d04.png" 
                alt="Converta+" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-white">Converta+</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 Converta+. Todos os direitos reservados.</p>
              <p className="mt-1">Automação inteligente de leads com IA</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
