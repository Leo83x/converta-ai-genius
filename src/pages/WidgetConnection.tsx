import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const WidgetConnection = () => {
  const [widgetCode, setWidgetCode] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    welcomeMessage: 'Olá! Como posso ajudar você hoje?',
    position: 'bottom-right',
    theme: 'blue',
    title: 'Chat Converta+',
    enabled: true
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Verificar se já existe um widget gerado
    const savedConfig = localStorage.getItem(`widget_config_${user?.id}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setWidgetConfig(config);
      if (config.enabled) {
        generateWidgetCode(config);
      }
    }
  }, [user]);

  const generateWidgetCode = (config = widgetConfig) => {
    const widgetId = `converta_${user?.id || 'demo'}_${Date.now()}`;
    
    const code = `<!-- Converta+ Chat Widget -->
<script>
  window.ConvertaPlus = {
    widgetId: '${widgetId}',
    userId: '${user?.id || 'demo'}',
    position: '${config.position}',
    theme: '${config.theme}',
    title: '${config.title}',
    welcomeMessage: '${config.welcomeMessage}',
    apiUrl: 'https://xekxewtggioememydenu.supabase.co/functions/v1/widget-webhook'
  };
</script>
<script>
  (function() {
    // Criar CSS do widget
    var style = document.createElement('style');
    style.textContent = \`
      .converta-widget-container {
        position: fixed;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .converta-widget-container.bottom-right { bottom: 20px; right: 20px; }
      .converta-widget-container.bottom-left { bottom: 20px; left: 20px; }
      .converta-widget-container.top-right { top: 20px; right: 20px; }
      .converta-widget-container.top-left { top: 20px; left: 20px; }
      
      .converta-widget-button {
        width: 60px; height: 60px; border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease; color: white; font-size: 24px;
      }
      .converta-widget-button:hover { transform: scale(1.1); }
      
      .converta-widget-chat {
        position: absolute; bottom: 70px; right: 0;
        width: 350px; height: 500px; background: white;
        border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        display: none; flex-direction: column; overflow: hidden;
      }
      .converta-widget-chat.open { display: flex; }
      
      .converta-widget-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white; padding: 16px; font-weight: 600;
      }
      
      .converta-widget-messages {
        flex: 1; padding: 16px; overflow-y: auto; background: #f8f9fa;
      }
      
      .converta-widget-input {
        padding: 16px; border-top: 1px solid #e9ecef;
        display: flex; gap: 8px;
      }
      .converta-widget-input input {
        flex: 1; border: 1px solid #ddd; border-radius: 20px;
        padding: 8px 16px; outline: none;
      }
      .converta-widget-input button {
        background: #667eea; color: white; border: none;
        border-radius: 50%; width: 36px; height: 36px;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
      }
      .converta-widget-input button:disabled {
        background: #ccc; cursor: not-allowed;
      }
      
      .message { margin-bottom: 12px; }
      .message.bot { text-align: left; }
      .message.user { text-align: right; }
      .message .content {
        display: inline-block; padding: 8px 12px; border-radius: 12px;
        max-width: 80%; font-size: 14px; line-height: 1.4;
      }
      .message.bot .content { background: #e9ecef; color: #333; }
      .message.user .content { background: #667eea; color: white; }
      
      .typing-indicator {
        display: none; text-align: left; margin-bottom: 12px;
      }
      .typing-indicator .content {
        background: #e9ecef; color: #666; padding: 8px 12px;
        border-radius: 12px; font-style: italic;
      }
      
      .error-message .content {
        background: #fee; color: #d33; border: 1px solid #fdd;
      }
    \`;
    document.head.appendChild(style);
    
    // Inicializar widget
    function initWidget() {
      var container = document.createElement('div');
      container.className = 'converta-widget-container ' + window.ConvertaPlus.position;
      
      container.innerHTML = \`
        <div class="converta-widget-chat" id="converta-chat">
          <div class="converta-widget-header">
            <div>\${window.ConvertaPlus.title}</div>
          </div>
          <div class="converta-widget-messages" id="converta-messages">
            <div class="message bot">
              <div class="content">\${window.ConvertaPlus.welcomeMessage}</div>
            </div>
          </div>
          <div class="typing-indicator" id="typing-indicator">
            <div class="content">O agente está digitando...</div>
          </div>
          <div class="converta-widget-input">
            <input type="text" placeholder="Digite sua mensagem..." id="converta-input">
            <button onclick="sendMessage()" id="send-button">➤</button>
          </div>
        </div>
        <button class="converta-widget-button" onclick="toggleChat()">
          💬
        </button>
      \`;
      
      document.body.appendChild(container);
      
      // Gerar session ID único
      window.ConvertaPlus.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Funções do widget
      window.toggleChat = function() {
        var chat = document.getElementById('converta-chat');
        chat.classList.toggle('open');
      };
      
      window.sendMessage = async function() {
        var input = document.getElementById('converta-input');
        var sendButton = document.getElementById('send-button');
        var message = input.value.trim();
        if (!message) return;
        
        var messages = document.getElementById('converta-messages');
        var typingIndicator = document.getElementById('typing-indicator');
        
        // Adicionar mensagem do usuário
        var userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.innerHTML = '<div class="content">' + escapeHtml(message) + '</div>';
        messages.appendChild(userMsg);
        
        input.value = '';
        input.disabled = true;
        sendButton.disabled = true;
        messages.scrollTop = messages.scrollHeight;
        
        // Mostrar indicador de digitação
        typingIndicator.style.display = 'block';
        messages.scrollTop = messages.scrollHeight;
        
        try {
          console.log('🚀 Enviando mensagem para:', window.ConvertaPlus.apiUrl);
          console.log('📝 Dados da mensagem:', {
            message: message,
            userId: window.ConvertaPlus.userId,
            sessionId: window.ConvertaPlus.sessionId
          });
          
          const requestData = {
            message: message,
            userId: window.ConvertaPlus.userId,
            sessionId: window.ConvertaPlus.sessionId
          };
          
          console.log('📦 Enviando dados:', JSON.stringify(requestData));
          
          const response = await fetch(window.ConvertaPlus.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
          });
          
          console.log('📡 Status da resposta:', response.status);
          console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro HTTP:', response.status, errorText);
            throw new Error(\`Erro HTTP: \${response.status} - \${errorText}\`);
          }
          
          const data = await response.json();
          console.log('✅ Dados recebidos:', data);
          
          // Esconder indicador de digitação
          typingIndicator.style.display = 'none';
          
          if (data.success && data.reply) {
            var botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.innerHTML = '<div class="content">' + escapeHtml(data.reply) + '</div>';
            messages.appendChild(botMsg);
          } else {
            console.error('❌ Resposta inválida:', data);
            throw new Error('Resposta inválida do servidor');
          }
          
        } catch (error) {
          console.error('❌ Erro ao enviar mensagem:', error);
          typingIndicator.style.display = 'none';
          
          var errorMsg = document.createElement('div');
          errorMsg.className = 'message bot error-message';
          
          let errorText = 'Erro de comunicação com o servidor. Tente novamente.';
          
          errorMsg.innerHTML = '<div class="content">' + errorText + '</div>';
          messages.appendChild(errorMsg);
          
        } finally {
          input.disabled = false;
          sendButton.disabled = false;
          messages.scrollTop = messages.scrollHeight;
          input.focus();
        }
      };
      
      // Função para escapar HTML
      function escapeHtml(text) {
        var map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      }
      
      // Enter para enviar
      document.getElementById('converta-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }
    
    // Inicializar quando a página carregar
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initWidget);
    } else {
      initWidget();
    }
  })();
</script>`;

    setWidgetCode(code);
    setIsGenerated(true);
    
    // Salvar configuração
    localStorage.setItem(`widget_config_${user?.id}`, JSON.stringify(config));
  };

  const generateWidget = () => {
    const updatedConfig = { ...widgetConfig, enabled: true };
    setWidgetConfig(updatedConfig);
    generateWidgetCode(updatedConfig);
    
    toast({
      title: "Widget gerado!",
      description: "Copie o código e cole no seu site",
    });
  };

  const updateConfig = (key: string, value: string | boolean) => {
    const newConfig = { ...widgetConfig, [key]: value };
    setWidgetConfig(newConfig);
    
    if (isGenerated && newConfig.enabled) {
      generateWidgetCode(newConfig);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetCode);
    toast({
      title: "Código copiado!",
      description: "Cole no <head> ou antes do </body> do seu site",
    });
  };

  const disableWidget = () => {
    const newConfig = { ...widgetConfig, enabled: false };
    setWidgetConfig(newConfig);
    setIsGenerated(false);
    setWidgetCode('');
    localStorage.setItem(`widget_config_${user?.id}`, JSON.stringify(newConfig));
    
    toast({
      title: "Widget desabilitado",
      description: "O widget foi desabilitado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Converta+
            </h1>
            <Button variant="outline" onClick={() => navigate('/integrations')}>
              Voltar às Integrações
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Widget do Site</h2>
          <p className="text-gray-600">Configure e adicione um chat inteligente ao seu website</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Widget Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💬</span>
                  <span>Configuração do Widget</span>
                </div>
                {isGenerated && (
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Personalize a aparência e comportamento do seu widget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Chat</Label>
                  <Input
                    id="title"
                    value={widgetConfig.title}
                    onChange={(e) => updateConfig('title', e.target.value)}
                    placeholder="Chat Converta+"
                  />
                </div>

                <div>
                  <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={widgetConfig.welcomeMessage}
                    onChange={(e) => updateConfig('welcomeMessage', e.target.value)}
                    placeholder="Olá! Como posso ajudar você hoje?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="position">Posição na Tela</Label>
                  <select
                    id="position"
                    value={widgetConfig.position}
                    onChange={(e) => updateConfig('position', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="bottom-right">Canto Inferior Direito</option>
                    <option value="bottom-left">Canto Inferior Esquerdo</option>
                    <option value="top-right">Canto Superior Direito</option>
                    <option value="top-left">Canto Superior Esquerdo</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={widgetConfig.enabled}
                    onCheckedChange={(checked) => updateConfig('enabled', checked)}
                  />
                  <Label>Widget Habilitado</Label>
                </div>

                <div className="space-y-3">
                  {!isGenerated ? (
                    <Button
                      onClick={generateWidget}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={!widgetConfig.enabled}
                    >
                      Gerar Código do Widget
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={copyToClipboard}
                        className="w-full"
                      >
                        Copiar Código
                      </Button>
                      <Button
                        onClick={disableWidget}
                        variant="destructive"
                        className="w-full"
                      >
                        Desabilitar Widget
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Widget Code */}
          <Card>
            <CardHeader>
              <CardTitle>Código de Incorporação</CardTitle>
              <CardDescription>
                Cole este código no HTML do seu site
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerated ? (
                <div className="space-y-4">
                  <Textarea
                    value={widgetCode}
                    readOnly
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">📋 Instruções de Instalação</h4>
                    <ol className="text-sm text-yellow-700 space-y-1">
                      <li>1. Copie o código acima</li>
                      <li>2. Cole antes da tag &lt;/body&gt; do seu site</li>
                      <li>3. Certifique-se de ter um agente ativo no canal "Widget do Site"</li>
                      <li>4. Publique as alterações</li>
                      <li>5. O chat aparecerá na posição configurada</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      📄
                    </div>
                    <p>Configure e gere o widget para ver o código</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Widget Preview */}
        {isGenerated && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Preview do Widget</CardTitle>
              <CardDescription>
                Visualização de como o chat aparecerá no seu site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg p-8 min-h-[400px]">
                <div className="text-center text-gray-500 mb-8">
                  <p>Simulação da sua página web</p>
                </div>
                
                {/* Mock website content */}
                <div className="space-y-4 mb-16">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>

                {/* Widget preview */}
                <div className={`absolute ${
                  widgetConfig.position === 'bottom-right' ? 'bottom-4 right-4' :
                  widgetConfig.position === 'bottom-left' ? 'bottom-4 left-4' :
                  widgetConfig.position === 'top-right' ? 'top-4 right-4' :
                  'top-4 left-4'
                }`}>
                  <div className="bg-white rounded-lg shadow-lg border w-80 h-96">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
                      <h3 className="font-semibold">{widgetConfig.title}</h3>
                    </div>
                    <div className="p-4 space-y-3 h-64 overflow-y-auto">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm">{widgetConfig.welcomeMessage}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg ml-8">
                        <p className="text-sm">Olá! Gostaria de mais informações.</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg mr-8">
                        <p className="text-sm">Claro! Como posso ajudar você?</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-lg p-2">
                          <p className="text-sm text-gray-500">Digite sua mensagem...</p>
                        </div>
                        <Button size="sm">📤</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WidgetConnection;
