-- Fix function search path security issues
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_affiliate_level() SET search_path = public;

-- Enable RLS for any tables that might not have it (checking sessions table)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sessions table
CREATE POLICY "sessions_select_policy" ON public.sessions
FOR SELECT
USING (true);

CREATE POLICY "sessions_insert_policy" ON public.sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "sessions_update_policy" ON public.sessions
FOR UPDATE
USING (true);

CREATE POLICY "sessions_delete_policy" ON public.sessions
FOR DELETE
USING (true);