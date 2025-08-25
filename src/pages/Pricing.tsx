import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

const Pricing = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ subscribed: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = [
    {
      name: 'Basic',
      price: 'R$ 49',
      priceId: 'price_basic',
      period: '/mês',
      description: 'Ideal para pequenas empresas',
      popular: false,
      features: [
        '3 agentes de IA',
        '1.000 conversas/mês',
        'WhatsApp integração',
        'Widget do site',
        'Suporte por email'
      ]
    },
    {
      name: 'Premium',
      price: 'R$ 99',
      priceId: 'price_premium',
      period: '/mês',
      description: 'Para empresas em crescimento',
      popular: true,
      features: [
        '10 agentes de IA',
        '5.000 conversas/mês',
        'Todas as integrações',
        'CRM avançado',
        'Campanhas Genius',
        'Suporte prioritário',
        'Analytics avançados'
      ]
    },
    {
      name: 'Enterprise',
      price: 'R$ 199',
      priceId: 'price_enterprise',
      period: '/mês',
      description: 'Para grandes operações',
      popular: false,
      features: [
        'Agentes ilimitados',
        'Conversas ilimitadas',
        'Integrações customizadas',
        'API dedicada',
        'Suporte 24/7',
        'Manager dedicado',
        'Customizações'
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionStatus(data);
      toast({
        title: "Status atualizado",
        description: "Status da assinatura verificado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status da assinatura.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSelectPlan = async (planName: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para assinar um plano.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planName }
      });

      if (error) throw error;

      // Abrir Stripe checkout em nova aba
      window.open(data.url, '_blank');

      toast({
        title: "Redirecionando",
        description: "Você será redirecionado para o checkout do Stripe."
      });
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o processo de pagamento.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      window.open(data.url, '_blank');

      toast({
        title: "Portal do Cliente",
        description: "Abrindo portal de gerenciamento da assinatura."
      });
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de gerenciamento.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Basic': return <Zap className="h-6 w-6" />;
      case 'Premium': return <Star className="h-6 w-6" />;
      case 'Enterprise': return <Crown className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const isCurrentPlan = (planName: string) => {
    return subscriptionStatus.subscribed && 
           subscriptionStatus.subscription_tier?.toLowerCase() === planName.toLowerCase();
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Potencialize seu negócio com IA conversacional
          </p>

          {/* Status da Assinatura */}
          {subscriptionStatus.subscribed && (
            <div className="mb-8">
              <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 mb-2">
                        Plano Ativo: {subscriptionStatus.subscription_tier}
                      </Badge>
                      {subscriptionStatus.subscription_end && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Renovação: {new Date(subscriptionStatus.subscription_end).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleManageSubscription}
                      variant="outline"
                      disabled={isLoading}
                    >
                      Gerenciar Assinatura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Botão de Verificar Status */}
          <div className="mb-8">
            <Button
              onClick={checkSubscriptionStatus}
              variant="outline"
              disabled={isCheckingStatus}
            >
              {isCheckingStatus ? 'Verificando...' : 'Verificar Status'}
            </Button>
          </div>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''} 
                         ${isCurrentPlan(plan.name) ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    Mais Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan(plan.name) && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    Seu Plano
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {getPlanIcon(plan.name)}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan(plan.name) ? (
                  <Button className="w-full" disabled>
                    Plano Atual
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.name)}
                    disabled={isLoading}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isLoading ? 'Processando...' : 'Escolher Plano'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Seção */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Sim, você pode cancelar sua assinatura a qualquer momento através do portal de gerenciamento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o período de teste?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Oferecemos 7 dias de teste gratuito para todos os planos. Você pode cancelar antes do fim do período sem cobrança.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso fazer upgrade do meu plano?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do portal de gerenciamento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;