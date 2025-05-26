
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Link as LinkIcon, Smartphone, Instagram, MessageCircle, Globe } from 'lucide-react';

const Integrations = () => {
  const integrations = [
    {
      id: 1,
      name: 'WhatsApp Business',
      icon: Smartphone,
      status: 'connected',
      description: 'Conecte seus agentes ao WhatsApp Business',
      color: 'text-green-600'
    },
    {
      id: 2,
      name: 'Instagram Direct',
      icon: Instagram,
      status: 'disconnected',
      description: 'Responda mensagens diretas do Instagram',
      color: 'text-pink-600'
    },
    {
      id: 3,
      name: 'Facebook Messenger',
      icon: MessageCircle,
      status: 'connected',
      description: 'Gerencie conversas do Messenger',
      color: 'text-blue-600'
    },
    {
      id: 4,
      name: 'Widget do Site',
      icon: Globe,
      status: 'connected',
      description: 'Chat widget para seu website',
      color: 'text-purple-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
            <p className="text-gray-600 mt-2">Conecte seus canais de comunicação</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`h-6 w-6 ${integration.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {getStatusText(integration.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    {integration.status === 'connected' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="mr-2 h-4 w-4" />
                          Configurar
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1">
                          Desconectar
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" size="sm">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Conectar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Como Conectar suas Integrações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Escolha sua Integração</h4>
                  <p className="text-sm text-gray-600">Selecione o canal que deseja conectar (WhatsApp, Instagram, etc.)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Configure as Credenciais</h4>
                  <p className="text-sm text-gray-600">Forneça as chaves de API e tokens necessários</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Teste a Conexão</h4>
                  <p className="text-sm text-gray-600">Envie uma mensagem de teste para verificar se tudo está funcionando</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Integrations;
