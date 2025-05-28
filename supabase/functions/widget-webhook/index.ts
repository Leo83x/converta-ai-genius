
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Widget webhook iniciado - método:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas');
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro de configuração do servidor. Tente novamente mais tarde.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestBody = await req.text();
    console.log('Corpo da requisição recebido:', requestBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro no formato da mensagem. Tente novamente.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userId, sessionId } = parsedBody;
    console.log('Dados extraídos:', { message, userId, sessionId });

    if (!message || !userId) {
      console.error('Parâmetros obrigatórios ausentes:', { message: !!message, userId: !!userId });
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Parâmetros inválidos na mensagem.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar agentes ativos do usuário
    console.log('Buscando agentes para o usuário:', userId);
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (agentsError) {
      console.error('Erro ao buscar agentes:', agentsError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro interno. Tente novamente em alguns minutos.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Agentes encontrados:', agents?.length || 0);

    // Verificar agentes compatíveis com widget
    const widgetAgents = agents?.filter(agent => {
      const channel = agent.channel?.toLowerCase();
      return channel === 'widget' || 
             channel === 'widget do site' || 
             channel?.includes('widget');
    }) || [];

    console.log('Agentes de widget encontrados:', widgetAgents.length);

    if (widgetAgents.length === 0) {
      console.log('Nenhum agente de widget encontrado para o usuário:', userId);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Não há agentes configurados para o widget no momento. Configure um agente com canal "Widget do Site" no painel.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agent = widgetAgents[0];
    console.log('Usando agente:', agent.name, 'ID:', agent.id);

    // Buscar chave OpenAI do usuário
    console.log('Buscando chave OpenAI para o usuário:', userId);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('openai_key')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro ao acessar configurações do usuário. Verifique se sua conta está configurada corretamente.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!userData?.openai_key) {
      console.error('Chave OpenAI não encontrada para o usuário:', userId);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Chave OpenAI não configurada. Configure sua chave OpenAI no perfil do usuário para usar o chat.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Chave OpenAI encontrada para o usuário');

    // Buscar histórico da conversa
    const sessionKey = sessionId || 'widget_session_default';
    const { data: conversationData } = await supabase
      .from('agent_conversations')
      .select('messages')
      .eq('agent_id', agent.id)
      .eq('user_session_id', sessionKey)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('Histórico de conversa encontrado:', !!conversationData);

    // Preparar mensagens para OpenAI
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

    console.log('Enviando para OpenAI com', messages.length, 'mensagens');

    // Chamar OpenAI
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

    console.log('Status da resposta OpenAI:', openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('Erro da API OpenAI:', openaiResponse.status, errorText);
      
      if (openaiResponse.status === 401) {
        return new Response(JSON.stringify({ 
          success: true, 
          reply: 'Chave OpenAI inválida ou expirada. Verifique suas configurações no perfil.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro temporário na API de IA. Tente novamente em alguns momentos.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await openaiResponse.json();
    console.log('Resposta OpenAI recebida');
    
    const replyText = aiResponse.choices?.[0]?.message?.content;

    if (!replyText) {
      console.error('Nenhum conteúdo na resposta da OpenAI:', aiResponse);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Não consegui gerar uma resposta no momento. Tente reformular sua pergunta.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Salvar/atualizar conversa
    const updatedMessages = [...messages, { role: 'assistant', content: replyText }];
    
    try {
      if (conversationData) {
        const { error: updateError } = await supabase
          .from('agent_conversations')
          .update({ 
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('agent_id', agent.id)
          .eq('user_session_id', sessionKey);
          
        if (updateError) {
          console.error('Erro ao atualizar conversa:', updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('agent_conversations')
          .insert({
            agent_id: agent.id,
            user_session_id: sessionKey,
            messages: updatedMessages
          });
          
        if (insertError) {
          console.error('Erro ao criar conversa:', insertError);
        }
      }
    } catch (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      // Não falhar a resposta por causa de erro de salvamento
    }

    console.log('Resposta do widget gerada com sucesso');

    return new Response(JSON.stringify({ 
      success: true, 
      reply: replyText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro geral no widget-webhook:', error);
    return new Response(JSON.stringify({ 
      success: true, 
      reply: 'Erro interno do servidor. Nossa equipe foi notificada.' 
    }), {
      status: 200, // Retornar 200 para não quebrar o widget
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
