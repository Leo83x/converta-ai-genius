-- Fix search path issue
DROP FUNCTION IF EXISTS clean_dev_instances();

CREATE OR REPLACE FUNCTION clean_dev_instances()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM whatsapp_instances 
  WHERE instance_id LIKE 'dev_%' 
  AND created_at < (now() - interval '1 hour');
END;
$$;