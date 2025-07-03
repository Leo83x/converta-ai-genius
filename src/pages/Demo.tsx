
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, BarChart3, Zap, Users, Shield, ArrowLeft, Play, CheckCircle } from 'lucide-react';

const Demo = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/b5be6410-a8c5-4f8d-9eb5-a979ed0ffe83.png" 
              alt="Converta+" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-white">
              Converta+
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Demonstração do{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Converta+
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Veja na prática como funciona a plataforma de automação inteligente de leads com IA
          </p>

          <div className="bg-gray-800 rounded-lg p-8 mb-12">
            <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Play className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-white text-lg">Vídeo de Demonstração</p>
                <p className="text-gray-400">Em breve...</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg">
              Demonstração completa das funcionalidades do Converta+ em ação
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Funcionalidades{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Principais
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Conheça as principais funcionalidades que fazem do Converta+ a solução mais completa do mercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Quer Comercializar Esta Solução?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Torne-se um representante oficial do Converta+ e ganhe altas comissões vendendo a solução mais inovadora do mercado
          </p>
          
          <Button
            onClick={() => navigate('/afiliados')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
          >
            Torne-se um Representante
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/40 text-center">
        <p className="text-gray-400 text-lg">
          © 2024 Converta+ - Plataforma de Automação Inteligente com IA
        </p>
      </footer>
    </div>
  );
};

export default Demo;
