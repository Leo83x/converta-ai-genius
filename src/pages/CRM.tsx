
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, TrendingUp, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CRM = () => {
  const leads = [
    {
      id: 1,
      name: 'João Silva',
      phone: '+55 11 99999-9999',
      email: 'joao@email.com',
      source: 'WhatsApp',
      status: 'new',
      score: 85
    },
    {
      id: 2,
      name: 'Maria Santos',
      phone: '+55 11 88888-8888',
      email: 'maria@email.com',
      source: 'Instagram',
      status: 'qualified',
      score: 92
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'qualified': return 'Qualificado';
      case 'contacted': return 'Contatado';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
            <p className="text-gray-600 mt-2">Gerencie seus leads e contatos</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Leads</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Qualificados</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Contato</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <Phone className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa Conversão</p>
                  <p className="text-2xl font-bold">36%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{lead.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-gray-500">{lead.phone}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{lead.source}</Badge>
                    <Badge className={getStatusColor(lead.status)}>
                      {getStatusText(lead.status)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">Score: {lead.score}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CRM;
