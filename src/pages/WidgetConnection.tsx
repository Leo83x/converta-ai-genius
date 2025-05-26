
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const WidgetConnection = () => {
  const [widgetCode, setWidgetCode] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateWidget = () => {
    const code = `<!-- Converta+ Chat Widget -->
<script>
  window.ConvertaPlus = {
    widgetId: 'widget_${Date.now()}',
    position: 'bottom-right',
    theme: 'blue',
    welcomeMessage: 'Olá! Como posso ajudar você hoje?'
  };
</script>
<script src="https://widget.convertaplus.com.br/embed.js" async></script>`;

    setWidgetCode(code);
    setIsGenerated(true);
    toast({
      title: "Widget gerado!",
      description: "Copie o código e cole no seu site",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetCode);
    toast({
      title: "Código copiado!",
      description: "Cole no <head> ou antes do </body> do seu site",
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
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Widget do Site</h2>
          <p className="text-gray-600">Adicione um chat inteligente ao seu website</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Widget Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">💬</span>
                <span>Configuração do Widget</span>
              </CardTitle>
              <CardDescription>
                Gere o código de incorporação para seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🎨 Recursos do Widget</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Chat responsivo e customizável</li>
                    <li>• Integração com seus agentes de IA</li>
                    <li>• Coleta automática de leads</li>
                    <li>• Histórico de conversas</li>
                    <li>• Notificações em tempo real</li>
                  </ul>
                </div>

                {!isGenerated ? (
                  <Button
                    onClick={generateWidget}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Gerar Código do Widget
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Badge className="bg-green-100 text-green-800">Widget Ativo</Badge>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="w-full"
                    >
                      Copiar Código
                    </Button>
                  </div>
                )}
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
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">📋 Instruções de Instalação</h4>
                    <ol className="text-sm text-yellow-700 space-y-1">
                      <li>1. Copie o código acima</li>
                      <li>2. Cole antes da tag &lt;/body&gt; do seu site</li>
                      <li>3. Publique as alterações</li>
                      <li>4. O chat aparecerá no canto inferior direito</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      📄
                    </div>
                    <p>Gere o widget para ver o código</p>
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
                Assim será a aparência do chat no seu site
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
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white rounded-lg shadow-lg border w-80 h-96">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
                      <h3 className="font-semibold">Chat Converta+</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg ml-8">
                        <p className="text-sm">Gostaria de saber mais sobre seus produtos</p>
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
