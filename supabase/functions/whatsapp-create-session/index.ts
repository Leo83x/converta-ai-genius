
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

    if (!sessionName) {
      throw new Error('Session name is required');
    }

    console.log('Creating WhatsApp session:', sessionName);

    // Criar sessão na Evolution API
    const evolutionResponse = await fetch('https://api.evolution-api.com/instance/init', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token_padrao_converta',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionName: sessionName
      })
    });

    if (!evolutionResponse.ok) {
      throw new Error(`Evolution API error: ${evolutionResponse.status}`);
    }

    const evolutionData = await evolutionResponse.json();
    console.log('Evolution API response:', evolutionData);

    // Armazenar dados na tabela evolution_tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('evolution_tokens')
      .insert({
        user_id: user.id,
        session_name: sessionName,
        instance_id: evolutionData.instance_id,
        token: evolutionData.token,
        qr_code_url: evolutionData.qrCode,
        status: 'pending'
      })
      .select()
      .single();

    if (tokenError) {
      throw tokenError;
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        instance_id: evolutionData.instance_id,
        qr_code: evolutionData.qrCode,
        session_name: sessionName,
        token_id: tokenData.id
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-create-session:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
