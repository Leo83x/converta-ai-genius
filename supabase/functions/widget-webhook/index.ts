
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
  console.log('🚀 Headers:', Object.fromEntries(req.headers.entries()));
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
        success: false, 
        error: 'Erro de configuração do servidor' 
      }), {
        status: 500,
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
        success: false, 
        error: 'Formato de dados inválido' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userId, sessionId } = parsedBody;
    
    console.log('📊 ETAPA 2 - Dados extraídos:');
    console.log('📊 message:', message);
    console.log('📊 userId:', userId);
    console.log('📊 sessionId:', sessionId);

    if (!message || !userId) {
      console.error('❌ ERRO ETAPA 2: Parâmetros obrigatórios ausentes');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Dados incompletos' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ ETAPA 3: Verificar se o usuário existe e buscar chave OpenAI
    console.log('👤 ETAPA 3 - Buscando dados do usuário:', userId);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, openai_key')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error('❌ ERRO ETAPA 3: Erro ao buscar usuário:', userError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Erro ao verificar usuário' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!userData) {
      console.error('❌ ERRO ETAPA 3: Usuário não encontrado:', userId);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Usuário não encontrado' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ ETAPA 3 SUCESSO: Usuário encontrado:', {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      hasOpenAIKey: !!userData.openai_key
    });

    // ✅ ETAPA 4: Verificar chave OpenAI
    console.log('🔑 ETAPA 4 - Verificando chave OpenAI...');
    
    if (!userData.openai_key) {
      console.error('❌ ERRO ETAPA 4: Chave OpenAI não configurada');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Chave OpenAI não configurada' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validação e limpeza da chave OpenAI
    let openaiKey = userData.openai_key;
    if (typeof openaiKey === 'string') {
      openaiKey = openaiKey.trim();
    }
    
    console.log('🔍 Validando chave OpenAI...');
    console.log('🔍 Tipo da chave:', typeof openaiKey);
    console.log('🔍 Chave preview:', openaiKey ? openaiKey.substring(0, 10) + '...' : 'undefined');
    console.log('🔍 Comprimento da chave:', openaiKey ? openaiKey.length : 0);
    
    if (!openaiKey || typeof openaiKey !== 'string' || !openaiKey.startsWith('sk-') || openaiKey.length < 20) {
      console.error('❌ ERRO ETAPA 4: Formato da chave OpenAI inválido');
      console.error('❌ Chave recebida:', openaiKey ? openaiKey.substring(0, 10) + '...' : 'undefined');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Chave OpenAI com formato inválido' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ ETAPA 4 SUCESSO: Chave OpenAI válida:', openaiKey.substring(0, 10) + '...');

    // ✅ ETAPA 5: Buscar agentes do usuário
    console.log('🔍 ETAPA 5 - Buscando agentes para o usuário:', userId);
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (agentsError) {
      console.error('❌ ERRO ETAPA 5: Erro ao buscar agentes:', agentsError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Erro ao buscar agentes' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 ETAPA 5 - Agentes ativos encontrados:', agents?.length || 0);

    if (!agents || agents.length === 0) {
      console.error('❌ ERRO ETAPA 5: Nenhum agente ativo encontrado');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Nenhum agente ativo encontrado' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ ETAPA 6: Buscar agente de widget
    console.log('🎯 ETAPA 6 - Buscando agente de widget...');
    const widgetAgents = agents.filter(agent => {
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

    if (widgetAgents.length === 0) {
      console.error('❌ ERRO ETAPA 6: Nenhum agente de widget encontrado');
      console.error('❌ Canais disponíveis:', agents.map(a => a.channel));
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Nenhum agente configurado para widget' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agent = widgetAgents[0];
    console.log('✅ ETAPA 6 SUCESSO: Usando agente:', {
      id: agent.id,
      name: agent.name,
      channel: agent.channel,
      hasSystemPrompt: !!agent.system_prompt
    });

    // ✅ ETAPA 7: Chamar OpenAI
    console.log('📡 ETAPA 7 - Fazendo requisição para OpenAI...');
    
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

    console.log('🤖 Configuração OpenAI:');
    console.log('🤖 System prompt length:', systemPrompt.length);
    console.log('🤖 User message:', message);
    console.log('🤖 OpenAI Key (preview):', openaiKey.substring(0, 10) + '...');

    let openaiResponse;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ TIMEOUT: Requisição OpenAI cancelada por timeout');
        controller.abort();
      }, 30000);

      console.log('📡 Enviando para OpenAI...');

      const requestPayload = {
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      };

      console.log('📡 Payload para OpenAI:', JSON.stringify(requestPayload, null, 2));

      openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Converta-Widget/1.0',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('📡 Status da resposta OpenAI:', openaiResponse.status);
      console.log('📡 Headers da resposta OpenAI:', Object.fromEntries(openaiResponse.headers.entries()));
      
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('❌ ERRO ETAPA 7: Resposta HTTP não OK');
        console.error('❌ Status:', openaiResponse.status);
        console.error('❌ Status Text:', openaiResponse.statusText);
        console.error('❌ Erro OpenAI:', errorText);
        console.error('❌ Chave usada:', openaiKey.substring(0, 15) + '...');
        
        let errorMessage = 'Erro na comunicação com OpenAI';
        
        if (openaiResponse.status === 401) {
          errorMessage = 'Chave OpenAI inválida ou expirada - verifique se a chave está correta no seu perfil';
        } else if (openaiResponse.status === 429) {
          errorMessage = 'Limite de uso da OpenAI atingido';
        } else if (openaiResponse.status === 400) {
          errorMessage = 'Requisição inválida para OpenAI';
        }
        
        return new Response(JSON.stringify({ 
          success: false, 
          error: errorMessage,
          details: {
            status: openaiResponse.status,
            statusText: openaiResponse.statusText,
            error: errorText,
            keyPreview: openaiKey.substring(0, 15) + '...'
          }
        }), {
          status: openaiResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

    } catch (fetchError) {
      console.error('❌ ERRO ETAPA 7: Erro na requisição para OpenAI:', fetchError);
      
      let errorMessage = 'Erro de conexão com OpenAI';
      
      if (fetchError.name === 'AbortError') {
        errorMessage = 'Tempo limite excedido na comunicação com OpenAI';
      }
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: {
          name: fetchError.name,
          message: fetchError.message
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ ETAPA 8: Processar resposta da OpenAI
    console.log('📖 ETAPA 8 - Processando resposta da OpenAI...');
    
    let aiResponse;
    try {
      aiResponse = await openaiResponse.json();
      console.log('📖 Resposta OpenAI completa:', JSON.stringify(aiResponse, null, 2));
    } catch (parseError) {
      console.error('❌ ERRO ETAPA 8: Erro ao parsear resposta OpenAI:', parseError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Erro ao processar resposta da OpenAI' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const replyText = aiResponse.choices?.[0]?.message?.content;

    if (!replyText) {
      console.error('❌ ERRO ETAPA 8: Nenhum conteúdo na resposta da OpenAI');
      console.error('❌ Estrutura da resposta:', JSON.stringify(aiResponse, null, 2));
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Resposta vazia da OpenAI' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ ETAPA 8 SUCESSO: Resposta gerada');
    console.log('✅ Resposta preview:', replyText.substring(0, 200) + '...');

    // ✅ ETAPA 9: Salvar conversa e criar/atualizar lead
    console.log('💾 ETAPA 9 - Salvando conversa e processando lead...');
    const sessionKey = sessionId || `widget_session_${Date.now()}`;
    const conversationMessages = [...messages, { role: 'assistant', content: replyText }];
    
    try {
      // Salvar/atualizar conversa
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
        console.log('💾 Conversa atualizada');
      } else {
        await supabase
          .from('agent_conversations')
          .insert({
            agent_id: agent.id,
            user_session_id: sessionKey,
            messages: conversationMessages
          });
        console.log('💾 Nova conversa criada');
      }

      // ✅ ETAPA 10: Criar ou atualizar lead automaticamente
      console.log('🎯 ETAPA 10 - Processando lead...');
      
      // Verificar se já existe um lead para esta sessão
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, name, phone, email')
        .eq('user_id', userId)
        .ilike('notes', `%${sessionKey}%`)
        .maybeSingle();

      if (!existingLead) {
        // Extrair informações do usuário da mensagem
        let leadName = 'Lead do Widget';
        let leadPhone = '';
        let leadEmail = '';

        // Tentar extrair nome da mensagem
        const nameMatch = message.toLowerCase().match(/(?:me chamo|meu nome é|sou|nome:|^|\s)([a-záêôçã\s]{2,30})(?:\s|$|\.|,)/i);
        if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 2) {
          leadName = nameMatch[1].trim();
        }

        // Tentar extrair telefone
        const phoneMatch = message.match(/(\(?[0-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4})/);
        if (phoneMatch) {
          leadPhone = phoneMatch[1];
        }

        // Tentar extrair email
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          leadEmail = emailMatch[1];
        }

        // Criar novo lead
        const { error: leadError } = await supabase
          .from('leads')
          .insert({
            user_id: userId,
            name: leadName,
            phone: leadPhone || null,
            email: leadEmail || null,
            source: 'Widget do Site',
            stage: 'new',
            score: Math.floor(Math.random() * 80) + 20, // Score entre 20-100
            notes: `Lead gerado automaticamente do widget\nSessão: ${sessionKey}\nAgente: ${agent.name}\nPrimeira mensagem: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`
          });

        if (leadError) {
          console.error('⚠️ Erro ao criar lead (não crítico):', leadError);
        } else {
          console.log('🎯 Novo lead criado com sucesso');
        }
      } else {
        console.log('🎯 Lead já existe para esta sessão');
      }

    } catch (dbError) {
      console.error('⚠️ Erro ao salvar conversa/lead (não crítico):', dbError);
    }

    console.log('🎉 ===========================================');
    console.log('🎉 SUCESSO: Widget webhook finalizado!');
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
      success: false, 
      error: 'Erro interno do sistema',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
