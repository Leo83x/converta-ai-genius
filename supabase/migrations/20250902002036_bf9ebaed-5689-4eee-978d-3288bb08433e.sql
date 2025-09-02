-- Fix critical security vulnerability in subscribers table
-- Replace dangerous RLS policy that allows anyone to insert subscription records

-- Drop the existing dangerous policy that allows anyone to insert
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create secure policy that only allows authenticated users to create subscriptions for themselves
CREATE POLICY "Users can create own subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.email() = email);

-- Add policy to allow authenticated users to update their own subscription
-- (This ensures users can manage their subscription details)
CREATE POLICY "Users can update own subscription" 
ON public.subscribers 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.email() = email);

-- Ensure user_id is properly set for security
-- (We'll make this NOT NULL after updating the application if needed)
-- For now, we'll keep it as is to not break existing functionality

-- Add index for better performance on user_id and email queries
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);