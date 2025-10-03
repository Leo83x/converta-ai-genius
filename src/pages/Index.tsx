import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, BarChart3, Zap, Users, Shield, ArrowRight, CheckCircle, Play, DollarSign, Brain, TrendingUp, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import videoThumb from '@/assets/video-thumb.png';

const Index = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    area: '',
    product: '',
    objective: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (approximately 600px)
      setShowMobileCTA(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-purple-400" />,
      title: "Atendentes de IA Personalizados",
      description: "Crie seu agente de IA personalizado e humanizado em poucos segundos e conecte ao seu WhatsApp Business, escaneando o QR Code"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-400" />,
      title: "Análise de Conversas",
      description: "Analise todas as conversas que seu Atendente teve com seus clientes e assuma o controle da comunicação se quiser e quando quiser"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Atendimento 24/7",
      description: "Atendimento contínuo 24/7 sem pausas, garantindo que nenhum cliente seja perdido"
    },
    {
      icon: <Users className="h-8 w-8 text-red-400" />,
      title: "CRM Automático",
      description: "Seu Funcionário de IA atende seus leads e qualifica automaticamente em estágios no CRM Inteligente. Você ainda pode personalizar estes estágios de acordo com seu negócio e acompanhar em tempo real a evolução dos seus clientes."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-400" />,
      title: "Insights de Performance",
      description: "Dashboards avançados com métricas que ajudam a vender mais, anunciar melhor e aprimorar continuamente seu atendimento"
    },
    {
      icon: <Brain className="h-8 w-8 text-green-400" />,
      title: "Genius IA",
      description: "Conte com um analista de IA na plataforma para gerar insights e análise comparativa de mercado. Você sempre a frente dos concorrentes!"
    }
  ];

  const benefits = [
    "Aumente suas vendas em até 300%",
    "Reduza custos operacionais em 70%",
    "Atendimento 24/7 sem pausas",
    "Qualificação automática de leads",
    "Relatórios inteligentes e métricas avançadas",
    "Acompanhe Resultados: Visualize leads, conversas e métricas em tempo real no painel"
  ];

  const handleWhatsAppClick = () => {
    // Dispara o evento Lead do Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
    window.location.href = 'https://convertamais.online/app/auth?tab=signup';
  };

  const handleAffiliateClick = () => {
    navigate('/afiliados');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 w-full overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-6 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between">
          <div className="flex items-center">
           <img
              src={`${import.meta.env.BASE_URL}lovable-uploads/logo-c-v2.png`}
              alt="Logo"
              className="h-12 w-auto"
             />
          </div>
          <div className="hidden md:flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              onClick={handleWhatsAppClick}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs sm:text-sm px-3 py-2"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Experimentar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-8 md:pt-16 pb-24 px-4 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transforme o WhatsApp do seu Negócio em uma Máquina de Vendas 24/7
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Na Converta+, você ativa em poucos cliques um Atendente de IA que conversa de forma humanizada, qualifica leads e gera vendas automáticas todos os dias.
          </p>
          
          {/* Video Section */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-4">
              {!isVideoOpen ? (
                <button
                  onClick={() => {
                    setIsVideoOpen(true);
                    setHasPlayedOnce(true);
                  }}
                  className="group relative"
                >
                  {/* Video Thumbnail Container */}
                  <div className="relative w-full max-w-[90vw] aspect-video md:w-[560px] md:h-[315px] md:aspect-auto rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]">
                    {/* Video Thumbnail Image */}
                    <img 
                      src={videoThumb} 
                      alt="Veja a plataforma em funcionamento" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`relative ${!hasPlayedOnce ? 'animate-pulse' : ''}`}>
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
                        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                          <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-lg md:text-xl font-semibold text-center">
                        Veja a plataforma em funcionamento
                      </p>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="relative w-full max-w-[90vw] aspect-video md:w-[560px] md:h-[315px] md:aspect-auto rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/WaYx2aP4B5I?autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-2xl"
                  ></iframe>
                </div>
              )}
            </div>

            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg text-white"
            >
              Experimentar Grátis
            </Button>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <div className="hidden"></div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-2xl bg-gray-800 border-purple-500/30">
              <div className="p-3 md:p-6">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 text-center">Teste Grátis seu Agente IA Personalizado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="name" className="text-gray-300 text-xs md:text-sm">Primeiro Nome: *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className="bg-gray-700 border-gray-600 text-white text-sm md:text-base h-8 md:h-10 px-2 md:px-3"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="company" className="text-gray-300 text-xs md:text-sm">Nome da Empresa/Negócio *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleFormChange('company', e.target.value)}
                      placeholder="Nome da sua empresa"
                      className="bg-gray-700 border-gray-600 text-white text-sm md:text-base h-8 md:h-10 px-2 md:px-3"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="area" className="text-gray-300 text-xs md:text-sm">Área de Atuação</Label>
                    <Select onValueChange={(value) => handleFormChange('area', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm md:text-base h-8 md:h-10 px-2 md:px-3">
                        <SelectValue placeholder="Selecione sua área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="servicos">Prestação de Serviços</SelectItem>
                        <SelectItem value="consultoria">Consultoria</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="imobiliario">Imobiliário</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 md:space-y-2 md:col-span-2">
                    <Label htmlFor="product" className="text-gray-300 text-xs md:text-sm">Produto / Serviço</Label>
                    <Input
                      id="product"
                      value={formData.product}
                      onChange={(e) => handleFormChange('product', e.target.value)}
                      placeholder="Descreva seu principal produto ou serviço"
                      className="bg-gray-700 border-gray-600 text-white text-sm md:text-base h-8 md:h-10 px-2 md:px-3"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2 md:col-span-2">
                    <Label htmlFor="objective" className="text-gray-300 text-xs md:text-sm">Objetivo do Agente IA</Label>
                    <Textarea
                      id="objective"
                      value={formData.objective}
                      onChange={(e) => handleFormChange('objective', e.target.value)}
                      placeholder="Ex: Captar leads, qualificar clientes, agendar reuniões, suporte ao cliente..."
                      className="bg-gray-700 border-gray-600 text-white text-sm md:text-base py-1.5 md:py-2 px-2 md:px-3 min-h-[60px] md:min-h-[80px]"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col items-center mt-4">
                    <Button
                      onClick={handleWhatsAppClick}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-white"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Experimentar Grátis
                    </Button>
                    <p className="text-gray-400 text-xs mt-2 text-center">
                      Tenha uma experiência de atendimento de IA como se fosse cliente do próprio negócio.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Se adapta ao seu negócio</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Atende e vende 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Conversas humanizadas</span>
            </div>
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
              Tudo que você precisa para automatizar e escalar seu atendimento e vendas
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
              Você só paga se achar a ferramenta incrível
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Plano Básico</CardTitle>
                <p className="text-sm text-purple-600 font-semibold mb-2">Experimente 2 dias Grátis</p>
                <p className="text-gray-600 mb-4">Perfeito para começar</p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-purple-600">R$ 197</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    1 Atendente de IA no WhatsApp
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Atendimento automático 24/7
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Qualificação automática de clientes
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    CRM Automático
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Genius IA
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Painel de controle
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Suporte por chat
                  </li>
                </ul>
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Experimentar Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                  MAIS POPULAR
                </span>
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold mb-2">Plano Premium</CardTitle>
                <p className="text-sm text-white font-semibold mb-2">Experimente 2 dias Grátis</p>
                <p className="text-purple-200 mb-4">Máxima performance para seu negócio</p>
                <div className="text-center">
                  <span className="text-4xl font-bold">R$ 397</span>
                  <span className="text-purple-200">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    3 Atendentes de IA no WhatsApp
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Atendimento automático 24/7
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Qualificação avançada de clientes
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Analytics detalhado
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    CRM Automático
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Genius IA
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Suporte prioritário
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Configurações personalizadas
                  </li>
                </ul>
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-white text-purple-600 hover:bg-gray-100"
                >
                  Experimentar Grátis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Pronto para atender melhor e vender mais?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Acesse agora o sistema, crie e teste seu Atendente de IA em poucos cliques.
          </p>
          
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleWhatsAppClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg text-white font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              Experimentar Grátis
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/40 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={`${import.meta.env.BASE_URL}lovable-uploads/logo-c-v2.png`}
                alt="Logo"
                className="h-10 w-auto"
              />
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 Converta+. Todos os direitos reservados.</p>
              <p className="mt-1">Automação inteligente de leads com IA</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed CTA Button */}
      {showMobileCTA && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent md:hidden z-50">
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg"
          >
            Experimentar Grátis
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
