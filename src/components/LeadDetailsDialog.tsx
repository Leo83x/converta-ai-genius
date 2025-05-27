
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, Tag, User } from 'lucide-react';

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source: string;
  stage: string;
  score: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface LeadDetailsDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadDetailsDialog = ({ lead, open, onOpenChange }: LeadDetailsDialogProps) => {
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

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{lead.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStageColor(lead.stage)}>
                  {getStageLabel(lead.stage)}
                </Badge>
                <Badge variant="outline">Score: {lead.score}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{lead.phone}</span>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{lead.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{lead.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {lead.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Observações</h4>
                <p className="text-sm text-gray-600">{lead.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Editar Lead
            </Button>
            <Button className="flex-1">
              Iniciar Conversa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
