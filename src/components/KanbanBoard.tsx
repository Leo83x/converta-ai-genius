import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from './LeadDetailsDialog';
import LeadDetailsDialog from './LeadDetailsDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
  color: string;
}

interface KanbanBoardProps {
  refreshTrigger: number;
}

const KanbanBoard = ({ refreshTrigger }: KanbanBoardProps) => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [leadsByStage, setLeadsByStage] = useState<{ [key: string]: Lead[] }>({});
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const fetchStages = async () => {
    if (!user) return;

    try {
      // Primeiro tenta buscar estágios do usuário
      let { data: userStages, error: userError } = await supabase
        .from('pipeline_stages')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index');

      if (userError) throw userError;

      // Se não tem estágios próprios, usa os padrão
      if (!userStages || userStages.length === 0) {
        const { data: defaultStages, error: defaultError } = await supabase
          .from('pipeline_stages')
          .select('*')
          .eq('user_id', '00000000-0000-0000-0000-000000000000')
          .order('order_index');

        if (defaultError) throw defaultError;
        setStages(defaultStages || []);
      } else {
        setStages(userStages);
      }
    } catch (error) {
      console.error('Erro ao carregar estágios:', error);
    }
  };

  const fetchLeads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Agrupar leads por estágio
      const groupedLeads: { [key: string]: Lead[] } = {};
      
      stages.forEach(stage => {
        groupedLeads[stage.name] = [];
      });

      data?.forEach(lead => {
        // Mapear estágios do banco para estágios configurados
        const stageMapping: { [key: string]: string } = {
          'new': 'Novo Lead',
          'qualified': 'Qualificado', 
          'contacted': 'Em Contato',
          'proposal': 'Proposta',
          'negotiation': 'Negociação',
          'won': 'Ganho',
          'lost': 'Perdido'
        };

        const stageName = stageMapping[lead.stage] || lead.stage;
        
        // Encontrar estágio correspondente ou usar o primeiro estágio
        const matchingStage = stages.find(s => s.name === stageName);
        const targetStageName = matchingStage ? matchingStage.name : (stages[0]?.name || 'Novo Lead');
        
        if (!groupedLeads[targetStageName]) {
          groupedLeads[targetStageName] = [];
        }
        groupedLeads[targetStageName].push(lead);
      });

      setLeadsByStage(groupedLeads);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, [user, refreshTrigger]);

  useEffect(() => {
    if (stages.length > 0) {
      fetchLeads();
    }
  }, [stages, user, refreshTrigger]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-3 md:gap-4 ${
        isMobile 
          ? 'grid-cols-1' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {stages.map((stage) => (
          <Card key={stage.id} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="truncate mr-2">{stage.name}</span>
                <Badge 
                  variant="outline" 
                  style={{ backgroundColor: stage.color + '20', borderColor: stage.color }}
                  className="shrink-0"
                >
                  {leadsByStage[stage.name]?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 md:p-6">
              {leadsByStage[stage.name]?.map((lead) => (
                <Card 
                  key={lead.id} 
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLeadClick(lead)}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm truncate">{lead.name}</h4>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs truncate">
                        {lead.source}
                      </Badge>
                      <span className="text-xs text-gray-500 shrink-0">
                        Score: {lead.score}
                      </span>
                    </div>
                    {lead.phone && (
                      <p className="text-xs text-gray-600 truncate">{lead.phone}</p>
                    )}
                  </div>
                </Card>
              ))}
              {(!leadsByStage[stage.name] || leadsByStage[stage.name].length === 0) && (
                <div className="text-center py-6 md:py-8 text-gray-500 text-sm">
                  Nenhum lead neste estágio
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <LeadDetailsDialog 
        lead={selectedLead}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};

export default KanbanBoard;
