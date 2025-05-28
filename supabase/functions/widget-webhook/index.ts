
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Widget webhook iniciado - método:', req.method, 'URL:', req.url);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔧 Verificando variáveis:', { 
      supabaseUrl: !!supabaseUrl, 
      supabaseServiceKey: !!supabaseServiceKey 
    });
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Variáveis de ambiente do Supabase não configuradas');
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro de configuração do servidor. Tente novamente mais tarde.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestBody = await req.text();
    console.log('📝 Corpo da requisição recebido (raw):', requestBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
      console.log('📋 Dados parseados:', parsedBody);
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Formato de mensagem inválido. Tente novamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userId, sessionId } = parsedBody;
    console.log('📊 Dados extraídos:', { 
      message: message?.substring(0, 50), 
      userId, 
      sessionId,
      hasMessage: !!message,
      messageLength: message?.length 
    });

    if (!message || !userId) {
      console.error('❌ Parâmetros obrigatórios ausentes:', { 
        hasMessage: !!message, 
        hasUserId: !!userId 
      });
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Parâmetros inválidos. Por favor, recarregue a página e tente novamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar agentes ativos do usuário
    console.log('🔍 Buscando agentes para o usuário:', userId);
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (agentsError) {
      console.error('❌ Erro ao buscar agentes:', agentsError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro interno do sistema. Tente novamente em alguns minutos.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 Agentes encontrados:', agents?.length || 0);
    if (agents && agents.length > 0) {
      console.log('🎯 Detalhes dos agentes:', agents.map(a => ({ 
        id: a.id, 
        name: a.name, 
        channel: a.channel,
        active: a.active
      })));
    }

    // Buscar agente de widget de forma mais flexível
    const widgetAgents = agents?.filter(agent => {
      const channel = agent.channel?.toLowerCase?.() || '';
      const isWidgetAgent = channel.includes('widget') || 
                           channel.includes('site') || 
                           channel.includes('web') ||
                           channel === 'widget do site';
      
      console.log('🔍 Verificando agente:', agent.name, 'canal:', channel, 'é widget?', isWidgetAgent);
      return isWidgetAgent;
    }) || [];

    console.log('🎯 Agentes de widget encontrados:', widgetAgents.length);

    if (widgetAgents.length === 0) {
      console.log('⚠️ Nenhum agente de widget encontrado. Todos os agentes:', 
        agents?.map(a => `${a.name} (${a.channel})`) || []);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Não há agentes configurados para o widget. Configure um agente com canal "Widget do Site" no painel de administração.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agent = widgetAgents[0];
    console.log('✅ Usando agente:', agent.name, 'ID:', agent.id);

    // Buscar chave OpenAI do usuário
    console.log('🔑 Buscando chave OpenAI para o usuário:', userId);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('openai_key')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('❌ Erro ao buscar dados do usuário:', userError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro ao acessar configurações da conta. Verifique se sua conta está configurada corretamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🔑 Dados do usuário encontrados:', !!userData);
    console.log('🔑 Chave OpenAI presente:', !!userData?.openai_key);

    if (!userData?.openai_key) {
      console.error('❌ Chave OpenAI não encontrada para o usuário:', userId);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Chave OpenAI não configurada. Configure sua chave OpenAI no perfil do usuário para usar o chat.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Preparar mensagens para OpenAI
    const systemPrompt = agent.system_prompt || 'Você é um assistente virtual útil e prestativo que responde em português brasileiro.';
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: message
      }
    ];

    console.log('🤖 Preparando chamada para OpenAI...');
    console.log('🤖 System prompt:', systemPrompt.substring(0, 100) + '...');
    console.log('🤖 Mensagem do usuário:', message.substring(0, 100) + '...');

    // Chamar OpenAI
    let openaiResponse;
    try {
      console.log('📡 Fazendo requisição para OpenAI...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Timeout da requisição OpenAI');
        controller.abort();
      }, 30000);

      openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('📡 Status da resposta OpenAI:', openaiResponse.status);
      
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('❌ Erro HTTP da OpenAI:', openaiResponse.status, errorText);
        
        if (openaiResponse.status === 401) {
          return new Response(JSON.stringify({ 
            success: true, 
            reply: 'Chave OpenAI inválida ou expirada. Verifique suas configurações no perfil.' 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        throw new Error(`HTTP ${openaiResponse.status}: ${errorText}`);
      }

    } catch (fetchError) {
      console.error('❌ Erro na requisição para OpenAI:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ 
          success: true, 
          reply: 'Tempo limite excedido. Tente novamente em alguns instantes.' 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await openaiResponse.json();
    console.log('✅ Resposta OpenAI recebida:', !!aiResponse.choices?.[0]?.message?.content);
    
    const replyText = aiResponse.choices?.[0]?.message?.content;

    if (!replyText) {
      console.error('❌ Nenhum conteúdo na resposta da OpenAI:', aiResponse);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Não consegui gerar uma resposta adequada. Tente reformular sua pergunta.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('💬 Resposta gerada com sucesso:', replyText.substring(0, 100) + '...');

    // Salvar conversa (opcional, não impede o funcionamento)
    const sessionKey = sessionId || `widget_session_${Date.now()}`;
    const updatedMessages = [...messages, { role: 'assistant', content: replyText }];
    
    try {
      console.log('💾 Tentando salvar conversa...');
      
      const { data: existingConversation } = await supabase
        .from('agent_conversations')
        .select('id, messages')
        .eq('agent_id', agent.id)
        .eq('user_session_id', sessionKey)
        .maybeSingle();

      if (existingConversation) {
        await supabase
          .from('agent_conversations')
          .update({ 
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConversation.id);
        console.log('💾 Conversa atualizada');
      } else {
        await supabase
          .from('agent_conversations')
          .insert({
            agent_id: agent.id,
            user_session_id: sessionKey,
            messages: updatedMessages
          });
        console.log('💾 Nova conversa criada');
      }
    } catch (dbError) {
      console.error('⚠️ Erro ao salvar conversa (não crítico):', dbError);
    }

    console.log('🎉 Resposta do widget enviada com sucesso');

    return new Response(JSON.stringify({ 
      success: true, 
      reply: replyText 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Erro geral no widget-webhook:', error);
    return new Response(JSON.stringify({ 
      success: true, 
      reply: 'Ocorreu um erro temporário. Tente novamente em alguns instantes.' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
