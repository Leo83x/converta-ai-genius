
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const CreateAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    prompt: '',
    channel: '',
    routingNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um agente.",
        variant: "destructive"
      });
      return;
    }

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
      // Criar o agente
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          name: formData.name,
          channel: formData.channel,
          system_prompt: formData.prompt,
          active: true
        })
        .select()
        .single();

      if (agentError) throw agentError;

      // Se tiver routing number, criar o canal
      if (formData.routingNumber && agent) {
        const { error: channelError } = await supabase
          .from('agent_channels')
          .insert({
            agent_id: agent.id,
            channel_type: formData.channel,
            routing_number: formData.routingNumber
          });

        if (channelError) throw channelError;
      }

      toast({
        title: "Agente criado com sucesso!",
        description: `${formData.name} foi configurado e está pronto para uso.`,
      });
      
      navigate('/agents');
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agente. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Agente</h2>
          <p className="text-gray-600">Configure um agente de IA personalizado para suas necessidades</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do Agente</CardTitle>
            <CardDescription>
              Defina o comportamento e canal de atuação do seu agente
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
                  <Label htmlFor="objective">Objetivo *</Label>
                  <Select onValueChange={(value) => handleInputChange('objective', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead-capture">Captação de Leads</SelectItem>
                      <SelectItem value="customer-support">Atendimento ao Cliente</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="qualification">Qualificação de Leads</SelectItem>
                      <SelectItem value="engagement">Engajamento</SelectItem>
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
                <p className="text-sm text-gray-500">
                  Este prompt será usado com a OpenAI Assistant API. Seja específico sobre personalidade, conhecimento e objetivos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="channel">Canal de Atuação *</Label>
                  <Select onValueChange={(value) => handleInputChange('channel', value)}>
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

                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Número/ID do Canal</Label>
                  <Input
                    id="routingNumber"
                    placeholder="Ex: 5511999999999 ou @username"
                    value={formData.routingNumber}
                    onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Para WhatsApp use o número completo. Para redes sociais use @username ou ID da página.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isLoading ? "Criando Agente..." : "Criar Agente"}
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

export default CreateAgent;
