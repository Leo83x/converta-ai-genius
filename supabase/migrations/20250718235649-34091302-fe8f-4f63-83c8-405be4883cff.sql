-- Adicionar tabela de métricas de campanha
CREATE TABLE public.campaign_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own campaign metrics" 
ON public.campaign_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaign metrics" 
ON public.campaign_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign metrics" 
ON public.campaign_metrics 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaign metrics" 
ON public.campaign_metrics 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_campaign_metrics_updated_at
BEFORE UPDATE ON public.campaign_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar coluna campaign_id na tabela leads para rastreamento
ALTER TABLE public.leads 
ADD COLUMN campaign_id UUID;

-- Adicionar coluna campaign_id na tabela agents para associação
ALTER TABLE public.agents 
ADD COLUMN campaign_id UUID;

-- Criar índices para performance
CREATE INDEX idx_campaign_metrics_campaign_id ON public.campaign_metrics(campaign_id);
CREATE INDEX idx_campaign_metrics_date ON public.campaign_metrics(date);
CREATE INDEX idx_leads_campaign_id ON public.leads(campaign_id);
CREATE INDEX idx_agents_campaign_id ON public.agents(campaign_id);