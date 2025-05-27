
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

interface Agent {
  id: string;
  name: string;
  channel: string;
  system_prompt: string;
  active: boolean;
}

interface AgentChannel {
  routing_number: string;
  channel_type: string;
}

const EditAgent = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentChannel, setAgentChannel] = useState<AgentChannel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    channel: '',
    routingNumber: '',
    active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAgent, setLoadingAgent] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id && user) {
      fetchAgent();
    }
  }, [id, user]);

  const fetchAgent = async () => {
    try {
      // Buscar agente
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (agentError) throw agentError;

      setAgent(agentData);
      setFormData({
        name: agentData.name || '',
        prompt: agentData.system_prompt || '',
        channel: agentData.channel || '',
        routingNumber: '',
        active: agentData.active
      });

      // Buscar canal do agente
      const { data: channelData, error: channelError } = await supabase
        .from('agent_channels')
        .select('*')
        .eq('agent_id', id)
        .maybeSingle();

      if (channelError && channelError.code !== 'PGRST116') {
        throw channelError;
      }

      if (channelData) {
        setAgentChannel(channelData);
        setFormData(prev => ({
          ...prev,
          routingNumber: channelData.routing_number || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar agente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do agente.",
        variant: "destructive"
      });
      navigate('/agents');
    } finally {
      setLoadingAgent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.prompt || !formData.channel) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Atualizar agente
      const { error: agentError } = await supabase
        .from('agents')
        .update({
          name: formData.name,
          channel: formData.channel,
          system_prompt: formData.prompt,
          active: formData.active
        })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (agentError) throw agentError;

      // Atualizar ou criar canal
      if (formData.routingNumber) {
        if (agentChannel) {
          // Atualizar canal existente
          const { error: updateChannelError } = await supabase
            .from('agent_channels')
            .update({
              channel_type: formData.channel,
              routing_number: formData.routingNumber
            })
            .eq('agent_id', id);

          if (updateChannelError) throw updateChannelError;
        } else {
          // Criar novo canal
          const { error: insertChannelError } = await supabase
            .from('agent_channels')
            .insert({
              agent_id: id,
              channel_type: formData.channel,
              routing_number: formData.routingNumber
            });

          if (insertChannelError) throw insertChannelError;
        }
      } else if (agentChannel) {
        // Remover canal se routing number foi removido
        const { error: deleteChannelError } = await supabase
          .from('agent_channels')
          .delete()
          .eq('agent_id', id);

        if (deleteChannelError) throw deleteChannelError;
      }

      toast({
        title: "Agente atualizado com sucesso!",
        description: `${formData.name} foi atualizado.`,
      });
      
      navigate('/agents');
    } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o agente. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loadingAgent) {
    return (
      <Layout>
        <div className="p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agente não encontrado</h2>
            <Button onClick={() => navigate('/agents')}>Voltar para Agentes</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Editar Agente</h2>
          <p className="text-gray-600">Atualize as configurações do seu agente de IA</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do Agente</CardTitle>
            <CardDescription>
              Modifique o comportamento e canal de atuação do seu agente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Agente *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Agente Vendas Pro"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel">Canal de Atuação *</Label>
                  <Select value={formData.channel} onValueChange={(value) => handleInputChange('channel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="messenger">Messenger</SelectItem>
                      <SelectItem value="widget">Widget do Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Personalizado *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Descreva como o agente deve se comportar, que tom usar, informações sobre sua empresa, produtos/serviços..."
                  value={formData.prompt}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routingNumber">Número/ID do Canal</Label>
                <Input
                  id="routingNumber"
                  placeholder="Ex: 5511999999999 ou @username"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/agents')}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditAgent;
