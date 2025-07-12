-- Criar tabela para campanhas do Genius
CREATE TABLE public.genius_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  segment TEXT,
  objective TEXT,
  platform TEXT[],
  budget TEXT,
  duration TEXT,
  format TEXT[],
  tone TEXT,
  persona TEXT,
  has_strategy BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  campaign_data JSONB,
  ai_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.genius_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own campaigns" 
ON public.genius_campaigns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns" 
ON public.genius_campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
ON public.genius_campaigns 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" 
ON public.genius_campaigns 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_genius_campaigns_updated_at
BEFORE UPDATE ON public.genius_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();