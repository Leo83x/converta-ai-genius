
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 ===========================================');
  console.log('🚀 WIDGET WEBHOOK INICIADO');
  console.log('🚀 Método:', req.method);
  console.log('🚀 URL:', req.url);
  console.log('🚀 ===========================================');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ✅ ETAPA 1: Verificar variáveis de ambiente do Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔧 ETAPA 1 - Verificando variáveis de ambiente:');
    console.log('🔧 SUPABASE_URL presente:', !!supabaseUrl);
    console.log('🔧 SUPABASE_SERVICE_ROLE_KEY presente:', !!supabaseServiceKey);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ ERRO ETAPA 1: Variáveis de ambiente do Supabase não configuradas');
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro de configuração do servidor. Entre em contato com o suporte.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ✅ ETAPA 2: Processar dados da requisição
    console.log('📝 ETAPA 2 - Processando requisição...');
    const requestBody = await req.text();
    console.log('📝 Corpo da requisição (raw):', requestBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
      console.log('📋 Dados parseados:', JSON.stringify(parsedBody, null, 2));
    } catch (parseError) {
      console.error('❌ ERRO ETAPA 2: Erro ao fazer parse do JSON:', parseError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Formato de mensagem inválido. Verifique os dados enviados.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userId, sessionId } = parsedBody;
    
    console.log('📊 ETAPA 2 - Dados extraídos:');
    console.log('📊 message:', message);
    console.log('📊 userId:', userId);
    console.log('📊 sessionId:', sessionId);
    console.log('📊 message length:', message?.length);

    if (!message || !userId) {
      console.error('❌ ERRO ETAPA 2: Parâmetros obrigatórios ausentes');
      console.error('❌ hasMessage:', !!message);
      console.error('❌ hasUserId:', !!userId);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Dados incompletos. Mensagem e ID do usuário são obrigatórios.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ ETAPA 3: Verificar se o usuário existe
    console.log('👤 ETAPA 3 - Verificando existência do usuário:', userId);
    const { data: userExists, error: userExistsError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .maybeSingle();

    if (userExistsError) {
      console.error('❌ ERRO ETAPA 3: Erro ao verificar usuário:', userExistsError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro ao verificar dados do usuário. Tente novamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!userExists) {
      console.error('❌ ERRO ETAPA 3: Usuário não encontrado:', userId);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Usuário não encontrado. Verifique se você está logado corretamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ ETAPA 3 SUCESSO: Usuário encontrado:', userExists);

    // ✅ ETAPA 4: Buscar agentes do usuário
    console.log('🔍 ETAPA 4 - Buscando agentes para o usuário:', userId);
    const { data: allAgents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId);

    if (agentsError) {
      console.error('❌ ERRO ETAPA 4: Erro ao buscar agentes:', agentsError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro ao buscar configurações de agentes. Tente novamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 ETAPA 4 - Total de agentes encontrados:', allAgents?.length || 0);
    if (allAgents && allAgents.length > 0) {
      console.log('📊 ETAPA 4 - Detalhes dos agentes:');
      allAgents.forEach((agent, index) => {
        console.log(`📊   Agente ${index + 1}:`, {
          id: agent.id,
          name: agent.name,
          channel: agent.channel,
          active: agent.active,
          user_id: agent.user_id,
          hasSystemPrompt: !!agent.system_prompt
        });
      });
    } else {
      console.log('❌ ERRO ETAPA 4: Nenhum agente encontrado para o usuário');
    }

    // ✅ ETAPA 5: Filtrar agentes ativos
    const activeAgents = allAgents?.filter(agent => agent.active === true) || [];
    console.log('🎯 ETAPA 5 - Agentes ativos:', activeAgents.length);

    if (activeAgents.length === 0) {
      console.error('❌ ERRO ETAPA 5: Nenhum agente ativo encontrado');
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Nenhum agente ativo encontrado. Ative pelo menos um agente no painel de administração.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ ETAPA 6: Buscar agente de widget
    console.log('🎯 ETAPA 6 - Buscando agente de widget...');
    const widgetAgents = activeAgents.filter(agent => {
      const channel = (agent.channel || '').toLowerCase().trim();
      console.log('🔍 Verificando agente:', agent.name, 'canal:', `"${channel}"`);
      
      const isWidgetAgent = channel === 'widget do site' || 
                           channel === 'widget' || 
                           channel.includes('widget') || 
                           channel.includes('site') || 
                           channel.includes('web');
      
      console.log('🔍 É agente widget?', isWidgetAgent);
      return isWidgetAgent;
    });

    console.log('🎯 ETAPA 6 - Agentes de widget encontrados:', widgetAgents.length);

    if (widgetAgents.length === 0) {
      console.error('❌ ERRO ETAPA 6: Nenhum agente de widget encontrado');
      console.error('❌ Canais disponíveis:', activeAgents.map(a => a.channel));
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Nenhum agente configurado para widget. Configure um agente com canal "Widget do Site" no painel.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agent = widgetAgents[0];
    console.log('✅ ETAPA 6 SUCESSO: Usando agente:', {
      id: agent.id,
      name: agent.name,
      channel: agent.channel,
      user_id: agent.user_id,
      hasSystemPrompt: !!agent.system_prompt,
      systemPromptLength: agent.system_prompt?.length || 0
    });

    // ✅ ETAPA 7: Buscar chave OpenAI do usuário
    console.log('🔑 ETAPA 7 - Buscando chave OpenAI para o usuário:', userId);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('openai_key, name, email')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error('❌ ERRO ETAPA 7: Erro ao buscar dados do usuário:', userError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro ao acessar configurações da conta. Verifique sua conta.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🔑 ETAPA 7 - Dados do usuário:', {
      hasUserData: !!userData,
      hasOpenAIKey: !!userData?.openai_key,
      openAIKeyLength: userData?.openai_key?.length || 0,
      keyPreview: userData?.openai_key ? `${userData.openai_key.substring(0, 7)}...` : 'null'
    });

    if (!userData?.openai_key) {
      console.error('❌ ERRO ETAPA 7: Chave OpenAI não encontrada');
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Chave OpenAI não configurada. Configure sua chave no perfil do usuário para usar o chat.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ ETAPA 8: Preparar mensagens para OpenAI
    console.log('🤖 ETAPA 8 - Preparando chamada para OpenAI...');
    const systemPrompt = agent.system_prompt || 'Você é um assistente virtual útil e prestativo que responde em português brasileiro de forma clara e educada.';
    
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

    console.log('🤖 ETAPA 8 - Configuração OpenAI:');
    console.log('🤖 System prompt length:', systemPrompt.length);
    console.log('🤖 System prompt preview:', systemPrompt.substring(0, 100) + '...');
    console.log('🤖 User message:', message);
    console.log('🤖 Total messages:', messages.length);

    // ✅ ETAPA 9: Chamar OpenAI
    console.log('📡 ETAPA 9 - Fazendo requisição para OpenAI...');
    let openaiResponse;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ TIMEOUT: Requisição OpenAI cancelada por timeout');
        controller.abort();
      }, 30000);

      console.log('📡 Enviando para OpenAI:', {
        model: 'gpt-4o-mini',
        messagesCount: messages.length,
        maxTokens: 1000,
        temperature: 0.7
      });

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
      console.log('📡 ETAPA 9 - Status da resposta OpenAI:', openaiResponse.status);
      console.log('📡 ETAPA 9 - Headers da resposta:', Object.fromEntries(openaiResponse.headers.entries()));
      
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('❌ ERRO ETAPA 9: Resposta HTTP não OK');
        console.error('❌ Status:', openaiResponse.status);
        console.error('❌ Erro OpenAI:', errorText);
        
        if (openaiResponse.status === 401) {
          return new Response(JSON.stringify({ 
            success: true, 
            reply: 'Chave OpenAI inválida ou expirada. Verifique suas configurações no perfil.' 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (openaiResponse.status === 429) {
          return new Response(JSON.stringify({ 
            success: true, 
            reply: 'Limite de uso da OpenAI atingido. Tente novamente em alguns minutos.' 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({ 
            success: true, 
            reply: `Erro na API OpenAI (${openaiResponse.status}). Tente novamente em alguns instantes.` 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

    } catch (fetchError) {
      console.error('❌ ERRO ETAPA 9: Erro na requisição para OpenAI:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ 
          success: true, 
          reply: 'Tempo limite excedido na comunicação com OpenAI. Tente novamente.' 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro de conexão com OpenAI. Verifique sua conexão e tente novamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ ETAPA 10: Processar resposta da OpenAI
    console.log('📖 ETAPA 10 - Processando resposta da OpenAI...');
    
    let aiResponse;
    try {
      aiResponse = await openaiResponse.json();
      console.log('📖 ETAPA 10 - Resposta OpenAI parseada:', {
        hasChoices: !!aiResponse.choices,
        choicesLength: aiResponse.choices?.length || 0,
        hasContent: !!aiResponse.choices?.[0]?.message?.content,
        usage: aiResponse.usage
      });
    } catch (parseError) {
      console.error('❌ ERRO ETAPA 10: Erro ao parsear resposta OpenAI:', parseError);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Erro ao processar resposta da OpenAI. Tente novamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const replyText = aiResponse.choices?.[0]?.message?.content;

    if (!replyText) {
      console.error('❌ ERRO ETAPA 10: Nenhum conteúdo na resposta da OpenAI');
      console.error('❌ Resposta completa:', JSON.stringify(aiResponse, null, 2));
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Resposta vazia da OpenAI. Tente reformular sua pergunta.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ ETAPA 10 SUCESSO: Resposta gerada');
    console.log('✅ Resposta length:', replyText.length);
    console.log('✅ Resposta preview:', replyText.substring(0, 200) + '...');

    // ✅ ETAPA 11: Salvar conversa (opcional)
    console.log('💾 ETAPA 11 - Tentando salvar conversa...');
    const sessionKey = sessionId || `widget_session_${Date.now()}`;
    const conversationMessages = [...messages, { role: 'assistant', content: replyText }];
    
    try {
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
            messages: conversationMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConversation.id);
        console.log('💾 ETAPA 11: Conversa atualizada');
      } else {
        await supabase
          .from('agent_conversations')
          .insert({
            agent_id: agent.id,
            user_session_id: sessionKey,
            messages: conversationMessages
          });
        console.log('💾 ETAPA 11: Nova conversa criada');
      }
    } catch (dbError) {
      console.error('⚠️ ETAPA 11: Erro ao salvar conversa (não crítico):', dbError);
    }

    console.log('🎉 ===========================================');
    console.log('🎉 SUCESSO: Widget webhook finalizado com sucesso!');
    console.log('🎉 Resposta enviada para o usuário');
    console.log('🎉 ===========================================');

    return new Response(JSON.stringify({ 
      success: true, 
      reply: replyText 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 ===========================================');
    console.error('💥 ERRO GERAL no widget-webhook:', error);
    console.error('💥 Stack trace:', error.stack);
    console.error('💥 ===========================================');
    
    return new Response(JSON.stringify({ 
      success: true, 
      reply: 'Erro interno do sistema. Nossa equipe foi notificada. Tente novamente em alguns instantes.' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
