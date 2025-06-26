
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, DollarSign, Clock, Users, Zap, ArrowRight, Phone, Mail, User, Target, TrendingUp, Gift, Shield, Sparkles, Bot, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const AffiliateLanding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 30,
    seconds: 0
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsSubmitted(true);
    toast.success('Cadastro recebido com sucesso! Em breve você receberá o link da live no seu WhatsApp e e-mail.');
    
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', whatsapp: '' });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const CTAButton = ({ className = "", size = "default" }: { className?: string, size?: "default" | "lg" }) => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button 
          size={size}
          className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 ${className}`}
        >
          Quero Ser Afiliado
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-md bg-gray-900 border-purple-500/30"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Garanta Sua Vaga na Live!
          </DialogTitle>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Cadastro Confirmado!</h3>
            <p className="text-gray-300">
              Em breve você receberá o link da live no seu WhatsApp e e-mail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="modal-name" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo
              </Label>
              <Input
                id="modal-name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="modal-email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </Label>
              <Input
                id="modal-email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="modal-whatsapp" className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4" />
                WhatsApp
              </Label>
              <Input
                id="modal-whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg"
            >
              Confirmar Cadastro
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ganhe Comissões
            </span>
            <br />
            e Use o Converta+ por{' '}
            <span className="text-green-400">1 Ano Grátis</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Torne-se afiliado oficial do <strong className="text-white">Converta+</strong> e 
            fature vendendo a plataforma de IA mais inteligente do Brasil
          </p>
          
          <div className="mb-12">
            <CTAButton size="lg" className="text-xl px-12 py-4" />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Comissões significativas</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Sistema grátis por 1 ano</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Treinamento completo</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Differentials Section */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Por Que o{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Converta+ é Diferente?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Uma plataforma completa que revoluciona a forma como empresas vendem online
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: 'IA Avançada',
                description: 'Algoritmos inteligentes que aprendem com cada interação e otimizam automaticamente as conversões dos seus clientes.'
              },
              {
                icon: Zap,
                title: 'Automação Total',
                description: 'Do primeiro contato até o fechamento da venda, tudo automatizado com fluxos inteligentes de nutrição.'
              },
              {
                icon: BarChart3,
                title: 'Analytics Poderoso',
                description: 'Dashboards completos com métricas em tempo real para acompanhar performance e ROI de cada campanha.'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <feature.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-black/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Próxima Live Exclusiva Em:
          </h2>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Seg', value: timeLeft.seconds }
            ].map((item, index) => (
              <Card key={index} className="bg-gray-800 border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wide">
                    {item.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <CTAButton />
        </div>
      </section>

      {/* Opportunity Explanation */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Para Quem É Esta{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Oportunidade?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: 'Profissionais de Vendas',
                description: 'Vendedores, consultores e profissionais que já trabalham com vendas online e querem expandir seu portfólio'
              },
              {
                icon: TrendingUp,
                title: 'Especialistas em Marketing',
                description: 'Social media, gestores de tráfego, lançadores e profissionais de marketing digital'
              },
              {
                icon: Users,
                title: 'Empreendedores',
                description: 'Pessoas buscando renda extra ou recorrente com tecnologia de ponta e inteligência artificial'
              }
            ].map((target, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <target.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{target.title}</h3>
                  <p className="text-gray-700">{target.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como Funciona o{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Modelo de Vendas
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sistema simples e eficaz que permite você vender com total liberdade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Altas Comissões',
                description: 'Ganhe comissões significativas por venda. Valores atrativos pagos mensalmente.'
              },
              {
                icon: Gift,
                title: 'Sistema Gratuito',
                description: 'Use o Converta+ por 1 ano completo (valor de R$ 127/mês) sem pagar nada.'
              },
              {
                icon: Shield,
                title: 'Suporte Total',
                description: 'Materiais de venda, treinamentos, suporte técnico e acompanhamento.'
              },
              {
                icon: Clock,
                title: 'Liberdade Completa',
                description: 'Venda quando, onde e como quiser. Trabalhe no seu ritmo.'
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-gray-800 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <benefit.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white border-gray-200 shadow-xl overflow-hidden">
            <CardContent className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Investimento Único
              </h2>
              <div className="text-6xl md:text-7xl font-bold text-green-600 mb-2">
                R$ 500,00
              </div>
              <div className="text-2xl text-green-500 mb-6">
                ou 10x de R$ 50,00 sem juros
              </div>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                Você garante <strong className="text-gray-900">acesso completo ao sistema por 1 ano</strong> + 
                se torna afiliado oficial com direito a comissões e materiais exclusivos.
              </p>
              <div className="bg-gray-100 rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">O que você recebe:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-gray-700">Converta+ por 1 ano (R$ 1.524)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-gray-700">Programa de Afiliados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-gray-700">Materiais de Venda</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-gray-700">Treinamento Completo</span>
                  </div>
                </div>
              </div>
              <CTAButton size="lg" className="text-xl px-12 py-4" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Vantagens Exclusivas do{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Programa Converta+
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Produto de Alta Demanda',
                description: 'IA e automação são o futuro. Converta+ resolve problemas reais de empresas que precisam vender mais.',
                icon: Sparkles
              },
              {
                title: 'Comissões Competitivas',
                description: 'Altas comissões por venda + comissões recorrentes. Melhor que a maioria dos programas.',
                icon: TrendingUp
              },
              {
                title: 'Suporte Diferenciado',
                description: 'Não deixamos você sozinho. Treinamento, materiais, suporte técnico e acompanhamento.',
                icon: Users
              },
              {
                title: 'Sem Mensalidade de Afiliado',
                description: 'Pague uma vez e seja afiliado para sempre. Não cobramos taxas mensais ou anuais.',
                icon: Shield
              }
            ].map((advantage, index) => (
              <Card key={index} className="bg-gray-800 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardContent className="p-8">
                  <advantage.icon className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">{advantage.title}</h3>
                  <p className="text-gray-300 text-lg">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Não Perca Esta Oportunidade Única
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Seja um dos primeiros afiliados oficiais do Converta+ e 
            comece a faturar com inteligência artificial ainda esta semana.
          </p>
          
          <div className="mb-8">
            <CTAButton size="lg" className="text-2xl px-16 py-6" />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Vagas Limitadas</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Live Exclusiva</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Suporte Completo</span>
            </div>
          </div>
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

export default AffiliateLanding;
