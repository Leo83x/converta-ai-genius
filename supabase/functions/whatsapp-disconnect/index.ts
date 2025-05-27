
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

    console.log('Disconnecting WhatsApp session:', sessionName);

    // Buscar dados da sessão
    const { data: tokenData, error: tokenError } = await supabase
      .from('evolution_tokens')
      .select('*')
      .eq('session_name', sessionName)
      .eq('user_id', user.id)
      .single();

    if (tokenError || !tokenData) {
      throw new Error('Session not found');
    }

    // Desconectar na Evolution API
    const evolutionResponse = await fetch(`https://api.evolution-api.com/instance/disconnect/${sessionName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer token_padrao_converta',
      }
    });

    if (!evolutionResponse.ok) {
      console.warn('Evolution API disconnect failed, but updating local status');
    }

    // Atualizar status local
    const { error: updateError } = await supabase
      .from('evolution_tokens')
      .update({ 
        status: 'disconnected',
        updated_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'WhatsApp disconnected successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-disconnect:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
