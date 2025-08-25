import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PricingPlansProps {
  onPlanSelect?: (planType: string) => void;
  affiliateCode?: string;
}

export const PricingPlans = ({ onPlanSelect, affiliateCode }: PricingPlansProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planType: string) => {
    try {
      setLoading(planType);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Login necessário",
          description: "Faça login para continuar com a assinatura",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planType,
          affiliateCode
        }
      });

      if (error) throw error;

      if (data.url) {
        // Open Stripe checkout in a new tab  
        window.open(data.url, '_blank');
        if (onPlanSelect) {
          onPlanSelect(planType);
        }
      }

    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Plano Mensal',
      price: 'R$ 127',
      period: '/mês',
      description: 'Perfeito para começar',
      features: [
        'WhatsApp Business integrado',
        'Agentes IA ilimitados',
        'Widget para seu site',
        'CRM completo',
        'Campanhas Genius',
        'Suporte prioritário'
      ],
      popular: false,
      buttonText: 'Começar Agora'
    },
    {
      id: 'annual',
      name: 'Plano Anual',
      price: 'R$ 1.297',
      period: '/ano',
      originalPrice: 'R$ 1.524',
      description: 'Economize 15% pagando anualmente',
      features: [
        'Tudo do plano mensal',
        'Suporte premium 24/7',
        'Consultoria de setup',
        'Templates exclusivos',
        'Analytics avançadas',
        'API personalizada'
      ],
      popular: true,
      buttonText: 'Economizar 15%',
      savings: 'Economize R$ 227'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
          {plan.popular && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Mais Popular
            </Badge>
          )}
          
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            
            <div className="space-y-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              
              {plan.originalPrice && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="line-through text-muted-foreground">
                    {plan.originalPrice}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {plan.savings}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button 
              className="w-full h-12 text-lg" 
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handleSelectPlan(plan.id)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? "Processando..." : plan.buttonText}
            </Button>

            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};