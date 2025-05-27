
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookData = await req.json();
    console.log('Received webhook:', JSON.stringify(webhookData, null, 2));

    // Extrair dados da mensagem
    const messageData = webhookData.data;
    const sessionName = webhookData.instance;
    
    if (!messageData || !sessionName) {
      throw new Error('Invalid webhook data');
    }

    const fromNumber = messageData.key?.remoteJid?.replace('@s.whatsapp.net', '');
    const messageContent = messageData.message;
    const messageId = messageData.key?.id;

    if (!fromNumber || !messageContent) {
      console.log('Ignoring message without from/content');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar token da evolução
    const { data: evolutionToken, error: tokenError } = await supabase
      .from('evolution_tokens')
      .select('*')
      .eq('session_name', sessionName)
      .single();

    if (tokenError || !evolutionToken) {
      console.error('Evolution token not found for session:', sessionName);
      return new Response(JSON.stringify({ success: false, error: 'Token not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Armazenar mensagem recebida
    const { error: inboundError } = await supabase
      .from('evolution_inbound_messages')
      .insert({
        evolution_token_id: evolutionToken.id,
        whatsapp_from: fromNumber,
        whatsapp_to: sessionName,
        message_id: messageId,
        message_content: messageContent,
        type: 'text',
        processed: false
      });

    if (inboundError) {
      console.error('Error storing inbound message:', inboundError);
    }

    // Buscar agentes vinculados ao número da instância
    const { data: agentChannels, error: channelsError } = await supabase
      .from('agent_channels')
      .select(`
        *,
        agents!inner(*)
      `)
      .eq('channel_type', 'whatsapp')
      .eq('agents.active', true);

    if (channelsError) {
      console.error('Error fetching agent channels:', channelsError);
      return new Response(JSON.stringify({ success: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found agent channels:', agentChannels?.length || 0);

    // Processar cada agente ativo
    for (const channel of agentChannels || []) {
      try {
        // Aqui você pode implementar a lógica de processamento com OpenAI
        console.log(`Processing message for agent: ${channel.agents.name}`);
        
        // Por enquanto, vamos apenas registrar que processamos
        // A integração com OpenAI Assistant API seria implementada aqui
        
      } catch (error) {
        console.error(`Error processing agent ${channel.agents.id}:`, error);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in evolution-webhook:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
