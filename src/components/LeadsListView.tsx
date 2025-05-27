import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from './LeadDetailsDialog';
import LeadDetailsDialog from './LeadDetailsDialog';
import { MoreHorizontal, Phone, Mail, Calendar } from 'lucide-react';
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

  const getStageLabel = (stage: string) => {
    const stageLabels: { [key: string]: string } = {
      'new': 'Novo Lead',
      'qualified': 'Qualificado',
      'contacted': 'Em Contato',
      'proposal': 'Proposta',
      'negotiation': 'Negociação',
      'won': 'Ganho',
      'lost': 'Perdido'
    };
    return stageLabels[stage] || stage;
  };

  const getStageColor = (stage: string) => {
    const stageColors: { [key: string]: string } = {
      'new': 'bg-blue-100 text-blue-800',
      'qualified': 'bg-green-100 text-green-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-red-100 text-red-800',
      'won': 'bg-emerald-100 text-emerald-800',
      'lost': 'bg-gray-100 text-gray-800'
    };
    return stageColors[stage] || 'bg-gray-100 text-gray-800';
  };

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

  // Mobile Card View
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
                    <h3 className="font-medium text-sm">{lead.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleLeadClick(lead)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStageColor(lead.stage)} className="text-xs">
                      {getStageLabel(lead.stage)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Score: {lead.score}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span className="truncate">{lead.phone}</span>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum lead encontrado
            </div>
          )}
        </div>

        <LeadDetailsDialog 
          lead={selectedLead}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      </>
    );
  }

  // Desktop Table View
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Estágio</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleLeadClick(lead)}
                  >
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {lead.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStageColor(lead.stage)}>
                        {getStageLabel(lead.stage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.score}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleLeadClick(lead)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum lead encontrado
            </div>
          )}
        </CardContent>
      </Card>

      <LeadDetailsDialog 
        lead={selectedLead}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};

export default LeadsListView;
