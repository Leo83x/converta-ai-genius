
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for admin dashboard
  const platformStats = {
    totalUsers: 156,
    activeConnections: 89,
    totalAgents: 432,
    monthlyMessages: 15420
  };

  const users = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@empresa.com",
      phone: "(11) 99999-9999",
      createdAt: "2024-01-15",
      status: "active",
      agents: 3,
      whatsappStatus: "connected",
      instagramStatus: "disconnected",
      messengerStatus: "connected",
      monthlyMessages: 245
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@loja.com",
      phone: "(11) 88888-8888",
      createdAt: "2024-02-20",
      status: "active",
      agents: 5,
      whatsappStatus: "connected",
      instagramStatus: "connected",
      messengerStatus: "disconnected",
      monthlyMessages: 432
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@negocio.com",
      phone: "(11) 77777-7777",
      createdAt: "2024-03-10",
      status: "inactive",
      agents: 1,
      whatsappStatus: "disconnected",
      instagramStatus: "disconnected",
      messengerStatus: "disconnected",
      monthlyMessages: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: "bg-green-100 text-green-800",
      disconnected: "bg-red-100 text-red-800",
      active: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === 'connected' ? 'Conectado' : 
         status === 'disconnected' ? 'Desconectado' :
         status === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Converta+ Admin
              </h1>
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                Painel Administrativo
              </Badge>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Sair do Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Master</h2>
          <p className="text-gray-600">Monitore todos os usuários e métricas da plataforma</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-3xl font-bold text-gray-900">{platformStats.totalUsers}</p>
                </div>
                <div className="text-2xl text-purple-600">👥</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conexões Ativas</p>
                  <p className="text-3xl font-bold text-gray-900">{platformStats.activeConnections}</p>
                </div>
                <div className="text-2xl text-green-600">🔗</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Agentes</p>
                  <p className="text-3xl font-bold text-gray-900">{platformStats.totalAgents}</p>
                </div>
                <div className="text-2xl text-blue-600">🤖</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mensagens/Mês</p>
                  <p className="text-3xl font-bold text-gray-900">{platformStats.monthlyMessages.toLocaleString()}</p>
                </div>
                <div className="text-2xl text-orange-600">💬</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Visualize e monitore todos os usuários da plataforma
            </CardDescription>
            <div className="pt-4">
              <Input
                placeholder="Buscar usuários por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(user.status)}
                      <p className="text-sm text-gray-500 mt-1">Desde {user.createdAt}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Agentes</p>
                      <p className="text-lg font-semibold text-gray-900">{user.agents}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">WhatsApp</p>
                      {getStatusBadge(user.whatsappStatus)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Instagram</p>
                      {getStatusBadge(user.instagramStatus)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Messenger</p>
                      {getStatusBadge(user.messengerStatus)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mensagens/Mês</p>
                      <p className="text-lg font-semibold text-gray-900">{user.monthlyMessages}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Leads
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Agentes
                    </Button>
                    <Button variant="outline" size="sm">
                      Configurações
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
