
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const WhatsAppConnection = () => {
  const [sessionName, setSessionName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createSession = async () => {
    if (!sessionName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a sessão",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    console.log('Criando sessão:', sessionName);

    // TODO: Implementar integração real com Evolution API
    // Simulando criação de sessão
    setTimeout(() => {
      // QR Code simulado (base64)
      const mockQrCode = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      setQrCode(mockQrCode);
      setIsConnecting(false);
      
      toast({
        title: "Sessão criada!",
        description: "Escaneie o QR Code com seu WhatsApp",
      });

      // Simular conexão após 10 segundos
      setTimeout(() => {
        setConnectionStatus('connected');
        toast({
          title: "WhatsApp conectado!",
          description: "Seu agente já pode receber mensagens",
        });
      }, 10000);
    }, 2000);
  };

  const disconnectSession = async () => {
    setConnectionStatus('disconnected');
    setQrCode('');
    toast({
      title: "WhatsApp desconectado",
      description: "Sessão encerrada com sucesso",
    });
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800">Conectando</Badge>;
      default:
        return <Badge variant="secondary">Desconectado</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Conexão WhatsApp</h2>
          <p className="text-gray-600">Configure sua conta do WhatsApp para receber e enviar mensagens automaticamente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Configuração da Sessão
                {getStatusBadge()}
              </CardTitle>
              <CardDescription>
                Crie uma nova sessão para conectar seu WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionName">Nome da Sessão</Label>
                <Input
                  id="sessionName"
                  placeholder="Ex: minha-loja-zap"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  disabled={connectionStatus === 'connected'}
                />
                <p className="text-sm text-gray-500">
                  Use um nome único para identificar esta conexão
                </p>
              </div>

              {connectionStatus === 'disconnected' && (
                <Button
                  onClick={createSession}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isConnecting ? "Criando Sessão..." : "Criar Sessão"}
                </Button>
              )}

              {connectionStatus === 'connected' && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ WhatsApp Conectado</h4>
                    <p className="text-sm text-green-700">
                      Sua conta está ativa e pronta para receber mensagens
                    </p>
                  </div>
                  <Button
                    onClick={disconnectSession}
                    variant="destructive"
                    className="w-full"
                  >
                    Desconectar WhatsApp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code de Conexão</CardTitle>
              <CardDescription>
                Escaneie com seu WhatsApp para conectar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrCode ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg shadow-inner">
                      <img
                        src={qrCode}
                        alt="QR Code WhatsApp"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-gray-900">Como conectar:</p>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. Abra o WhatsApp no seu celular</li>
                      <li>2. Toque em "Mais opções" (⋮) e selecione "Dispositivos conectados"</li>
                      <li>3. Toque em "Conectar um dispositivo"</li>
                      <li>4. Aponte a câmera para este QR code</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      📱
                    </div>
                    <p>Crie uma sessão para gerar o QR Code</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Connected Agents */}
        {connectionStatus === 'connected' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Agentes Conectados</CardTitle>
              <CardDescription>
                Agentes que estão usando esta conexão do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock agents */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      V
                    </div>
                    <div>
                      <h4 className="font-semibold">Agente Vendas</h4>
                      <p className="text-sm text-gray-600">Número: +55 11 99999-9999</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WhatsAppConnection;
