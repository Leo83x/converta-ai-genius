import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bot, Plus, Link, Unlink } from 'lucide-react';

interface CampaignAgentIntegrationProps {
  campaignId: string;
  campaignName: string;
}

const CampaignAgentIntegration = ({ campaignId, campaignName }: CampaignAgentIntegrationProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  const { data: agents } = useQuery({
    queryKey: ['agents', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: campaignAgents } = useQuery({
    queryKey: ['campaign-agents', campaignId],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data } = await supabase
        .from('agents')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id);

      return data || [];
    },
    enabled: !!user?.id && !!campaignId
  });

  const linkAgentMutation = useMutation({
    mutationFn: async (agentId: string) => {
      const { error } = await supabase
        .from('agents')
        .update({ campaign_id: campaignId })
        .eq('id', agentId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Agent vinculado à campanha!');
      queryClient.invalidateQueries({ queryKey: ['campaign-agents', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] });
      setSelectedAgentId('');
    },
    onError: (error) => {
      toast.error('Erro ao vincular agent: ' + error.message);
    }
  });

  const unlinkAgentMutation = useMutation({
    mutationFn: async (agentId: string) => {
      const { error } = await supabase
        .from('agents')
        .update({ campaign_id: null })
        .eq('id', agentId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Agent desvinculado da campanha!');
      queryClient.invalidateQueries({ queryKey: ['campaign-agents', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] });
    },
    onError: (error) => {
      toast.error('Erro ao desvincular agent: ' + error.message);
    }
  });

  const createCampaignAgentMutation = useMutation({
    mutationFn: async () => {
      const agentName = `Agent - ${campaignName}`;
      const systemPrompt = `Você é um assistente especializado na campanha "${campaignName}". 
Sua função é qualificar leads e responder dúvidas relacionadas a esta campanha específica.

Características da campanha:
- Nome: ${campaignName}
- Objetivo: Qualificar leads interessados
- Tone: Profissional e amigável

Instruções:
1. Seja educado e prestativo
2. Faça perguntas qualificadoras relevantes
3. Identifique o interesse e necessidades do lead
4. Encaminhe leads qualificados para atendimento humano quando apropriado
5. Mantenha o foco nos objetivos da campanha`;

      const { data, error } = await supabase
        .from('agents')
        .insert({
          name: agentName,
          user_id: user?.id,
          campaign_id: campaignId,
          system_prompt: systemPrompt,
          channel: 'campaign',
          active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Agent da campanha criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['campaign-agents', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] });
    },
    onError: (error) => {
      toast.error('Erro ao criar agent: ' + error.message);
    }
  });

  const availableAgents = agents?.filter(agent => !agent.campaign_id) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Agents da Campanha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agents vinculados */}
        <div>
          <h4 className="font-medium mb-2">Agents Vinculados</h4>
          <div className="space-y-2">
            {campaignAgents?.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span className="font-medium">{agent.name}</span>
                  <Badge variant={agent.active ? "default" : "secondary"}>
                    {agent.active ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline">{agent.channel}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => unlinkAgentMutation.mutate(agent.id)}
                  disabled={unlinkAgentMutation.isPending}
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Desvincular
                </Button>
              </div>
            )) || <p className="text-muted-foreground">Nenhum agent vinculado</p>}
          </div>
        </div>

        {/* Vincular agent existente */}
        <div>
          <h4 className="font-medium mb-2">Vincular Agent Existente</h4>
          <div className="flex gap-2">
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um agent" />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.channel})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => linkAgentMutation.mutate(selectedAgentId)}
              disabled={!selectedAgentId || linkAgentMutation.isPending}
            >
              <Link className="h-4 w-4 mr-1" />
              Vincular
            </Button>
          </div>
        </div>

        {/* Criar novo agent para campanha */}
        <div>
          <h4 className="font-medium mb-2">Criar Agent Específico</h4>
          <Button
            onClick={() => createCampaignAgentMutation.mutate()}
            disabled={createCampaignAgentMutation.isPending}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Agent para esta Campanha
          </Button>
          <p className="text-sm text-muted-foreground mt-1">
            Cria um agent otimizado especificamente para esta campanha
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignAgentIntegration;