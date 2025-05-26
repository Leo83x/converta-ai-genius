
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import QuickActions from '@/components/QuickActions';

const Dashboard = () => {
  const stats = [
    {
      title: "Leads Gerados",
      value: "247",
      change: "+12%",
      changeType: "increase" as const,
      description: "vs. mês anterior"
    },
    {
      title: "Conversas Ativas",
      value: "32",
      change: "+5%",
      changeType: "increase" as const,
      description: "últimas 24h"
    },
    {
      title: "Taxa de Conversão",
      value: "8.4%",
      change: "+2.1%",
      changeType: "increase" as const,
      description: "vs. mês anterior"
    },
    {
      title: "Tokens Utilizados",
      value: "85.2K",
      change: "15%",
      changeType: "neutral" as const,
      description: "do limite mensal"
    }
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta! Aqui está um resumo da sua atividade.</p>
        </div>
        
        <QuickActions />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
