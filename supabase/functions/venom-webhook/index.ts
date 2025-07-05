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
    console.log('Received Venom webhook:', JSON.stringify(webhookData, null, 2));

    const { from, message, timestamp } = webhookData;
    
    if (!from || !message) {
      console.log('Ignoring message without from/message');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extrair o número sem o @c.us
    const fromNumber = from.replace('@c.us', '');
    console.log('Processing message from:', fromNumber);

    // Buscar agentes ativos para WhatsApp
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

        // Buscar ou criar conversa para este usuário
        const { data: existingConversation, error: convError } = await supabase
          .from('agent_conversations')
          .select('*')
          .eq('agent_id', channel.agents.id)
          .eq('user_session_id', fromNumber)
          .single();

        let conversation = existingConversation;
        let conversationMessages = existingConversation?.messages || [];

        // Se não existe conversa, criar uma nova
        if (!existingConversation) {
          const { data: newConversation, error: createError } = await supabase
            .from('agent_conversations')
            .insert({
              agent_id: channel.agents.id,
              user_session_id: fromNumber,
              messages: []
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating conversation:', createError);
            continue;
          }
          
          conversation = newConversation;
          conversationMessages = [];
        }

        // Adicionar mensagem do usuário ao histórico
        conversationMessages.push({
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        });

        // Preparar histórico para OpenAI (últimas 10 mensagens)
        const recentMessages = conversationMessages.slice(-10);
        const openAIMessages = [
          {
            role: 'system',
            content: channel.agents.system_prompt || 'Você é um assistente virtual útil e prestativo.'
          },
          ...recentMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ];

        // Processar com OpenAI
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userData.openai_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: openAIMessages,
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

        // Adicionar resposta da IA ao histórico
        conversationMessages.push({
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toISOString()
        });

        // Atualizar conversa no banco
        await supabase
          .from('agent_conversations')
          .update({
            messages: conversationMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversation.id);

        // Enviar resposta via Venom Bot
        const venomResponse = await fetch('http://31.97.167.218:3002/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: from,
            message: replyText
          }),
        });

        if (!venomResponse.ok) {
          console.error('Error sending message via Venom Bot:', await venomResponse.text());
          continue;
        }

        console.log('Message sent successfully via Venom Bot');

      } catch (error) {
        console.error(`Error processing agent ${channel.agents.id}:`, error);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in venom-webhook:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});