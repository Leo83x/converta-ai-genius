
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

    const { message, userId, sessionId } = await req.json();
    console.log('Widget message received:', { message, userId, sessionId });

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    // Buscar agentes ativos do usuário que tenham canal widget
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (agentsError) {
      console.error('Error fetching agents:', agentsError);
      return new Response(JSON.stringify({ success: false, error: 'Error fetching agents' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar se há agentes com canal widget
    const widgetAgents = agents?.filter(agent => 
      agent.channel === 'widget' || agent.channel === 'Widget do Site'
    ) || [];

    if (widgetAgents.length === 0) {
      console.log('No widget agents found for user:', userId);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Desculpe, não há agentes disponíveis no momento. Por favor, configure um agente para o canal "Widget do Site".' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agent = widgetAgents[0];
    console.log('Using agent:', agent.name, 'with channel:', agent.channel);

    // Buscar chave OpenAI do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('openai_key')
      .eq('id', userId)
      .single();

    if (userError || !userData?.openai_key) {
      console.error('OpenAI key not found for user:', userId, userError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Desculpe, configuração de IA não encontrada. Por favor, configure sua chave OpenAI no perfil.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found OpenAI key for user');

    // Buscar histórico da conversa para contexto
    const { data: conversationData } = await supabase
      .from('agent_conversations')
      .select('messages')
      .eq('agent_id', agent.id)
      .eq('user_session_id', sessionId || 'widget_session')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let messages = [
      {
        role: 'system',
        content: agent.system_prompt || 'Você é um assistente virtual útil e prestativo.'
      }
    ];

    // Adicionar histórico se existir
    if (conversationData?.messages && Array.isArray(conversationData.messages)) {
      const historyMessages = conversationData.messages.slice(-10); // Últimas 10 mensagens
      messages = [...messages, ...historyMessages];
    }

    // Adicionar mensagem atual
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    // Processar com OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.openai_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se sua chave OpenAI está válida.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await openaiResponse.json();
    console.log('OpenAI response received');
    
    const replyText = aiResponse.choices?.[0]?.message?.content;

    if (!replyText) {
      console.error('No response content from OpenAI');
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Desculpe, não consegui gerar uma resposta. Tente novamente.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Atualizar ou criar conversa
    const updatedMessages = [...messages, { role: 'assistant', content: replyText }];
    
    if (conversationData) {
      await supabase
        .from('agent_conversations')
        .update({ 
          messages: updatedMessages,
          updated_at: new Date().toISOString()
        })
        .eq('agent_id', agent.id)
        .eq('user_session_id', sessionId || 'widget_session');
    } else {
      await supabase
        .from('agent_conversations')
        .insert({
          agent_id: agent.id,
          user_session_id: sessionId || 'widget_session',
          messages: updatedMessages
        });
    }

    console.log('Widget response generated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      reply: replyText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in widget-webhook:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
