
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
    const { data: inboundMessage, error: inboundError } = await supabase
      .from('evolution_inbound_messages')
      .insert({
        evolution_token_id: evolutionToken.id,
        whatsapp_from: fromNumber,
        whatsapp_to: sessionName,
        message_id: messageId,
        message_content: messageContent,
        type: 'text',
        processed: false
      })
      .select()
      .single();

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
      .eq('routing_number', sessionName)
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
        console.log(`Processing message for agent: ${channel.agents.name}`);
        
        // Buscar usuário do agente para pegar OpenAI key
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('openai_key')
          .eq('id', channel.agents.user_id)
          .single();

        if (userError || !userData?.openai_key) {
          console.error('OpenAI key not found for user:', channel.agents.user_id);
          continue;
        }

        // Extrair texto da mensagem
        let messageText = '';
        if (messageContent.conversation) {
          messageText = messageContent.conversation;
        } else if (messageContent.extendedTextMessage) {
          messageText = messageContent.extendedTextMessage.text;
        } else if (messageContent.text) {
          messageText = messageContent.text;
        }

        if (!messageText) {
          console.log('No text content found in message');
          continue;
        }

        // Processar com OpenAI
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userData.openai_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: channel.agents.system_prompt || 'Você é um assistente virtual útil e prestativo.'
              },
              {
                role: 'user',
                content: messageText
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          }),
        });

        if (!openaiResponse.ok) {
          console.error('OpenAI API error:', await openaiResponse.text());
          continue;
        }

        const aiResponse = await openaiResponse.json();
        const replyText = aiResponse.choices[0]?.message?.content;

        if (!replyText) {
          console.error('No response from OpenAI');
          continue;
        }

        // Enviar resposta via Evolution API
        const sendResponse = await fetch('https://api.evolution-api.com/message/send-text', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${evolutionToken.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionName: sessionName,
            number: fromNumber,
            text: replyText
          }),
        });

        if (!sendResponse.ok) {
          console.error('Error sending message via Evolution API:', await sendResponse.text());
          continue;
        }

        const sendResult = await sendResponse.json();
        console.log('Message sent successfully:', sendResult);

        // Armazenar mensagem enviada
        await supabase
          .from('evolution_outbound_messages')
          .insert({
            evolution_token_id: evolutionToken.id,
            whatsapp_to: fromNumber,
            message_content: { text: replyText },
            message_id: sendResult.key?.id,
            response_status: 'sent'
          });

        // Marcar mensagem como processada
        if (inboundMessage) {
          await supabase
            .from('evolution_inbound_messages')
            .update({ processed: true })
            .eq('id', inboundMessage.id);
        }

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
