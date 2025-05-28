
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export const WidgetTestConnection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const runFullTest = async () => {
    if (!user) return;
    
    setTesting(true);
    const results: TestResult[] = [];
    
    const updateResult = (step: string, status: 'pending' | 'success' | 'error', message: string, details?: any) => {
      const newResult = { step, status, message, details };
      results.push(newResult);
      setTestResults([...results]);
    };

    try {
      // Teste 1: Verificar usuário
      updateResult('user', 'pending', 'Verificando dados do usuário...');
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (userError || !userData) {
        updateResult('user', 'error', 'Usuário não encontrado na base de dados', userError);
        setTesting(false);
        return;
      }
      
      updateResult('user', 'success', `Usuário encontrado: ${userData.name || userData.email}`, userData);

      // Teste 2: Verificar chave OpenAI
      updateResult('openai', 'pending', 'Verificando chave OpenAI...');
      
      if (!userData.openai_key) {
        updateResult('openai', 'error', 'Chave OpenAI não configurada no perfil');
        setTesting(false);
        return;
      }

      if (!userData.openai_key.startsWith('sk-')) {
        updateResult('openai', 'error', 'Chave OpenAI com formato inválido (deve começar com sk-)');
        setTesting(false);
        return;
      }
      
      updateResult('openai', 'success', `Chave OpenAI configurada e válida (${userData.openai_key.substring(0, 7)}...)`);

      // Teste 3: Verificar agentes
      updateResult('agents', 'pending', 'Verificando agentes configurados...');
      
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id);

      if (agentsError) {
        updateResult('agents', 'error', 'Erro ao buscar agentes', agentsError);
        setTesting(false);
        return;
      }

      if (!agents || agents.length === 0) {
        updateResult('agents', 'error', 'Nenhum agente encontrado');
        setTesting(false);
        return;
      }

      const activeAgents = agents.filter(a => a.active);
      if (activeAgents.length === 0) {
        updateResult('agents', 'error', 'Nenhum agente ativo encontrado');
        setTesting(false);
        return;
      }

      const widgetAgents = activeAgents.filter(agent => {
        const channel = (agent.channel || '').toLowerCase().trim();
        return channel === 'widget do site' || 
               channel === 'widget' || 
               channel.includes('widget') || 
               channel.includes('site') || 
               channel.includes('web');
      });

      if (widgetAgents.length === 0) {
        updateResult('agents', 'error', 'Nenhum agente configurado para widget', { 
          totalAgents: agents.length, 
          activeAgents: activeAgents.length,
          channels: activeAgents.map(a => a.channel)
        });
        setTesting(false);
        return;
      }

      const widgetAgent = widgetAgents[0];
      updateResult('agents', 'success', `Agente widget encontrado: ${widgetAgent.name}`, widgetAgent);

      // Teste 4: Verificar system prompt
      updateResult('prompt', 'pending', 'Verificando configuração do prompt...');
      
      if (!widgetAgent.system_prompt || widgetAgent.system_prompt.trim().length === 0) {
        updateResult('prompt', 'error', 'System prompt não configurado no agente');
        setTesting(false);
        return;
      }
      
      updateResult('prompt', 'success', `System prompt configurado (${widgetAgent.system_prompt.length} caracteres)`);

      // Teste 5: Testar conexão com OpenAI
      updateResult('openai_test', 'pending', 'Testando conexão com OpenAI...');
      
      try {
        console.log('🧪 Iniciando teste OpenAI para usuário:', user.id);
        
        const testResponse = await fetch('https://xekxewtggioememydenu.supabase.co/functions/v1/widget-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Teste de conexão - responda apenas com "Conexão OK"',
            userId: user.id,
            sessionId: `test_${Date.now()}`
          })
        });

        console.log('🧪 Status da resposta:', testResponse.status);
        console.log('🧪 Headers da resposta:', Object.fromEntries(testResponse.headers.entries()));

        const testData = await testResponse.json();
        console.log('🧪 Dados da resposta:', testData);
        
        if (testResponse.ok && testData.success && testData.reply) {
          updateResult('openai_test', 'success', 'Teste de conexão com OpenAI realizado com sucesso', {
            status: testResponse.status,
            reply: testData.reply
          });
        } else {
          updateResult('openai_test', 'error', `Erro no teste: ${testData.error || 'Resposta inválida'}`, {
            status: testResponse.status,
            data: testData
          });
        }
        
      } catch (testError) {
        console.error('🧪 Erro no teste OpenAI:', testError);
        updateResult('openai_test', 'error', 'Erro ao testar conexão com OpenAI', {
          error: testError.message,
          name: testError.name
        });
      }

    } catch (error) {
      console.error('Erro no teste completo:', error);
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro durante o teste de validação.",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnóstico de Conexão do Widget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Execute este teste para validar todas as configurações necessárias para o funcionamento do widget.
        </p>
        
        <Button 
          onClick={runFullTest} 
          disabled={testing || !user}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executando Diagnóstico...
            </>
          ) : (
            'Executar Diagnóstico Completo'
          )}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold">Resultados do Diagnóstico:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">
                      {result.step === 'user' ? 'Usuário' :
                       result.step === 'openai' ? 'Chave OpenAI' :
                       result.step === 'agents' ? 'Agentes' :
                       result.step === 'prompt' ? 'System Prompt' :
                       result.step === 'openai_test' ? 'Teste OpenAI' : result.step}
                    </span>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status === 'pending' ? 'Executando' : 
                       result.status === 'success' ? 'Sucesso' : 'Erro'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Ver detalhes</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
