
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';

const Conversations = () => {
  const conversations = [
    {
      id: 1,
      contact: 'João Silva',
      channel: 'WhatsApp',
      lastMessage: 'Obrigado pela informação!',
      time: '2 min atrás',
      status: 'active',
      agent: 'Vendas WhatsApp'
    },
    {
      id: 2,
      contact: 'Maria Santos',
      channel: 'Instagram',
      lastMessage: 'Gostaria de mais detalhes sobre o produto',
      time: '15 min atrás',
      status: 'pending',
      agent: 'Suporte Instagram'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'pending': return 'Pendente';
      case 'closed': return 'Finalizada';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conversas</h1>
            <p className="text-gray-600 mt-2">Acompanhe todas as conversas ativas</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversas Ativas</p>
                  <p className="text-2xl font-bold">32</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Finalizadas Hoje</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>Conversas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{conversation.contact}</h3>
                      <p className="text-sm text-gray-500 max-w-md truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-400">Agente: {conversation.agent}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{conversation.channel}</Badge>
                    <Badge className={getStatusColor(conversation.status)}>
                      {getStatusText(conversation.status)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{conversation.time}</p>
                    </div>
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

export default Conversations;
