import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Target, Calendar, DollarSign, Settings, BarChart3, Sparkles, TrendingUp, Zap, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
      icon: <Brain className="h-8 w-8 text-pink-400" />,
      title: "Criação de criativos e copy",
      description: "A IA escreve textos persuasivos e cria ideias visuais para anúncios que convertem."
    },
    {
      icon: <Target className="h-8 w-8 text-purple-400" />,
      title: "Definição de público-alvo",
      description: "Analisa dados e encontra automaticamente o público ideal para suas campanhas."
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-400" />,
      title: "Plano de ação inteligente",
      description: "Gera sugestões automáticas de campanhas com cronograma otimizado."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-400" />,
      title: "Gestão de orçamento",
      description: "Recomenda valores ideais de investimento por canal e etapa do funil."
    },
    {
      icon: <Settings className="h-8 w-8 text-indigo-400" />,
      title: "Otimização em tempo real",
      description: "Acompanha desempenho e ajusta criativos e públicos automaticamente."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-cyan-400" />,
      title: "Análise comparativa por segmento",
      description: "Compara resultados com empresas do mesmo setor e gera insights estratégicos."
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      company: "Loja de Moda",
      result: "+65% de novos leads em 7 dias",
      avatar: "MS"
    },
    {
      name: "João Santos",
      company: "Consultoria Digital",
      result: "ROI 4x maior nas campanhas",
      avatar: "JS"
    },
    {
      name: "Ana Costa",
      company: "E-commerce",
      result: "Redução de 50% no custo por lead",
      avatar: "AC"
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
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 text-white">
      {/* Fixed Mobile CTA */}
      {showMobileCTA && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-fade-in">
          <Button
            onClick={handleCTAClick}
            size="lg"
            className={`w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg ${isPulsing ? 'animate-[pulse_0.5s_ease-in-out_3]' : ''}`}
          >
            Começar Agora
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-800/30 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-2 mb-4">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-sm font-medium">Inteligência Artificial para Marketing</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Atraia novos clientes com o poder da IA
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
              O Genius Marketing cria campanhas inteligentes que atraem, qualificam e convertem clientes automaticamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                onClick={handleCTAClick}
                size="lg"
                className={`bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-8 py-4 text-lg text-white ${isPulsing ? 'animate-[pulse_0.5s_ease-in-out_3]' : ''}`}
              >
                Quero ativar meu marketing com IA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Hero Image */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-transparent to-transparent z-10"></div>
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl backdrop-blur-sm bg-purple-900/20 p-4">
                <div className="aspect-video bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg flex items-center justify-center">
                  <Play className="h-20 w-20 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Mais que uma agência. Uma IA que faz tudo por você.
              </h2>
              <p className="text-lg text-purple-200">
                O Genius Marketing cria campanhas completas — desde o criativo até o público ideal — em poucos minutos.
                Você define o objetivo, e a IA faz o resto.
              </p>
              <div className="space-y-4 pt-4">
                {['Criativos persuasivos', 'Públicos otimizados', 'Resultados mensuráveis'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <span className="text-purple-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl backdrop-blur-sm bg-purple-900/20 p-8">
                <div className="aspect-square bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg flex items-center justify-center">
                  <Brain className="h-32 w-32 text-purple-300/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-purple-900/20">
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
              <Card key={index} className="bg-purple-900/30 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
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

      {/* Integration Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Mais inteligência a cada campanha
            </h2>
            <p className="text-lg text-purple-200">
              A integração entre o Genius Marketing e o sistema Converta+ permite analisar leads, conversas e resultados em tempo real.
              Esses dados alimentam a IA, que aprende e otimiza suas campanhas continuamente.
            </p>
            <p className="text-xl font-semibold text-white">
              É assim que conseguimos fazer o que nenhuma agência tradicional consegue: crescer com base em dados reais.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="space-y-2">
                <TrendingUp className="h-12 w-12 text-green-400 mx-auto" />
                <p className="text-2xl font-bold">+300%</p>
                <p className="text-sm text-purple-200">Crescimento médio</p>
              </div>
              <div className="space-y-2">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto" />
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-purple-200">Otimização contínua</p>
              </div>
              <div className="space-y-2">
                <Brain className="h-12 w-12 text-purple-400 mx-auto" />
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-purple-200">Automático</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-purple-900/20">
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-2xl font-bold">
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

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Empresas que já usam o Genius Marketing estão crescendo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-purple-900/30 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-purple-300 text-sm">{testimonial.company}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-400">{testimonial.result}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-indigo-900/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Experimente grátis agora
            </h2>
            <p className="text-xl text-purple-200">
              Ative o Genius Marketing e teste gratuitamente por 2 dias.
            </p>
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-12 py-6 text-xl text-white"
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
      <footer className="py-12 bg-purple-950/50 border-t border-purple-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center text-purple-300">
            <p>© 2025 Converta+. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GeniusMarketing;