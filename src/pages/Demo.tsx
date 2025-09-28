import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, MessageSquare, BarChart, Calendar, Clock, CheckCircle, AlertCircle, DollarSign, Target,
  Home, Settings, Menu, X, Phone, Mail, Star, TrendingUp, Zap, User, Building, MapPin,
  Users, ArrowLeft, Bell, Plus
} from 'lucide-react';

const Demo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'agents', name: 'Agentes', icon: Bot, color: 'text-green-500' },
    { id: 'crm', name: 'CRM Automático', icon: Building, color: 'text-purple-500' },
    { id: 'leads', name: 'Leads', icon: Users, color: 'text-cyan-500' },
    { id: 'conversations', name: 'Conversas', icon: MessageSquare, color: 'text-orange-500' },
    { id: 'integrations', name: 'Integrações', icon: Zap, color: 'text-yellow-500' },
    { id: 'affiliate', name: 'Seja Representante', icon: Target, color: 'text-pink-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-gray-400">Visão geral dos seus agentes de IA</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-400" />
                </div>
                <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Últimos 30 dias
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agente
                </Button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total de Leads</p>
                      <p className="text-4xl font-bold text-white">0</p>
                      <p className="text-gray-500 text-sm mt-1">Leads captados nos últimos 30 dias</p>
                      <p className="text-gray-500 text-sm mt-2">0% vs último período</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Mensagens</p>
                      <p className="text-4xl font-bold text-white">0</p>
                      <p className="text-gray-500 text-sm mt-1">Mensagens enviadas nos últimos 30 dias</p>
                      <p className="text-gray-500 text-sm mt-2">0% vs último período</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Taxa de Conversão</p>
                      <p className="text-4xl font-bold text-white">0%</p>
                      <p className="text-gray-500 text-sm mt-1">Taxa média de conversão</p>
                      <p className="text-gray-500 text-sm mt-2">0% vs último período</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Agentes Ativos</p>
                      <p className="text-4xl font-bold text-white">0</p>
                      <p className="text-gray-500 text-sm mt-1">Agentes em funcionamento</p>
                    </div>
                    <Bot className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Análise Comparativa Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Análise Comparativa de Segmento</h3>
                      <p className="text-gray-400 text-sm">Inteligência do Genius AI com benchmarks dinâmicos do seu setor</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <BarChart className="mr-2 h-4 w-4" />
                    Atualização automática a cada 30s
                  </div>
                </div>
                
                <div className="flex items-center justify-center h-32">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    <span className="text-gray-400">Processando interações do seu segmento...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-white mb-2">Em Breve</h3>
              <p className="text-gray-400">Esta seção estará disponível em breve.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Top Demo Banner */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 z-50">
        <p className="text-sm font-medium">MODO DEMONSTRAÇÃO - Todos os dados são fictícios para demonstração</p>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-800 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full pt-16"> {/* Added pt-16 to account for demo banner */}
          {/* Logo */}
          <div className="flex items-center px-6 py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Converta+</h1>
                <p className="text-gray-400 text-xs">Agentes IA para Conversão</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Dark mode toggle */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300 text-sm">Modo Demonstração</span>
              <div className="w-8 h-4 bg-purple-600 rounded-full flex items-center">
                <div className="w-3 h-3 bg-white rounded-full ml-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 mt-12"> {/* Added mt-12 for demo banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-4 text-gray-300 hover:text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Demo;