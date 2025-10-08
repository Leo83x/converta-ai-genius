import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Target, Calendar, DollarSign, Settings, BarChart3, Sparkles, TrendingUp, Zap, CheckCircle, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import logoConverta from '@/assets/logo-converta.png';
import heroImage from '@/assets/hero-business-success.jpg';
import aiCampaignsImage from '@/assets/ai-creating-campaigns.jpg';
import testimonial1 from '@/assets/testimonial-1.jpg';
import testimonial2 from '@/assets/testimonial-2.jpg';
import testimonial3 from '@/assets/testimonial-3.jpg';

const GeniusMarketing = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    segment: '',
    objective: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileCTA(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false);
    }, 1500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(pulseTimer);
    };
  }, []);

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-pink-500" />,
      title: "Criação automática de criativos e copies persuasivos",
      description: "A IA escreve textos que convertem e cria ideias visuais impactantes automaticamente."
    },
    {
      icon: <Target className="h-8 w-8 text-purple-500" />,
      title: "Definição inteligente de público-alvo ideal",
      description: "Analisa dados do mercado e encontra automaticamente as pessoas certas para suas campanhas."
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      title: "Plano de ação e orçamento automáticos",
      description: "Gera cronogramas otimizados e recomenda investimentos ideais para cada canal."
    },
    {
      icon: <Settings className="h-8 w-8 text-indigo-500" />,
      title: "Otimização de anúncios em tempo real",
      description: "Acompanha desempenho e ajusta criativos e públicos com base em dados reais."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-cyan-500" />,
      title: "Análise comparativa por segmento",
      description: "Compara seus resultados com empresas do mesmo setor e gera insights estratégicos."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Integração com Converta+",
      description: "Insights e resultados que superam agências tradicionais, com inteligência que aprende."
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Proprietária",
      company: "Loja de Cosméticos",
      result: "Em 7 dias, o Genius Marketing trouxe 58 novos leads qualificados!",
      image: testimonial1
    },
    {
      name: "João Santos",
      role: "Fundador",
      company: "Consultoria Digital",
      result: "As campanhas foram criadas automaticamente, e os resultados apareceram rápido.",
      image: testimonial2
    },
    {
      name: "Ana Costa",
      role: "Gerente de Marketing",
      company: "E-commerce de Moda",
      result: "Paguei menos em anúncios e vendi o dobro.",
      image: testimonial3
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsFormOpen(false);
    window.location.href = 'https://convertamais.online/app/auth?tab=signup';
  };

  const handleCTAClick = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-950/95 to-indigo-950/95 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoConverta} alt="Converta+" className="h-10 md:h-12" />
          <Button
            onClick={handleCTAClick}
            size="lg"
            className={`bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white ${isPulsing ? 'animate-[pulse_0.5s_ease-in-out_3]' : ''}`}
          >
            Experimentar Grátis
          </Button>
        </div>
      </header>

      {/* Fixed Mobile CTA */}
      {showMobileCTA && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-fade-in">
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
          >
            Começar Agora
          </Button>
        </div>
      )}

      {/* Hero Section - Dark */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 text-white pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-800/30 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-2 mb-4">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-sm font-medium">Inteligência Artificial para Marketing</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Atraia novos clientes com o poder da IA
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
              O Genius Marketing cria campanhas inteligentes que atraem e convertem clientes automaticamente para o seu negócio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-8 py-4 text-lg text-white shadow-xl hover:shadow-2xl transition-all"
              >
                Quero ativar meu marketing com IA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Hero Image */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-transparent to-transparent z-10 pointer-events-none"></div>
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl">
                <img src={heroImage} alt="Empresária analisando crescimento no notebook" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section - Light */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                Mais que uma agência. Uma IA que faz tudo por você.
              </h2>
              <p className="text-lg text-gray-700">
                O Genius Marketing cria campanhas completas — desde o criativo até o público ideal — em poucos minutos.
                Você define o objetivo, e a IA faz o resto.
              </p>
              <div className="space-y-4 pt-4">
                {['Criativos persuasivos', 'Públicos otimizados', 'Resultados mensuráveis'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={aiCampaignsImage} alt="IA criando campanhas de marketing" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Dark */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Tudo o que a IA faz por você
            </h2>
            <p className="text-lg text-purple-200">
              O Genius Marketing automatiza todo o processo de criação e otimização de campanhas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 hover:bg-white/10">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-200">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section - Light */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              Mais inteligência a cada campanha
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              O Genius Marketing se conecta ao Converta+, analisando leads, conversas e resultados para otimizar campanhas com inteligência real.
              Esses dados alimentam a IA, que aprende e otimiza suas campanhas continuamente.
            </p>
            <p className="text-xl font-semibold text-gray-900">
              Essa integração torna a IA cada vez mais precisa e estratégica para o seu negócio.
            </p>
            <p className="text-lg text-purple-700 font-medium">
              É assim que conseguimos fazer o que nenhuma agência tradicional consegue: crescer com base em dados reais.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="space-y-2">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto" />
                <p className="text-2xl font-bold text-gray-900">+300%</p>
                <p className="text-sm text-gray-600">Crescimento médio</p>
              </div>
              <div className="space-y-2">
                <Zap className="h-12 w-12 text-yellow-600 mx-auto" />
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">Otimização contínua</p>
              </div>
              <div className="space-y-2">
                <Brain className="h-12 w-12 text-purple-600 mx-auto" />
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Automático</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Dark */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Comece a gerar resultados com IA em minutos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Cadastre-se e conecte",
                description: "Cadastre-se e conecte seu WhatsApp Profissional à plataforma."
              },
              {
                step: "2",
                title: "IA cria suas campanhas",
                description: "O Genius AI cria automaticamente seus anúncios, textos e públicos."
              },
              {
                step: "3",
                title: "Acompanhe resultados",
                description: "Acompanhe leads, vendas e insights direto do painel Converta+."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-purple-200">{item.description}</p>
                </div>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 h-8 w-8 text-purple-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Light */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              Empresas que já usam o Genius Marketing estão crescendo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-purple-200 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex flex-col items-center text-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
                    />
                    <div>
                      <CardTitle className="text-gray-900 text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-purple-600 text-sm font-medium">{testimonial.role}</CardDescription>
                      <CardDescription className="text-gray-600 text-sm">{testimonial.company}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-700 font-medium italic">"{testimonial.result}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Light */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              Planos acessíveis para todos os tamanhos de negócio
            </h3>
            <p className="text-xl text-gray-700">
              Planos a partir de <span className="text-purple-600 font-bold">R$197/mês</span>, com 2 dias grátis para testar.
            </p>
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-12 py-6 text-xl text-white shadow-xl hover:shadow-2xl transition-all"
            >
              Testar agora grátis
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA - Dark */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
              Experimente grátis agora
            </h2>
            <p className="text-xl text-purple-100">
              Ative o Genius Marketing e teste gratuitamente por 2 dias.
            </p>
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="bg-white text-purple-900 hover:bg-purple-50 px-12 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Começar agora
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-purple-500/20 text-white">
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Receber plano de ação com IA
              </h2>
              <p className="text-purple-200">
                Preencha os dados e receba um plano personalizado
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome completo</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-purple-800/30 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                  placeholder="Seu nome"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="bg-purple-800/30 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segment" className="text-white">Segmento da empresa</Label>
                <Select
                  value={formData.segment}
                  onValueChange={(value) => setFormData({ ...formData, segment: value })}
                  required
                >
                  <SelectTrigger className="bg-purple-800/30 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-900 border-purple-500/30 text-white">
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="consultoria">Consultoria</SelectItem>
                    <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective" className="text-white">Objetivo principal</Label>
                <Select
                  value={formData.objective}
                  onValueChange={(value) => setFormData({ ...formData, objective: value })}
                  required
                >
                  <SelectTrigger className="bg-purple-800/30 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-900 border-purple-500/30 text-white">
                    <SelectItem value="leads">Gerar mais leads</SelectItem>
                    <SelectItem value="vendas">Aumentar vendas</SelectItem>
                    <SelectItem value="brand">Fortalecer marca</SelectItem>
                    <SelectItem value="engagement">Aumentar engajamento</SelectItem>
                    <SelectItem value="lancamento">Lançar produto/serviço</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                size="lg"
              >
                Receber plano de ação
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-b from-purple-950 to-indigo-950 border-t border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <img src={logoConverta} alt="Converta+" className="h-10" />
            <div className="flex gap-6 text-sm text-purple-300">
              <a href="#" className="hover:text-purple-100 transition-colors flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                Termos de Uso
              </a>
              <a href="#" className="hover:text-purple-100 transition-colors flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                Política de Privacidade
              </a>
            </div>
            <p className="text-center text-purple-300 text-sm">
              © 2025 Converta+. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GeniusMarketing;