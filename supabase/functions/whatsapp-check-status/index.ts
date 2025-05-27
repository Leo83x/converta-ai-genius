
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { sessionName } = await req.json();

    console.log('Checking WhatsApp status for session:', sessionName);

    // Verificar status na Evolution API
    const evolutionResponse = await fetch(`https://api.evolution-api.com/status/session/${sessionName}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer token_padrao_converta',
      }
    });

    if (!evolutionResponse.ok) {
      throw new Error(`Evolution API error: ${evolutionResponse.status}`);
    }

    const statusData = await evolutionResponse.json();
    console.log('Status response:', statusData);

    // Atualizar status na tabela evolution_tokens
    const { error: updateError } = await supabase
      .from('evolution_tokens')
      .update({ 
        status: statusData.status || 'disconnected',
        updated_at: new Date().toISOString()
      })
      .eq('session_name', sessionName)
      .eq('user_id', user.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({
      success: true,
      status: statusData.status || 'disconnected'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-check-status:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
