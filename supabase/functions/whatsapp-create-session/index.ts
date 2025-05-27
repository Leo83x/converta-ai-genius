
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

    // Verificar se já existe uma sessão com este nome
    const { data: existingSession } = await supabase
      .from('evolution_tokens')
      .select('*')
      .eq('session_name', sessionName)
      .eq('user_id', user.id)
      .single();

    if (existingSession) {
      throw new Error('Já existe uma sessão com este nome');
    }

    // Criar sessão na Evolution API
    const evolutionResponse = await fetch('https://api.evolution-api.com/instance/create', {
      method: 'POST',
      headers: {
        'apikey': 'token_padrao_converta',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instanceName: sessionName,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      })
    });

    if (!evolutionResponse.ok) {
      const errorText = await evolutionResponse.text();
      console.error('Evolution API error:', errorText);
      throw new Error(`Evolution API error: ${evolutionResponse.status} - ${errorText}`);
    }

    const evolutionData = await evolutionResponse.json();
    console.log('Evolution API response:', evolutionData);

    // Conectar a instância
    const connectResponse = await fetch(`https://api.evolution-api.com/instance/connect/${sessionName}`, {
      method: 'GET',
      headers: {
        'apikey': 'token_padrao_converta',
        'Content-Type': 'application/json',
      }
    });

    if (!connectResponse.ok) {
      console.error('Evolution connect error:', connectResponse.status);
    } else {
      const connectData = await connectResponse.json();
      console.log('Evolution connect response:', connectData);
    }

    // Armazenar dados na tabela evolution_tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('evolution_tokens')
      .insert({
        user_id: user.id,
        session_name: sessionName,
        instance_id: evolutionData.instance?.instanceName || sessionName,
        token: evolutionData.hash || 'temp_token',
        qr_code_url: null, // Será atualizado quando o QR code for gerado
        status: 'pending'
      })
      .select()
      .single();

    if (tokenError) {
      console.error('Database error:', tokenError);
      throw tokenError;
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        instance_id: evolutionData.instance?.instanceName || sessionName,
        session_name: sessionName,
        token_id: tokenData.id,
        status: 'pending'
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
