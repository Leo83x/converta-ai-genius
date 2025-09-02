-- Fix critical security vulnerability in sessions table
-- Add user_id column and implement proper RLS policies

-- Add user_id column to sessions table
ALTER TABLE public.sessions 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Set user_id to the current authenticated user for any existing sessions
-- (This will be NULL for existing sessions, which is ok as they'll need to be recreated)

-- Create index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "sessions_select_policy" ON public.sessions;
DROP POLICY IF EXISTS "sessions_insert_policy" ON public.sessions;
DROP POLICY IF EXISTS "sessions_update_policy" ON public.sessions;
DROP POLICY IF EXISTS "sessions_delete_policy" ON public.sessions;

-- Create secure RLS policies that only allow users to access their own sessions
CREATE POLICY "Users can view own sessions" 
ON public.sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" 
ON public.sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" 
ON public.sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" 
ON public.sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Make user_id NOT NULL for future records to ensure security
-- We'll do this after updating the application code
-- ALTER TABLE public.sessions ALTER COLUMN user_id SET NOT NULL;