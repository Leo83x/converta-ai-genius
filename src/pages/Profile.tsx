
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Check, Play, ChevronRight, Crown, CreditCard, User as UserIcon, BookOpen, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const TutorialPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Bem-vindo ao Converta+",
      description: "Neste tutorial, você aprenderá como configurar e usar todos os recursos da plataforma.",
      icon: <BookOpen className="h-5 w-5" />,
      completed: true
    },
    {
      title: "Criando seu primeiro agente",
      description: "Vamos começar criando um agente de IA para automatizar seu atendimento.",
      icon: <Play className="h-5 w-5" />,
      completed: false
    },
    {
      title: "Conectando canais",
      description: "Aprenda a conectar WhatsApp, Instagram e Widget do site.",
      icon: <ChevronRight className="h-5 w-5" />,
      completed: false
    },
    {
      title: "Gerenciando leads",
      description: "Como organizar e acompanhar seus leads no CRM integrado.",
      icon: <UserIcon className="h-5 w-5" />,
      completed: false
    },
    {
      title: "Configurações avançadas",
      description: "Personalize prompts, configure integrações e otimize performance.",
      icon: <Star className="h-5 w-5" />,
      completed: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tutorial Interativo</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Aprenda a usar todos os recursos da plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Passos do Tutorial */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Passos do Tutorial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentStep
                        ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500' : index === currentStep ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {step.completed ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-white text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 break-words">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo do Tutorial */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-gray-900 dark:text-white">
                    {steps[currentStep].title}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  Passo {currentStep + 1} de {steps.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                Neste tutorial, você aprenderá como configurar e usar todos os recursos da plataforma.
              </p>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">O que você vai aprender:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Como configurar rapidamente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Melhores práticas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Dicas de otimização</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Anterior
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPage = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "1 agente ativo",
        "100 conversas/mês",
        "Suporte por email",
        "Integrações básicas"
      ],
      current: true,
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 97",
      period: "/mês",
      description: "Para pequenas empresas",
      features: [
        "5 agentes ativos",
        "1.000 conversas/mês",
        "Suporte prioritário",
        "Todas as integrações",
        "Relatórios avançados",
        "API personalizada"
      ],
      current: false,
      popular: true
    },
    {
      name: "Empresarial",
      price: "R$ 297",
      period: "/mês",
      description: "Para equipes maiores",
      features: [
        "Agentes ilimitados",
        "Conversas ilimitadas",
        "Suporte 24/7",
        "Integrações personalizadas",
        "Dashboard executivo",
        "Gerente de conta dedicado"
      ],
      current: false,
      popular: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assinatura</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie seu plano e faturamento</p>
      </div>

      {/* Status da Assinatura Atual */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Crown className="h-5 w-5 mr-2 text-yellow-500" />
            Plano Atual: Gratuito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversas utilizadas</p>
              <div className="mt-2">
                <Progress value={23} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">23/100 conversas</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Agentes ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0/1</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Próxima renovação</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Plano gratuito</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
              plan.popular ? 'border-purple-500 dark:border-purple-400' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                Mais Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{plan.name}</CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${
                  plan.current 
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                    : plan.popular 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Plano Atual' : 'Fazer Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Histórico de Faturamento */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <CreditCard className="h-5 w-5 mr-2" />
            Histórico de Faturamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Nenhum histórico de faturamento encontrado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const AccountDataPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dados da Conta</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie suas informações pessoais e configurações</p>
      </div>

      <div className="space-y-6">
        {/* Informações Pessoais */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nome</Label>
                <Input 
                  id="name" 
                  value={user?.user_metadata?.name || user?.email || ''}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">E-mail</Label>
                <Input 
                  id="email" 
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Telefone</Label>
              <Input 
                id="phone" 
                placeholder="+55 11 99999-9999"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de API */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Configurações de API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="openai-key" className="text-gray-700 dark:text-gray-300">Chave OpenAI (Opcional)</Label>
              <Input 
                id="openai-key" 
                type="password"
                placeholder="sk-..."
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure sua própria chave para usar seus créditos OpenAI
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Salvar Chave
            </Button>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notifications" className="text-gray-700 dark:text-gray-300">Notificações por E-mail</Label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Novos leads</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Conversas importantes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Updates da plataforma</span>
                </label>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Profile = () => {
  const location = useLocation();

  return (
    <Layout>
      <Routes>
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/account" element={<AccountDataPage />} />
        <Route path="/*" element={<AccountDataPage />} />
      </Routes>
    </Layout>
  );
};

export default Profile;
