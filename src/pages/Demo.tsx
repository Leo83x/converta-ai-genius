
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, MessageSquare, BarChart3, Zap, Users, Shield, ArrowLeft, 
  Home, Settings, Menu, X, Phone, Mail, Star, TrendingUp,
  Calendar, Clock, CheckCircle, AlertCircle, DollarSign, Target
} from 'lucide-react';

const Demo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'agents', name: 'Agentes IA', icon: Bot, color: 'text-green-500' },
    { id: 'conversations', name: 'Conversas', icon: MessageSquare, color: 'text-purple-500' },
    { id: 'crm', name: 'CRM', icon: Users, color: 'text-orange-500' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-yellow-500' },
    { id: 'affiliate', name: 'Painel do Representante', icon: Target, color: 'text-pink-500' },
    { id: 'settings', name: 'Configurações', icon: Settings, color: 'text-gray-500' },
  ];

  const mockData = {
    stats: [
      { title: 'Leads Captados', value: '1,247', change: '+12%', icon: Users },
      { title: 'Taxa de Conversão', value: '68%', change: '+8%', icon: TrendingUp },
      { title: 'Conversas Ativas', value: '89', change: '+23%', icon: MessageSquare },
      { title: 'Agentes Ativos', value: '5', change: '0%', icon: Bot },
    ],
    leads: [
      { name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', score: 95, status: 'hot' },
      { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 88888-8888', score: 78, status: 'warm' },
      { name: 'Pedro Costa', email: 'pedro@email.com', phone: '(11) 77777-7777', score: 45, status: 'cold' },
    ],
    conversations: [
      { contact: 'Ana Lima', lastMessage: 'Gostaria de saber mais sobre os preços...', time: '2 min', status: 'active' },
      { contact: 'Carlos Souza', lastMessage: 'Quando podemos agendar uma demonstração?', time: '15 min', status: 'pending' },
      { contact: 'Lucia Ferreira', lastMessage: 'Obrigada pelas informações!', time: '1h', status: 'completed' },
    ],
    crmData: [
      { name: 'Roberto Silva', email: 'roberto@empresa.com', stage: 'Qualificado', value: 'R$ 2.500', source: 'WhatsApp' },
      { name: 'Fernanda Costa', email: 'fernanda@negocio.com', stage: 'Proposta', value: 'R$ 1.800', source: 'Instagram' },
      { name: 'Ricardo Santos', email: 'ricardo@startup.com', stage: 'Negociação', value: 'R$ 3.200', source: 'Website' },
      { name: 'Patricia Lima', email: 'patricia@loja.com', stage: 'Fechamento', value: 'R$ 4.100', source: 'WhatsApp' },
    ],
    affiliateData: {
      totalCommissions: 'R$ 8.450,00',
      thisMonth: 'R$ 1.200,00',
      sales: 23,
      conversion: '15%',
      recentSales: [
        { client: 'Empresa ABC Ltda', plan: 'Anual', commission: 'R$ 389,10', date: '01/12/2024' },
        { client: 'Consultoria XYZ', plan: 'Mensal', commission: 'R$ 38,70', date: '30/11/2024' },
        { client: 'Loja Virtual 123', plan: 'Anual', commission: 'R$ 389,10', date: '28/11/2024' },
      ]
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
              <p className="text-gray-400">Visão geral do seu desempenho</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockData.stats.map((stat, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-green-400 text-sm">{stat.change}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Leads Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.leads.map((lead, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{lead.name}</p>
                          <p className="text-gray-400 text-sm">{lead.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-sm">Score: {lead.score}</span>
                          <div className={`w-3 h-3 rounded-full ${
                            lead.status === 'hot' ? 'bg-red-500' : 
                            lead.status === 'warm' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Conversas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.conversations.map((conv, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{conv.contact[0]}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{conv.contact}</p>
                          <p className="text-gray-400 text-sm">{conv.lastMessage}</p>
                          <p className="text-gray-500 text-xs">{conv.time}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          conv.status === 'active' ? 'bg-green-500' : 
                          conv.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'crm':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">CRM</h2>
              <p className="text-gray-400">Gerencie seus leads e oportunidades</p>
            </div>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pipeline de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.crmData.map((lead, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{lead.name}</h3>
                        <p className="text-gray-400 text-sm">{lead.email}</p>
                        <p className="text-gray-500 text-xs">Origem: {lead.source}</p>
                      </div>
                      <div className="text-center">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          lead.stage === 'Qualificado' ? 'bg-blue-900 text-blue-300' :
                          lead.stage === 'Proposta' ? 'bg-yellow-900 text-yellow-300' :
                          lead.stage === 'Negociação' ? 'bg-orange-900 text-orange-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {lead.stage}
                        </span>
                        <p className="text-white font-bold mt-1">{lead.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
              <p className="text-gray-400">Métricas detalhadas de performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-2">Conversão por Canal</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">WhatsApp</span>
                        <span className="text-green-400">72%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Instagram</span>
                        <span className="text-yellow-400">58%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Website</span>
                        <span className="text-blue-400">65%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-2">Horários de Pico</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">09h - 12h</span>
                        <span className="text-green-400">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">14h - 17h</span>
                        <span className="text-yellow-400">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">19h - 22h</span>
                        <span className="text-blue-400">20%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-2">Tempo Médio de Resposta</h3>
                    <div className="space-y-3">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-purple-400">2.3</span>
                        <p className="text-gray-400">segundos</p>
                      </div>
                      <div className="text-green-400 text-sm">
                        ↑ 15% melhor que o mês anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'affiliate':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Painel do Representante</h2>
              <p className="text-gray-400">Suas comissões e vendas como representante</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Total de Comissões</p>
                    <p className="text-2xl font-bold text-white">{mockData.affiliateData.totalCommissions}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Este Mês</p>
                    <p className="text-2xl font-bold text-white">{mockData.affiliateData.thisMonth}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Vendas Realizadas</p>
                    <p className="text-2xl font-bold text-white">{mockData.affiliateData.sales}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-white">{mockData.affiliateData.conversion}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Vendas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.affiliateData.recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">{sale.client}</h3>
                        <p className="text-gray-400 text-sm">Plano {sale.plan}</p>
                        <p className="text-gray-500 text-xs">{sale.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{sale.commission}</p>
                        <p className="text-gray-400 text-sm">Comissão</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Configurações</h2>
              <p className="text-gray-400">Personalize sua experiência</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Configurações de Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Nome da Empresa</label>
                    <p className="text-white bg-gray-700 p-2 rounded">Minha Empresa Ltda</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email Principal</label>
                    <p className="text-white bg-gray-700 p-2 rounded">admin@minhaempresa.com</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Plano Atual</label>
                    <p className="text-purple-400 bg-gray-700 p-2 rounded">Plano Anual - R$ 1.297/ano</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Integrações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">WhatsApp Business</p>
                      <p className="text-gray-400 text-sm">Conectado</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Instagram</p>
                      <p className="text-gray-400 text-sm">Conectado</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Messenger</p>
                      <p className="text-gray-400 text-sm">Desconectado</p>
                    </div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Agentes de IA</h2>
              <p className="text-gray-400">Gerencie seus agentes inteligentes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Agente Vendas', channel: 'WhatsApp', status: 'Ativo', conversations: 45 },
                { name: 'Agente Suporte', channel: 'Instagram', status: 'Ativo', conversations: 23 },
                { name: 'Agente Qualificação', channel: 'Website', status: 'Pausado', conversations: 12 },
              ].map((agent, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Bot className="h-8 w-8 text-purple-400" />
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        agent.status === 'Ativo' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{agent.name}</h3>
                    <p className="text-gray-400 mb-4">Canal: {agent.channel}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">{agent.conversations} conversas</span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Configurar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'conversations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Conversas</h2>
              <p className="text-gray-400">Todas as interações com leads</p>
            </div>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-700">
                  {[
                    { name: 'Roberto Lima', message: 'Olá! Gostaria de conhecer melhor a solução...', time: '14:30', channel: 'WhatsApp', unread: true },
                    { name: 'Fernanda Costa', message: 'Qual o valor do plano anual?', time: '14:15', channel: 'Instagram', unread: false },
                    { name: 'Ricardo Santos', message: 'Podem me enviar mais informações por email?', time: '13:45', channel: 'Website', unread: false },
                    { name: 'Julia Oliveira', message: 'Obrigada pelo atendimento!', time: '13:20', channel: 'WhatsApp', unread: false },
                  ].map((conv, index) => (
                    <div key={index} className="p-4 hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{conv.name[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-medium ${conv.unread ? 'text-white' : 'text-gray-300'}`}>
                              {conv.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">{conv.time}</span>
                              {conv.unread && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                            </div>
                          </div>
                          <p className={`text-sm ${conv.unread ? 'text-gray-300' : 'text-gray-400'}`}>
                            {conv.message}
                          </p>
                          <span className="text-xs text-purple-400 mt-1">{conv.channel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Em Breve</h2>
              <p className="text-gray-400">Esta funcionalidade estará disponível em breve</p>
            </div>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Funcionalidade em Desenvolvimento</h3>
                <p className="text-gray-400">Estamos trabalhando para trazer esta funcionalidade para você</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex w-full overflow-x-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-gray-800 border-r border-gray-700 flex flex-col flex-shrink-0`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <img 
                src="/lovable-uploads/b5be6410-a8c5-4f8d-9eb5-a979ed0ffe83.png" 
                alt="Converta+" 
                className="h-8 w-8"
              />
              {sidebarOpen && (
                <span className="text-xl font-bold text-white">Converta+</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  } ${!sidebarOpen && 'justify-center'}`}
                >
                  <item.icon className={`h-5 w-5 ${
                    activeTab === item.id ? 'text-white' : item.color
                  }`} />
                  {sidebarOpen && <span>{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Demo - Converta+</h1>
              <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                Demonstração
              </span>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-purple-400/50 text-purple-200 bg-purple-800/30 hover:bg-purple-700/50 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Demo;
