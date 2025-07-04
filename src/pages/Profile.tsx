
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Crown, User, Mail, Phone, Key, CreditCard, RefreshCw, Play, BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Componente de Tutorial
const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "Bem-vindo ao Converta+",
      content: "Neste tutorial, você aprenderá como configurar e usar todos os recursos da plataforma.",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: "Criando seu primeiro agente",
      content: "Vamos começar criando um agente de IA para automatizar seu atendimento.",
      icon: <User className="h-6 w-6" />
    },
    {
      title: "Conectando canais",
      content: "Aprenda a conectar WhatsApp, Instagram e Widget do site.",
      icon: <Phone className="h-6 w-6" />
    },
    {
      title: "Gerenciando leads",
      content: "Como organizar e acompanhar seus leads no CRM integrado.",
      icon: <Mail className="h-6 w-6" />
    },
    {
      title: "Configurações avançadas",
      content: "Personalize prompts, configure integrações e otimize performance.",
      icon: <Crown className="h-6 w-6" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tutorial Interativo</h2>
        <p className="text-gray-600 dark:text-gray-400">Aprenda a usar todos os recursos da plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de passos */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Passos do Tutorial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tutorialSteps.map((step, index) => (
                <Button
                  key={index}
                  variant={currentStep === index ? "default" : "ghost"}
                  className={`w-full justify-start text-left h-auto p-3 ${
                    currentStep === index 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center space-x-3">
                    {step.icon}
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-75 mt-1">{step.content}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo do passo atual */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  {tutorialSteps[currentStep].icon}
                  <span>{tutorialSteps[currentStep].title}</span>
                </CardTitle>
                <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300">
                  Passo {currentStep + 1} de {tutorialSteps.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {tutorialSteps[currentStep].content}
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">O que você vai aprender:</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Como configurar rapidamente</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Melhores práticas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Dicas de otimização</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => setCurrentStep(Math.min(tutorialSteps.length - 1, currentStep + 1))}
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Play className="h-4 w-4 mr-2" />
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

// Componente de Assinatura
const Subscription = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gerenciar Assinatura</h2>
        <p className="text-gray-600 dark:text-gray-400">Controle seu plano e pagamentos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plano Atual */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Crown className="mr-2 h-5 w-5 text-yellow-600" />
              Plano Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mb-4">
                Premium Ativo
              </Badge>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">R$ 197,00</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">por mês</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Agentes ilimitados</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Conversas ilimitadas</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">CRM avançado</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Suporte prioritário</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">API personalizada</span>
                <span className="text-green-600">✓</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Próxima cobrança:</p>
              <p className="font-medium text-gray-900 dark:text-white">15 de Fevereiro, 2025</p>
            </div>

            <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600">
              <CreditCard className="mr-2 h-4 w-4" />
              Alterar Método de Pagamento
            </Button>
          </CardContent>
        </Card>

        {/* Uso do Plano */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Uso do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Tokens Utilizados</span>
                <span className="text-gray-900 dark:text-white">85.234 / ∞</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">45% do uso típico</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Agentes Ativos</span>
                <span className="text-gray-900 dark:text-white">3 / ∞</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs text-center py-1 rounded">Ativo</div>
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs text-center py-1 rounded">Ativo</div>
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs text-center py-1 rounded">Ativo</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Conversas este mês</span>
                <span className="text-gray-900 dark:text-white">1.247</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Média de 40 conversas/dia</div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900">
                Cancelar Assinatura
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Pagamentos */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '15 Jan 2025', amount: 'R$ 197,00', status: 'Pago', method: 'Cartão ****1234' },
              { date: '15 Dez 2024', amount: 'R$ 197,00', status: 'Pago', method: 'Cartão ****1234' },
              { date: '15 Nov 2024', amount: 'R$ 197,00', status: 'Pago', method: 'Cartão ****1234' },
            ].map((payment, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{payment.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{payment.amount}</p>
                  <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-800">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente de Dados da Conta
const AccountData = () => {
  const { user, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    openai_key: ''
  });

  useEffect(() => {
    console.log('Profile useEffect - user:', user?.id);
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) {
      console.log('Nenhum usuário logado para buscar dados');
      return;
    }
    
    console.log('Buscando dados do usuário:', user.id);
    setRefreshing(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar dados do usuário:', error);
        return;
      }

      if (data) {
        console.log('Dados do usuário encontrados:', data);
        setUserData({
          name: data.name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          openai_key: data.openai_key || ''
        });
      } else {
        console.log('Usando dados do auth para usuário:', user.id);
        setUserData({
          name: user.user_metadata?.name || user.email?.split('@')[0] || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          openai_key: ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOpenAIKey = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          openai_key: userData.openai_key,
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUserData(prev => ({
          ...prev,
          openai_key: data.openai_key || ''
        }));
      }

      toast({
        title: "Chave OpenAI atualizada",
        description: "Sua chave da OpenAI foi salva com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar chave OpenAI:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar sua chave da OpenAI.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefreshData = async () => {
    console.log('Atualizando dados manualmente...');
    await refreshUserData();
    await fetchUserData();
    toast({
      title: "Dados atualizados",
      description: "Suas informações foram recarregadas.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dados da Conta</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefreshData}
          disabled={refreshing}
          className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <User className="mr-2 h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <strong>ID do Usuário:</strong> {user?.id}
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nome Completo</Label>
                <Input 
                  id="name" 
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Telefone</Label>
                <Input 
                  id="phone" 
                  value={userData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de API */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Key className="mr-2 h-5 w-5" />
              Configurações de API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="openai-key" className="text-gray-700 dark:text-gray-300">Chave OpenAI</Label>
              <Input 
                id="openai-key" 
                type="password" 
                placeholder="sk-..." 
                value={userData.openai_key}
                onChange={(e) => handleInputChange('openai_key', e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sua chave da OpenAI para utilizar os agentes de IA
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSaveOpenAIKey}
              disabled={loading}
              className="w-full border-gray-300 dark:border-gray-600"
            >
              {loading ? 'Atualizando...' : 'Atualizar Chave'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Profile = () => {
  const location = useLocation();
  
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/profile/tutorial') {
      return <Tutorial />;
    } else if (path === '/profile/subscription') {
      return <Subscription />;
    } else {
      return <AccountData />;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default Profile;
