
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from './LeadDetailsDialog';
import LeadDetailsDialog from './LeadDetailsDialog';

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

  const fetchStages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setStages(data || []);
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
      
      // Mapear estágios do banco para estágios da interface
      const stageMapping: { [key: string]: string } = {
        'new': 'Novo Lead',
        'qualified': 'Qualificado', 
        'contacted': 'Em Contato',
        'proposal': 'Proposta',
        'negotiation': 'Negociação',
        'won': 'Ganho',
        'lost': 'Perdido'
      };

      stages.forEach(stage => {
        groupedLeads[stage.name] = [];
      });

      data?.forEach(lead => {
        const stageName = stageMapping[lead.stage] || 'Novo Lead';
        if (!groupedLeads[stageName]) {
          groupedLeads[stageName] = [];
        }
        groupedLeads[stageName].push(lead);
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
  }, [user]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{stage.name}</span>
                <Badge 
                  variant="outline" 
                  style={{ backgroundColor: stage.color + '20', borderColor: stage.color }}
                >
                  {leadsByStage[stage.name]?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {leadsByStage[stage.name]?.map((lead) => (
                <Card 
                  key={lead.id} 
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLeadClick(lead)}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{lead.name}</h4>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {lead.source}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Score: {lead.score}
                      </span>
                    </div>
                    {lead.phone && (
                      <p className="text-xs text-gray-600">{lead.phone}</p>
                    )}
                  </div>
                </Card>
              ))}
              {(!leadsByStage[stage.name] || leadsByStage[stage.name].length === 0) && (
                <div className="text-center py-8 text-gray-500 text-sm">
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
