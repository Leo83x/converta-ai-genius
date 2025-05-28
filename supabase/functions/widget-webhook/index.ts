
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
    console.log('📝 Corpo da requisição recebido:', requestBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
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
    console.log('📋 Dados extraídos:', { message: !!message, userId, sessionId });

    if (!message || !userId) {
      console.error('❌ Parâmetros obrigatórios ausentes:', { message: !!message, userId: !!userId });
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Parâmetros inválidos. Por favor, recarregue a página e tente novamente.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar agentes ativos do usuário com mais detalhes de log
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

    console.log('📊 Total de agentes encontrados:', agents?.length || 0);
    console.log('🔍 Agentes disponíveis:', agents?.map(a => ({ id: a.id, name: a.name, channel: a.channel })));

    // Verificar agentes compatíveis com widget (busca mais flexível)
    const widgetAgents = agents?.filter(agent => {
      const channel = agent.channel?.toLowerCase();
      console.log('🔍 Verificando canal do agente:', agent.name, 'canal:', channel);
      return channel === 'widget' || 
             channel === 'widget do site' || 
             channel?.includes('widget') ||
             channel === 'site' ||
             channel?.includes('web');
    }) || [];

    console.log('🎯 Agentes de widget encontrados:', widgetAgents.length);
    console.log('🎯 Detalhes dos agentes widget:', widgetAgents.map(a => ({ 
      id: a.id, 
      name: a.name, 
      channel: a.channel,
      systemPrompt: a.system_prompt?.substring(0, 100) + '...'
    })));

    if (widgetAgents.length === 0) {
      console.log('⚠️ Nenhum agente de widget encontrado para o usuário:', userId);
      return new Response(JSON.stringify({ 
        success: true, 
        reply: 'Não há agentes configurados para o widget. Configure um agente com canal "Widget do Site" no painel de administração.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agent = widgetAgents[0];
    console.log('✅ Usando agente:', agent.name, 'ID:', agent.id, 'Canal:', agent.channel);

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

    console.log('✅ Chave OpenAI encontrada e configurada');

    // Buscar histórico da conversa
    const sessionKey = sessionId || 'widget_session_default';
    console.log('📚 Buscando histórico para sessão:', sessionKey);
    
    const { data: conversationData } = await supabase
      .from('agent_conversations')
      .select('messages')
      .eq('agent_id', agent.id)
      .eq('user_session_id', sessionKey)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('📚 Histórico de conversa:', conversationData ? 'Encontrado' : 'Não encontrado');

    // Preparar mensagens para OpenAI
    let messages = [
      {
        role: 'system',
        content: agent.system_prompt || 'Você é um assistente virtual útil e prestativo que responde em português brasileiro.'
      }
    ];

    // Adicionar histórico se existir
    if (conversationData?.messages && Array.isArray(conversationData.messages)) {
      const historyMessages = conversationData.messages.slice(-8); // Últimas 8 mensagens para contexto
      messages = [...messages, ...historyMessages];
      console.log('📚 Adicionado histórico de', historyMessages.length, 'mensagens');
    }

    // Adicionar mensagem atual
    messages.push({
      role: 'user',
      content: message
    });

    console.log('🤖 Enviando para OpenAI com', messages.length, 'mensagens');
    console.log('🤖 Sistema prompt:', agent.system_prompt?.substring(0, 100) + '...');

    // Chamar OpenAI com timeout e retry
    let openaiResponse;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Tentativa ${attempts} de chamada para OpenAI`);
      
      try {
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
        });

        console.log('📡 Status da resposta OpenAI (tentativa', attempts + '):', openaiResponse.status);
        
        if (openaiResponse.ok) {
          break; // Sucesso, sair do loop
        }
        
        if (openaiResponse.status === 401) {
          console.error('❌ Chave OpenAI inválida ou expirada');
          return new Response(JSON.stringify({ 
            success: true, 
            reply: 'Chave OpenAI inválida ou expirada. Verifique suas configurações no perfil.' 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (attempts === maxAttempts) {
          throw new Error(`HTTP ${openaiResponse.status}: ${await openaiResponse.text()}`);
        }

        // Aguardar antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (fetchError) {
        console.error(`❌ Erro na tentativa ${attempts} para OpenAI:`, fetchError);
        
        if (attempts === maxAttempts) {
          return new Response(JSON.stringify({ 
            success: true, 
            reply: 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.' 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    const aiResponse = await openaiResponse.json();
    console.log('✅ Resposta OpenAI recebida com sucesso');
    
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

    console.log('💬 Resposta gerada:', replyText.substring(0, 100) + '...');

    // Salvar/atualizar conversa
    const updatedMessages = [...messages, { role: 'assistant', content: replyText }];
    
    try {
      if (conversationData) {
        console.log('📝 Atualizando conversa existente');
        const { error: updateError } = await supabase
          .from('agent_conversations')
          .update({ 
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('agent_id', agent.id)
          .eq('user_session_id', sessionKey);
          
        if (updateError) {
          console.error('⚠️ Erro ao atualizar conversa:', updateError);
        } else {
          console.log('✅ Conversa atualizada com sucesso');
        }
      } else {
        console.log('📝 Criando nova conversa');
        const { error: insertError } = await supabase
          .from('agent_conversations')
          .insert({
            agent_id: agent.id,
            user_session_id: sessionKey,
            messages: updatedMessages
          });
          
        if (insertError) {
          console.error('⚠️ Erro ao criar conversa:', insertError);
        } else {
          console.log('✅ Nova conversa criada com sucesso');
        }
      }
    } catch (dbError) {
      console.error('⚠️ Erro ao salvar no banco:', dbError);
      // Não falhar a resposta por causa de erro de salvamento
    }

    console.log('🎉 Resposta do widget gerada com sucesso');

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
