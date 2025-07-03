
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, MessageSquare, BarChart3, Zap, Users, Shield, ArrowLeft, 
  Home, Settings, Menu, X, Phone, Mail, Star, TrendingUp,
  Calendar, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

const Demo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'agents', name: 'Agentes IA', icon: Bot },
    { id: 'conversations', name: 'Conversas', icon: MessageSquare },
    { id: 'crm', name: 'CRM', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Configurações', icon: Settings },
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
    ]
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
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-gray-800 border-r border-gray-700 flex flex-col`}>
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
                  <item.icon className="h-5 w-5" />
                  {sidebarOpen && <span>{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
