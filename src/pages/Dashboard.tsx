
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import QuickActions from '@/components/QuickActions';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const isMobile = useIsMobile();

  // Dados zerados para novos usuários
  const stats = [
    {
      title: "Leads Gerados",
      value: "0",
      change: "0%",
      changeType: "neutral" as const,
      description: "vs. mês anterior"
    },
    {
      title: "Conversas Ativas",
      value: "0",
      change: "0%",
      changeType: "neutral" as const,
      description: "últimas 24h"
    },
    {
      title: "Taxa de Conversão",
      value: "0%",
      change: "0%",
      changeType: "neutral" as const,
      description: "vs. mês anterior"
    },
    {
      title: "Tokens Utilizados",
      value: "0",
      change: "0%",
      changeType: "neutral" as const,
      description: "do limite mensal"
    }
  ];

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
