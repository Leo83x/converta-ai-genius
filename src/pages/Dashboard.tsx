
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import GeniusAgent from '@/components/GeniusAgent';
import StatsCard from '@/components/StatsCard';
import QuickActions from '@/components/QuickActions';

const Dashboard = () => {
  const [showGenius, setShowGenius] = useState(false);
  const { toast } = useToast();

  const stats = [
    {
      title: "Leads Gerados",
      value: "142",
      change: "+12%",
      changeType: "increase" as const,
      description: "Últimos 30 dias"
    },
    {
      title: "Conversas Ativas",
      value: "28",
      change: "+8%",
      changeType: "increase" as const,
      description: "Neste momento"
    },
    {
      title: "Canais Conectados",
      value: "3",
      change: "0%",
      changeType: "neutral" as const,
      description: "WhatsApp, Instagram, Widget"
    },
    {
      title: "Agentes Criados",
      value: "5",
      change: "+2",
      changeType: "increase" as const,
      description: "Total de agentes"
    }
  ];

  const agents = [
    {
      id: 1,
      name: "Agente Vendas",
      objective: "Captar leads qualificados",
      channel: "WhatsApp",
      status: "Ativo",
      messages: 45
    },
    {
      id: 2,
      name: "Atendimento",
      objective: "Suporte ao cliente",
      channel: "Widget",
      status: "Ativo",
      messages: 23
    },
    {
      id: 3,
      name: "Instagram Bot",
      objective: "Engajamento social",
      channel: "Instagram",
      status: "Pausado",
      messages: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Converta+
              </h1>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Assinante Ativo
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, João Silva</span>
              <Button variant="outline" size="sm">
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Monitore seus agentes e performance em tempo real</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Agents Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Meus Agentes</CardTitle>
            <CardDescription>
              Gerencie seus agentes de IA personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {agent.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.objective}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{agent.channel}</Badge>
                    <Badge 
                      variant={agent.status === 'Ativo' ? 'default' : 'secondary'}
                      className={agent.status === 'Ativo' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {agent.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{agent.messages} msgs</span>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Genius Button */}
      <Button
        onClick={() => setShowGenius(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg z-50"
        size="icon"
      >
        ✨
      </Button>

      {/* Genius Agent Modal */}
      <GeniusAgent isOpen={showGenius} onClose={() => setShowGenius(false)} />
    </div>
  );
};

export default Dashboard;
