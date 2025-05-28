
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Link as LinkIcon, Smartphone, Instagram, MessageCircle, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WhatsAppConnectionDialog from '@/components/WhatsAppConnectionDialog';
import InstagramConnectionDialog from '@/components/InstagramConnectionDialog';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'WhatsApp Business',
      icon: Smartphone,
      status: 'disconnected',
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
      status: 'disconnected',
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
  ]);

  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [instagramDialogOpen, setInstagramDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkIntegrationStatuses();
    }
  }, [user]);

  const checkIntegrationStatuses = async () => {
    try {
      // Verificar status do WhatsApp
      const { data: whatsappTokens } = await supabase
        .from('evolution_tokens')
        .select('status')
        .eq('user_id', user?.id)
        .eq('status', 'connected');

      // Verificar status do Instagram/Meta
      const { data: metaConnections } = await supabase
        .from('meta_connections')
        .select('channel_type')
        .eq('user_id', user?.id);

      setIntegrations(prev => prev.map(integration => {
        if (integration.name === 'WhatsApp Business') {
          return { 
            ...integration, 
            status: whatsappTokens && whatsappTokens.length > 0 ? 'connected' : 'disconnected' 
          };
        }
        if (integration.name === 'Instagram Direct') {
          const instagramConnected = metaConnections?.some(conn => conn.channel_type === 'instagram');
          return { 
            ...integration, 
            status: instagramConnected ? 'connected' : 'disconnected' 
          };
        }
        if (integration.name === 'Facebook Messenger') {
          const messengerConnected = metaConnections?.some(conn => conn.channel_type === 'messenger');
          return { 
            ...integration, 
            status: messengerConnected ? 'connected' : 'disconnected' 
          };
        }
        return integration;
      }));
    } catch (error) {
      console.error('Error checking integration statuses:', error);
    }
  };

  const handleConnect = (integrationName: string) => {
    switch (integrationName) {
      case 'WhatsApp Business':
        setWhatsappDialogOpen(true);
        break;
      case 'Instagram Direct':
        setInstagramDialogOpen(true);
        break;
      case 'Facebook Messenger':
        connectFacebookMessenger();
        break;
      case 'Widget do Site':
        navigate('/channels/widget');
        break;
    }
  };

  const handleConfigure = (integrationName: string) => {
    switch (integrationName) {
      case 'WhatsApp Business':
        navigate('/channels/whatsapp');
        break;
      case 'Instagram Direct':
        navigate('/channels/instagram');
        break;
      case 'Facebook Messenger':
        toast({
          title: "Em desenvolvimento",
          description: "Configuração do Facebook Messenger em breve.",
        });
        break;
      case 'Widget do Site':
        navigate('/channels/widget');
        break;
    }
  };

  const handleDisconnect = async (integrationName: string) => {
    try {
      if (integrationName === 'WhatsApp Business') {
        // Buscar sessões ativas
        const { data: tokens } = await supabase
          .from('evolution_tokens')
          .select('session_name')
          .eq('user_id', user?.id)
          .eq('status', 'connected');

        if (tokens && tokens.length > 0) {
          for (const token of tokens) {
            await supabase.functions.invoke('whatsapp-disconnect', {
              body: { sessionName: token.session_name }
            });
          }
        }
      } else if (integrationName === 'Instagram Direct' || integrationName === 'Facebook Messenger') {
        const channelType = integrationName === 'Instagram Direct' ? 'instagram' : 'messenger';
        await supabase
          .from('meta_connections')
          .delete()
          .eq('user_id', user?.id)
          .eq('channel_type', channelType);
      } else if (integrationName === 'Widget do Site') {
        // Para o widget do site, apenas mostrar uma mensagem informativa
        toast({
          title: "Widget desabilitado",
          description: "O widget do site foi desabilitado. Você pode reativá-lo a qualquer momento.",
        });
        
        // Atualizar o status local do widget para desconectado
        setIntegrations(prev => prev.map(integration => 
          integration.name === 'Widget do Site' 
            ? { ...integration, status: 'disconnected' }
            : integration
        ));
        return;
      }

      toast({
        title: "Integração desconectada",
        description: `${integrationName} foi desconectado com sucesso.`,
      });

      checkIntegrationStatuses();
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar a integração.",
        variant: "destructive"
      });
    }
  };

  const connectFacebookMessenger = () => {
    toast({
      title: "Facebook Messenger",
      description: "Redirecionando para autenticação do Facebook...",
    });
    // Implementar OAuth do Facebook
  };

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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleConfigure(integration.name)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Configurar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDisconnect(integration.name)}
                        >
                          Desconectar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleConnect(integration.name)}
                      >
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

        <WhatsAppConnectionDialog 
          open={whatsappDialogOpen}
          onOpenChange={setWhatsappDialogOpen}
          onSuccess={checkIntegrationStatuses}
        />

        <InstagramConnectionDialog 
          open={instagramDialogOpen}
          onOpenChange={setInstagramDialogOpen}
          onSuccess={checkIntegrationStatuses}
        />
      </div>
    </Layout>
  );
};

export default Integrations;
