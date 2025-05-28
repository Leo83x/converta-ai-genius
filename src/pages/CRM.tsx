
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Phone, Kanban, List } from 'lucide-react';
import NewLeadDialog from '@/components/NewLeadDialog';
import KanbanBoard from '@/components/KanbanBoard';
import LeadsListView from '@/components/LeadsListView';
import PipelineStageConfig from '@/components/PipelineStageConfig';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CRM = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const { data: crmStats, isLoading } = useQuery({
    queryKey: ['crm-stats', user?.id, refreshTrigger],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      const totalLeads = leads?.length || 0;
      
      // Contar leads por estágio
      const qualified = leads?.filter(lead => lead.stage === 'qualified').length || 0;
      const contacted = leads?.filter(lead => 
        lead.stage === 'contacted' || lead.stage === 'proposal' || lead.stage === 'negotiation'
      ).length || 0;
      const won = leads?.filter(lead => lead.stage === 'won').length || 0;
      
      // Calcular taxa de conversão
      const conversionRate = totalLeads > 0 ? ((won / totalLeads) * 100) : 0;

      // Contar leads por canal
      const channelStats = {
        widget: leads?.filter(lead => 
          lead.source?.toLowerCase().includes('widget') || 
          lead.source?.toLowerCase().includes('site')
        ).length || 0,
        whatsapp: leads?.filter(lead => 
          lead.source?.toLowerCase().includes('whatsapp')
        ).length || 0,
        instagram: leads?.filter(lead => 
          lead.source?.toLowerCase().includes('instagram')
        ).length || 0
      };

      return {
        totalLeads,
        qualified,
        contacted,
        conversionRate: conversionRate.toFixed(1),
        channelStats
      };
    },
    enabled: !!user?.id,
    refetchInterval: 10000 // Atualiza a cada 10 segundos
  });

  const handleLeadCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStagesUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Função para criar leads automaticamente baseado nas conversas
  useEffect(() => {
    const createLeadsFromConversations = async () => {
      if (!user?.id) return;

      try {
        // Buscar conversas que ainda não geraram leads
        const { data: conversations } = await supabase
          .from('agent_conversations')
          .select(`
            *,
            agents!inner(
              user_id,
              channel,
              name
            )
          `)
          .eq('agents.user_id', user.id);

        if (!conversations || conversations.length === 0) return;

        for (const conversation of conversations) {
          // Verificar se já existe um lead para esta sessão
          const { data: existingLead } = await supabase
            .from('leads')
            .select('id')
            .eq('user_id', user.id)
            .ilike('notes', `%${conversation.user_session_id}%`)
            .maybeSingle();

          if (existingLead) continue; // Lead já existe

          // Extrair nome do usuário das mensagens (se disponível)
          let leadName = 'Lead Anônimo';
          let leadPhone = '';
          let leadEmail = '';

          try {
            const messages = typeof conversation.messages === 'string' 
              ? JSON.parse(conversation.messages) 
              : conversation.messages;

            if (Array.isArray(messages)) {
              // Tentar extrair informações das mensagens
              for (const message of messages) {
                if (message.role === 'user' && message.content) {
                  const content = message.content.toLowerCase();
                  
                  // Buscar por padrões de nome
                  const nameMatch = content.match(/(?:me chamo|meu nome é|sou|nome:|^|\s)([a-záêôçã\s]{2,30})(?:\s|$|\.|,)/i);
                  if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 2) {
                    leadName = nameMatch[1].trim();
                  }

                  // Buscar por telefone
                  const phoneMatch = content.match(/(\(?[0-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4})/);
                  if (phoneMatch) {
                    leadPhone = phoneMatch[1];
                  }

                  // Buscar por email
                  const emailMatch = content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                  if (emailMatch) {
                    leadEmail = emailMatch[1];
                  }
                }
              }
            }
          } catch (error) {
            console.error('Erro ao processar mensagens:', error);
          }

          // Determinar o canal baseado no agente
          let source = 'Conversa';
          const agentChannel = conversation.agents?.channel?.toLowerCase() || '';
          
          if (agentChannel.includes('widget') || agentChannel.includes('site')) {
            source = 'Widget do Site';
          } else if (agentChannel.includes('whatsapp')) {
            source = 'WhatsApp';
          } else if (agentChannel.includes('instagram')) {
            source = 'Instagram';
          }

          // Criar o lead
          const { error: insertError } = await supabase
            .from('leads')
            .insert({
              user_id: user.id,
              name: leadName,
              phone: leadPhone || null,
              email: leadEmail || null,
              source: source,
              stage: 'new',
              score: Math.floor(Math.random() * 100) + 1, // Score aleatório inicial
              notes: `Lead gerado automaticamente da conversa: ${conversation.user_session_id}\nAgente: ${conversation.agents?.name || 'Desconhecido'}\nCanal: ${source}`
            });

          if (insertError) {
            console.error('Erro ao criar lead:', insertError);
          }
        }

        // Atualizar dados após criar leads
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Erro ao processar conversas para leads:', error);
      }
    };

    // Executar a criação de leads quando houver dados
    if (user?.id) {
      createLeadsFromConversations();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="p-4 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">CRM</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Gerencie seus leads e funil de vendas
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <PipelineStageConfig onStagesUpdated={handleStagesUpdated} />
            <NewLeadDialog onLeadCreated={handleLeadCreated} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total de Leads</p>
                  <p className="text-lg md:text-2xl font-bold">{crmStats?.totalLeads || 0}</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Qualificados</p>
                  <p className="text-lg md:text-2xl font-bold">{crmStats?.qualified || 0}</p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Em Contato</p>
                  <p className="text-lg md:text-2xl font-bold">{crmStats?.contacted || 0}</p>
                </div>
                <Phone className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Taxa Conversão</p>
                  <p className="text-lg md:text-2xl font-bold">{crmStats?.conversionRate || 0}%</p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads por Canal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="font-semibold mb-2">Leads por Canal</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Widget do Site</span>
                  <span className="text-sm font-medium">{crmStats?.channelStats?.widget || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">WhatsApp</span>
                  <span className="text-sm font-medium">{crmStats?.channelStats?.whatsapp || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Instagram</span>
                  <span className="text-sm font-medium">{crmStats?.channelStats?.instagram || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle and Content */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <CardTitle className="text-lg md:text-xl">Funil de Vendas</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size={isMobile ? 'sm' : 'default'}
                onClick={() => setViewMode('kanban')}
                className="flex-1 sm:flex-none"
              >
                <Kanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size={isMobile ? 'sm' : 'default'}
                onClick={() => setViewMode('list')}
                className="flex-1 sm:flex-none"
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            {viewMode === 'kanban' ? (
              <KanbanBoard refreshTrigger={refreshTrigger} />
            ) : (
              <LeadsListView refreshTrigger={refreshTrigger} />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CRM;
