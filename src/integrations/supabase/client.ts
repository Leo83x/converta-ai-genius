// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xekxewtggioememydenu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhla3hld3RnZ2lvZW1lbXlkZW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDAwODgsImV4cCI6MjA2Mzg3NjA4OH0.xOQGtjZVeFhYx3xuDXXtiI7sB4ksGLOqcIeiwMZFjBg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);