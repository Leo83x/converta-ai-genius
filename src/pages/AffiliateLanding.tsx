
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Clock, Users, Zap, Star, ArrowRight, Phone, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

const AffiliateLanding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
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
    
    // Simulate form submission
    setIsSubmitted(true);
    toast.success('Cadastro recebido com sucesso! Em breve você receberá o link da live no seu WhatsApp e e-mail.');
    
    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const FormSection = ({ className = "" }: { className?: string }) => (
    <Card className={`w-full max-w-md mx-auto bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Garante sua vaga agora!
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Cadastro Confirmado!</h3>
            <p className="text-gray-300">
              Em breve você receberá o link da live no seu WhatsApp e e-mail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp" className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4" />
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 text-lg"
            >
              Quero Participar da Live
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Ganhe Comissões
                </span>
                <br />
                e Use o Converta+ por{' '}
                <span className="text-yellow-400">1 Ano</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Cadastre-se para participar da nossa live e descubra como{' '}
                <strong className="text-white">faturar com a plataforma mais inteligente</strong>{' '}
                de vendas com IA do Brasil.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Comissões Atrativas</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Sistema Gratuito por 1 Ano</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Suporte Completo</span>
                </div>
              </div>
            </div>
            <div>
              <FormSection />
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-12 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Próxima Live Ao Vivo Em:
          </h2>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Seg', value: timeLeft.seconds }
            ].map((item, index) => (
              <Card key={index} className="bg-gradient-to-br from-purple-800 to-blue-800 border-purple-500/30">
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
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Por Que Ser Afiliado do{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Converta+?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Na live vamos explicar tudo: para quem vender, como vender, quanto você pode ganhar 
              e por que esse é o melhor momento para entrar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Comissões Atrativas',
                description: 'Ganhe por cada venda realizada com nossa estrutura de comissões generosa'
              },
              {
                icon: Zap,
                title: 'Sistema Gratuito',
                description: 'Use o Converta+ por 1 ano completo (valor de R$ 127/mês) sem custo'
              },
              {
                icon: Users,
                title: 'Suporte Completo',
                description: 'Materiais de apoio, treinamento e suporte para maximizar suas vendas'
              },
              {
                icon: Clock,
                title: 'Liberdade Total',
                description: 'Venda do seu jeito, no seu tempo, com total flexibilidade'
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <benefit.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-white mb-3">
                    "Eu vendi 5 planos em uma semana e já recuperei o investimento! 
                    O sistema é incrível e o suporte da equipe fez toda a diferença."
                  </blockquote>
                  <cite className="text-purple-300 font-semibold">
                    — Marina Santos, Afiliada desde Janeiro 2024
                  </cite>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Investimento Único
              </h2>
              <div className="text-6xl font-bold text-yellow-400 mb-4">
                R$ 500,00
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Você garante acesso completo ao sistema por{' '}
                <strong className="text-white">1 ano</strong> + se torna afiliado 
                com acesso a comissões e materiais exclusivos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Garanta sua vaga na próxima live
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Comece a faturar com IA ainda essa semana. 
                Não perca essa oportunidade única de ser um dos primeiros 
                afiliados oficiais do Converta+.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Vagas Limitadas</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Live Exclusiva</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Materiais Gratuitos</span>
                </div>
              </div>
            </div>
            <div>
              <FormSection />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/30 text-center">
        <p className="text-gray-400">
          © 2024 Converta+ - Plataforma de Automação Inteligente de Leads com IA
        </p>
      </footer>
    </div>
  );
};

export default AffiliateLanding;
