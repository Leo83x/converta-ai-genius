
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

    const { sessionName, phoneNumber, message } = await req.json();

    console.log('Sending WhatsApp message:', { sessionName, phoneNumber, message });

    // Buscar token da evolução
    const { data: evolutionToken, error: tokenError } = await supabase
      .from('evolution_tokens')
      .select('*')
      .eq('session_name', sessionName)
      .eq('user_id', user.id)
      .single();

    if (tokenError || !evolutionToken) {
      throw new Error('Evolution token not found');
    }

    // Obter a chave da API
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    if (!evolutionApiKey) {
      throw new Error('Evolution API key not configured');
    }

    // Enviar mensagem via Evolution API
    const evolutionResponse = await fetch('https://api.evolution-api.com/message/send-text', {
      method: 'POST',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionName: sessionName,
        number: phoneNumber,
        text: message
      }),
    });

    if (!evolutionResponse.ok) {
      throw new Error(`Evolution API error: ${evolutionResponse.status}`);
    }

    const responseData = await evolutionResponse.json();
    console.log('Message sent response:', responseData);

    // Armazenar mensagem enviada
    const { error: outboundError } = await supabase
      .from('evolution_outbound_messages')
      .insert({
        evolution_token_id: evolutionToken.id,
        whatsapp_to: phoneNumber,
        message_content: { text: message },
        message_id: responseData.key?.id,
        response_status: 'sent'
      });

    if (outboundError) {
      console.error('Error storing outbound message:', outboundError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully',
      data: responseData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-send-message:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
