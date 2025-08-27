import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, ArrowLeft, Smartphone, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import WhatsAppConnectionDialog from '@/components/WhatsAppConnectionDialog';
import ZApiInstanceCard from '@/components/ZApiInstanceCard';

interface ZApiInstance {
  id: string;
  instance_id: string;
  api_token: string;
  signed: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const ZApiManagement = () => {
  const [instances, setInstances] = useState<ZApiInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadInstances();
  }, [user]);

  const loadInstances = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstances(data || []);
    } catch (error) {
      console.error('Error loading instances:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as instâncias Z-API.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInstance = async (instanceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('zapi-get-qrcode', {
        body: { instanceId }
      });

      if (error) throw error;

      toast({
        title: "Status Atualizado",
        description: data.status === 'connected' 
          ? "Instância conectada com sucesso!"
          : "Status da instância foi atualizado.",
      });

      await loadInstances();
    } catch (error) {
      console.error('Error refreshing instance:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a instância.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnectInstance = async (instance: ZApiInstance) => {
    try {
      // Aqui você implementaria a lógica de desconexão Z-API
      // Por enquanto, vamos apenas remover do banco
      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instance.id);

      if (error) throw error;

      toast({
        title: "Instância Removida",
        description: "A instância Z-API foi removida com sucesso.",
      });

      await loadInstances();
    } catch (error) {
      console.error('Error disconnecting instance:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a instância.",
        variant: "destructive"
      });
    }
  };

  const handleTestInstance = async (instance: ZApiInstance) => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-send-message', {
        body: {
          instanceId: instance.instance_id,
          to: '5511999999999', // Número de teste
          message: 'Teste de conexão Z-API - ConvertaMais'
        }
      });

      if (error) throw error;

      toast({
        title: "Teste Enviado",
        description: "Mensagem de teste enviada com sucesso!",
      });
    } catch (error) {
      console.error('Error testing instance:', error);
      toast({
        title: "Erro no Teste",
        description: "Não foi possível enviar a mensagem de teste.",
        variant: "destructive"
      });
    }
  };

  const handleConnectionSuccess = () => {
    loadInstances();
    setConnectionDialogOpen(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/integrations')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestão Z-API</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas instâncias WhatsApp via Z-API
              </p>
            </div>
          </div>
          <Button onClick={() => setConnectionDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Instância
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Modo Desenvolvimento:</strong> Você está utilizando a Z-API em modo de desenvolvimento. 
            As instâncias criadas são apenas para teste e podem ter limitações.
          </AlertDescription>
        </Alert>

        {/* Instances Grid */}
        {instances.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma Instância Encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira instância Z-API para começar a usar o WhatsApp Business
              </p>
              <Button onClick={() => setConnectionDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Instância
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instances.map((instance) => (
              <ZApiInstanceCard
                key={instance.id}
                instance={{
                  id: instance.id,
                  instanceId: instance.instance_id,
                  signed: instance.signed,
                  status: instance.status,
                  created_at: instance.created_at
                }}
                onRefresh={() => handleRefreshInstance(instance.instance_id)}
                onDisconnect={() => handleDisconnectInstance(instance)}
                onTest={() => handleTestInstance(instance)}
              />
            ))}
          </div>
        )}

        {/* Statistics */}
        {instances.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Estatísticas das Instâncias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {instances.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total de Instâncias
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {instances.filter(i => i.status === 'connected').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Conectadas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {instances.filter(i => i.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pendentes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {instances.filter(i => i.signed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Assinadas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Dialog */}
        <WhatsAppConnectionDialog
          open={connectionDialogOpen}
          onOpenChange={setConnectionDialogOpen}
          onSuccess={handleConnectionSuccess}
        />
      </div>
    </Layout>
  );
};

export default ZApiManagement;