
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from './LeadDetailsDialog';
import LeadDetailsDialog from './LeadDetailsDialog';
import { Phone, Mail, Calendar, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LeadsListViewProps {
  refreshTrigger: number;
}

const LeadsListView = ({ refreshTrigger }: LeadsListViewProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const fetchLeads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user, refreshTrigger]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800 border-blue-200',
      'qualified': 'bg-green-100 text-green-800 border-green-200',
      'contacted': 'bg-orange-100 text-orange-800 border-orange-200',
      'proposal': 'bg-purple-100 text-purple-800 border-purple-200',
      'negotiation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'won': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'lost': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStageLabel = (stage: string) => {
    const labels = {
      'new': 'Novo Lead',
      'qualified': 'Qualificado',
      'contacted': 'Em Contato',
      'proposal': 'Proposta',
      'negotiation': 'Negociação',
      'won': 'Ganho',
      'lost': 'Perdido'
    };
    return labels[stage as keyof typeof labels] || stage;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-gray-500 text-sm md:text-base">Nenhum lead encontrado</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card 
              key={lead.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleLeadClick(lead)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-base truncate pr-2">{lead.name}</h3>
                    <Badge className={`${getStageColor(lead.stage)} text-xs shrink-0`}>
                      {getStageLabel(lead.stage)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {lead.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <TrendingUp className="h-3 w-3 mr-1 shrink-0" />
                      <span>Score: {lead.score}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-3 w-3 mr-1 shrink-0" />
                      <span className="truncate">{lead.source}</span>
                    </div>
                  </div>
                </div>
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
  }

  return (
    <>
      <div className="space-y-4">
        {leads.map((lead) => (
          <Card 
            key={lead.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleLeadClick(lead)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{lead.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        {lead.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>Score: {lead.score}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="shrink-0">
                        {lead.source}
                      </Badge>
                      <Badge className={getStageColor(lead.stage)}>
                        {getStageLabel(lead.stage)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
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

export default LeadsListView;
