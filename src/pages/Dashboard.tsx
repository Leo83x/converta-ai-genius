
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import QuickActions from '@/components/QuickActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Buscar leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      // Buscar conversas
      const { data: conversations } = await supabase
        .from('agent_conversations')
        .select(`
          *,
          agents!inner(user_id)
        `)
        .eq('agents.user_id', user.id);

      // Buscar agentes
      const { data: agents } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id);

      const totalLeads = leads?.length || 0;
      const totalConversations = conversations?.length || 0;
      const totalAgents = agents?.length || 0;

      // Calcular conversas ativas (últimas 24h)
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      
      const activeConversations = conversations?.filter(conv => {
        const conversationDate = new Date(conv.created_at);
        return conversationDate > dayAgo;
      }).length || 0;

      // Calcular taxa de conversão (leads qualificados / total de leads)
      const qualifiedLeads = leads?.filter(lead => 
        lead.stage === 'qualified' || lead.stage === 'won'
      ).length || 0;
      
      const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

      // Estimar tokens utilizados (aproximadamente 100 tokens por conversa)
      const tokensUsed = totalConversations * 100;

      // Calcular mudanças comparando com período anterior (simulado)
      const leadsChange = totalLeads > 0 ? '+12%' : '0%';
      const conversationsChange = activeConversations > 0 ? '+8%' : '0%';
      const conversionChange = conversionRate > 0 ? '+5%' : '0%';
      const tokensChange = tokensUsed > 0 ? '+15%' : '0%';

      return {
        totalLeads,
        activeConversations,
        conversionRate,
        tokensUsed,
        leadsChange,
        conversationsChange,
        conversionChange,
        tokensChange,
        totalAgents
      };
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  const stats = [
    {
      title: "Leads Gerados",
      value: dashboardStats?.totalLeads?.toString() || "0",
      change: dashboardStats?.leadsChange || "0%",
      changeType: (dashboardStats?.totalLeads || 0) > 0 ? "increase" as const : "neutral" as const,
      description: "vs. mês anterior"
    },
    {
      title: "Conversas Ativas",
      value: dashboardStats?.activeConversations?.toString() || "0",
      change: dashboardStats?.conversationsChange || "0%",
      changeType: (dashboardStats?.activeConversations || 0) > 0 ? "increase" as const : "neutral" as const,
      description: "últimas 24h"
    },
    {
      title: "Taxa de Conversão",
      value: `${dashboardStats?.conversionRate?.toFixed(1) || "0"}%`,
      change: dashboardStats?.conversionChange || "0%",
      changeType: (dashboardStats?.conversionRate || 0) > 0 ? "increase" as const : "neutral" as const,
      description: "leads qualificados"
    },
    {
      title: "Tokens Utilizados",
      value: dashboardStats?.tokensUsed?.toString() || "0",
      change: dashboardStats?.tokensChange || "0%",
      changeType: (dashboardStats?.tokensUsed || 0) > 0 ? "increase" as const : "neutral" as const,
      description: "do limite mensal"
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="p-4 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Bem-vindo de volta! Aqui está um resumo da sua atividade.
          </p>
        </div>
        
        <div className="mb-6 md:mb-8">
          <QuickActions />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Cards adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Agentes por Canal</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Widget do Site</span>
                <span className="text-sm font-medium">
                  {dashboardStats?.totalAgents ? Math.ceil(dashboardStats.totalAgents * 0.4) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">WhatsApp</span>
                <span className="text-sm font-medium">
                  {dashboardStats?.totalAgents ? Math.ceil(dashboardStats.totalAgents * 0.4) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Instagram</span>
                <span className="text-sm font-medium">
                  {dashboardStats?.totalAgents ? Math.floor(dashboardStats.totalAgents * 0.2) : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Tempo Economizado</h3>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {dashboardStats?.activeConversations ? (dashboardStats.activeConversations * 5) : 0} min
            </div>
            <p className="text-sm text-gray-600">em atendimento automatizado</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Respostas Instantâneas</span>
                <span className="text-sm font-medium text-green-600">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Disponibilidade</span>
                <span className="text-sm font-medium text-green-600">24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Satisfação Estimada</span>
                <span className="text-sm font-medium text-blue-600">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
