import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, MessageSquare, BarChart, Calendar, Clock, CheckCircle, AlertCircle, DollarSign, Target,
  Home, Settings, Menu, X, Phone, Mail, Star, TrendingUp, Zap, User, Building, MapPin,
  Users, ArrowLeft, Bell, Plus, Search, Filter, MoreVertical, Download, RefreshCcw, ChevronDown, Tag
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

      case 'agents':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Meus Agentes</h2>
                <p className="text-gray-400">Gerencie e monitore seus agentes de IA</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Agente
              </Button>
            </div>
            
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar agentes..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>

            {/* Agent Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Agente ConvertaMais</h3>
                      <Badge className="bg-green-600 text-white text-xs px-2 py-1">Ativo</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Seu objetivo é fazer com que os leads tenham uma experiência de atendimento de IA como se fossem leads do próprio negócio.
                  </p>

                  {/* Agent Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-white font-bold">0</span>
                      </div>
                      <p className="text-gray-400 text-xs">Leads</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-white font-bold">0</span>
                      </div>
                      <p className="text-gray-400 text-xs">Conversas</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-white font-bold">0%</span>
                      </div>
                      <p className="text-gray-400 text-xs">Conversão</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-500 text-xs">Última atividade: 27-09-2025</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'crm':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">CRM</h2>
              <p className="text-gray-400">Gerencie seus leads e conversas</p>
            </div>
            
            {/* Search and Controls */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Todos os agentes</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Criar Lead
              </Button>
              <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Atualizar Posição dos Leads
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total de Leads</p>
                      <p className="text-4xl font-bold text-white">0</p>
                      <p className="text-gray-500 text-sm mt-1">Leads cadastrados</p>
                      <p className="text-red-400 text-sm mt-1">0%</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Agentes</p>
                      <p className="text-4xl font-bold text-white">1</p>
                      <p className="text-gray-500 text-sm mt-1">Agentes cadastrados</p>
                      <p className="text-red-400 text-sm mt-1">0%</p>
                    </div>
                    <Bot className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Mensagens</p>
                      <p className="text-4xl font-bold text-white">0</p>
                      <p className="text-gray-500 text-sm mt-1">Mensagens enviadas</p>
                      <p className="text-red-400 text-sm mt-1">0%</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Taxa de Conversão</p>
                      <p className="text-4xl font-bold text-white">0%</p>
                      <p className="text-gray-500 text-sm mt-1">Média geral</p>
                      <p className="text-red-400 text-sm mt-1">0%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Funil CP ConvertaMais</h3>
                  <p className="text-gray-400 text-sm">Gerencie seus leads através dos estágios do funil</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">
                    Modelo Padrão
                  </Button>
                  <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 text-sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Personalizar Estágios
                  </Button>
                </div>
              </div>

              {/* Pipeline Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="bg-gray-800 border-gray-700 border-t-4 border-t-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">Leads</h4>
                      <span className="text-2xl font-bold text-white">0</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Primeiro contato com leads frios aguardando abordagem inicial
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700 border-t-4 border-t-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">Contatados</h4>
                      <span className="text-2xl font-bold text-white">0</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Leads que já responderam e demonstraram interesse inicial nas soluções
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700 border-t-4 border-t-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">Qualificados</h4>
                      <span className="text-2xl font-bold text-white">0</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Oportunidades com perfil alinhado e informações completas para avançar
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700 border-t-4 border-t-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">Proposta</h4>
                      <span className="text-2xl font-bold text-white">0</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Negociação ativa com envio de proposta ou condições comerciais definidas
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700 border-t-4 border-t-indigo-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">Convertidos</h4>
                      <span className="text-2xl font-bold text-white">0</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Clientes fechados ou oportunidades concluídas aguardando onboarding
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'leads':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Leads</h2>
                <p className="text-gray-400">Gerencie seus clientes em um só lugar</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar lead
                </Button>
                <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar leads
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
                  />
                </div>
                
                <div className="relative">
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Atendente(s) IA</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>

              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Tag className="mr-2 h-4 w-4" />
                Adicionar tags em massa
              </Button>
            </div>

            {/* Table */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">
                          <input type="checkbox" className="rounded border-gray-600 bg-gray-800" />
                        </th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Nome</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Telefone</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Lead Score</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Tags</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Empty state - no leads */}
                      <tr>
                        <td colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center">
                            <Users className="h-12 w-12 text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Nenhum lead encontrado</h3>
                            <p className="text-gray-500 text-sm">Comece adicionando seus primeiros leads</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Integrações</h2>
              <p className="text-gray-400">Gerencie suas integrações e conexões</p>
            </div>

            {/* WhatsApp Integration */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Integração WhatsApp</h3>
                      <p className="text-gray-400 text-sm">Conecte seus agentes ao WhatsApp para conversas automáticas</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white px-3 py-1">
                    Conectado
                  </Badge>
                </div>

                {/* Success Message */}
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">WhatsApp conectado com sucesso!</span>
                  </div>
                  <p className="text-green-300 text-sm mt-1">
                    Seus agentes agora podem conversar automaticamente pelo WhatsApp.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                    Desconectar
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Testar Conexão
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Configurações Avançadas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <h4 className="text-white font-medium mb-2">Timeout de Resposta</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Tempo limite para resposta automática dos agentes
                    </p>
                    <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                      Configurar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <h4 className="text-white font-medium mb-2">Horário de Funcionamento</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Define quando os agentes devem estar ativos
                    </p>
                    <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                      Configurar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
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