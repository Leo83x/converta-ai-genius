import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, Wifi, WifiOff, RefreshCw, QrCode, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const VenomWhatsAppConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'loading' | 'qr_ready' | 'connected'>('disconnected');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [serverConnected, setServerConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const { toast } = useToast();

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://31.97.167.218:3002/status');
      const data = await response.json();
      
      setServerConnected(data.connected || false);
      setLastUpdate(new Date());
      setConnectionError('');
      
      if (data.connected) {
        setConnectionStatus('connected');
        setQrCodeUrl('');
        toast({
          title: "WhatsApp Conectado!",
          description: "Sua conexão está ativa e pronta para receber mensagens.",
        });
      } else {
        if (connectionStatus !== 'qr_ready') {
          setConnectionStatus('qr_ready');
        }
      }
      
      return data.connected;
    } catch (error) {
      console.error('Error checking server status:', error);
      setConnectionError('Erro ao conectar com o servidor. Verifique se o servidor Venom Bot está online.');
      setServerConnected(false);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor Venom Bot.",
        variant: "destructive"
      });
      return false;
    }
  };

  const loadQRCode = async () => {
    const qrUrl = `http://31.97.167.218:3002/qr`;
    setQrCodeUrl(qrUrl);
    setConnectionStatus('qr_ready');
    setLastUpdate(new Date());
    setConnectionError('');
    
    toast({
      title: "QR Code carregado",
      description: "Escaneie o código com seu WhatsApp para conectar.",
    });
  };

  const checkIfConnected = async () => {
    setConnectionStatus('connected');
    setServerConnected(true);
    setQrCodeUrl('');
    
    toast({
      title: "WhatsApp Conectado!",
      description: "Sua conexão está ativa e pronta para receber mensagens.",
    });
  };

  const initializeConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('loading');
    setConnectionError('');
    
    try {
      await loadQRCode();
      
      toast({
        title: "Conexão iniciada",
        description: "QR Code carregado. Escaneie com seu WhatsApp para conectar.",
      });
      
    } catch (error) {
      console.error('Error initializing connection:', error);
      setConnectionStatus('disconnected');
      setConnectionError('Não foi possível carregar o QR Code. Verifique se o servidor está ativo.');
      toast({
        title: "Erro na conexão",
        description: "Não foi possível carregar o QR Code. Verifique se o servidor está ativo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQrCode = async () => {
    setIsLoading(true);
    setConnectionError('');
    
    try {
      const isConnected = await checkServerStatus();
      
      if (!isConnected) {
        await loadQRCode();
        toast({
          title: "Status verificado",
          description: "QR Code atualizado. Status: Aguardando conexão.",
        });
      }
    } catch (error) {
      console.error('Error refreshing status:', error);
      setConnectionError('Erro ao verificar status do servidor.');
      toast({
        title: "Erro ao atualizar",
        description: "Erro ao verificar status do servidor.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setConnectionStatus('disconnected');
    setQrCodeUrl('');
    setServerConnected(false);
    setConnectionError('');
    toast({
      title: "Desconectado",
      description: "Conexão WhatsApp foi encerrada.",
    });
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500 hover:bg-green-600"><Wifi className="w-3 h-3 mr-1" />Conectado</Badge>;
      case 'qr_ready':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><QrCode className="w-3 h-3 mr-1" />QR Code Ativo</Badge>;
      case 'loading':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Carregando</Badge>;
      default:
        return <Badge variant="secondary"><WifiOff className="w-3 h-3 mr-1" />Desconectado</Badge>;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Conexão WhatsApp (Venom Bot)</h1>
          <p className="text-sm md:text-base text-gray-600">
            Configure sua conexão WhatsApp com o servidor Venom Bot para interação com agentes de IA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Card de Status */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Status da Conexão
                </div>
                {getStatusBadge()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {connectionStatus === 'disconnected' && (
                  <Button
                    onClick={initializeConnection}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Iniciando...
                      </>
                    ) : (
                      'Iniciar Conexão'
                    )}
                  </Button>
                )}

                {(connectionStatus === 'qr_ready' || connectionStatus === 'loading') && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={refreshQrCode}
                      disabled={isLoading || serverConnected}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Atualizar QR Code
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={checkIfConnected}
                      className={`flex-1 ${serverConnected ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      variant={serverConnected ? "default" : "default"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {serverConnected ? 'Confirmar Conexão' : 'Já Conectei'}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={disconnect}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                {connectionStatus === 'connected' && (
                  <Button
                    variant="destructive"
                    onClick={disconnect}
                    className="w-full"
                  >
                    Desconectar
                  </Button>
                )}
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Servidor:</strong> http://31.97.167.218:3002<br />
                  <strong>Última verificação:</strong> {lastUpdate.toLocaleTimeString()}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Card do QR Code */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              {connectionStatus === 'loading' && (
                <div className="text-center py-8 md:py-12">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 animate-spin text-blue-600" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    Carregando QR Code...
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Aguarde enquanto carregamos seu QR Code de conexão.
                  </p>
                </div>
              )}

               {connectionStatus === 'qr_ready' && qrCodeUrl && (
                <div className="text-center space-y-4">
                  {connectionError ? (
                    <div className="py-8 md:py-12">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <QrCode className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        Erro ao carregar QR Code
                      </h3>
                      <p className="text-sm md:text-base text-red-600 mb-4">
                        Verifique se o servidor Venom Bot está online.
                      </p>
                      <Alert className="text-left">
                        <AlertDescription className="text-xs">
                          <strong>Problemas de conexão:</strong><br />
                          • Servidor: http://31.97.167.218:3002<br />
                          • Verifique se o servidor está online e acessível<br />
                          • Use o botão "Atualizar QR Code" para tentar novamente
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code WhatsApp"
                          className="w-48 h-48 md:w-64 md:h-64 mx-auto"
                          onError={(e) => {
                            console.error('QR Code image failed to load');
                            console.error('Image src:', qrCodeUrl);
                            console.error('Error event:', e);
                            
                            setConnectionError('Erro ao carregar QR Code. Verifique se o servidor Venom Bot está online.');
                            toast({
                              title: "Erro ao carregar QR Code",
                              description: "Verifique se o servidor Venom Bot está online.",
                              variant: "destructive"
                            });
                          }}
                          onLoad={() => {
                            console.log('QR Code image loaded successfully');
                            setConnectionError('');
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          Escaneie com seu WhatsApp
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          1. Abra o WhatsApp no seu celular<br />
                          2. Toque em "Mais opções" ou "Configurações"<br />
                          3. Toque em "Aparelhos conectados"<br />
                          4. Toque em "Conectar um aparelho"<br />
                          5. Aponte a câmera para este código<br />
                          6. Clique em "Já Conectei" após escanear
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {connectionStatus === 'connected' && (
                <div className="text-center py-8 md:py-12">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Wifi className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    WhatsApp Conectado!
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Seu WhatsApp está ativo e pronto para interagir com os agentes de IA.
                  </p>
                </div>
              )}
              
              {connectionStatus === 'disconnected' && (
                <div className="text-center py-8 md:py-12">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    QR Code não disponível
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Inicie a conexão para gerar o QR Code.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informações sobre Agentes e Configuração */}
        <Card className="mt-4 md:mt-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Configuração Manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Webhook URL:</strong> {window.location.origin}/functions/v1/venom-webhook<br />
                <strong>Configuração no servidor Venom Bot:</strong><br />
                Configure este webhook URL no seu servidor Venom Bot para que as mensagens sejam processadas pelos agentes de IA.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Instruções de uso:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Clique em "Iniciar Conexão" para carregar o QR Code</li>
                <li>Escaneie o QR Code com seu WhatsApp</li>
                <li>Clique em "Já Conectei" após escanear com sucesso</li>
                <li>Configure seus agentes na seção "Agentes" do sistema</li>
                <li>Certifique-se de que pelo menos um agente esteja ativo para WhatsApp</li>
                <li>Configure sua OpenAI API Key no perfil do usuário</li>
              </ol>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Agentes Ativos:</strong> Os agentes de IA configurados no canal WhatsApp responderão automaticamente às mensagens recebidas.
                Todas as conversas são salvas e podem ser visualizadas na seção "Conversas".
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VenomWhatsAppConnection;