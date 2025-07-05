import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, Wifi, WifiOff, RefreshCw, QrCode, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const VenomWhatsAppConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
    // Verificar status a cada 10 segundos
    const interval = setInterval(checkConnectionStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkConnectionStatus = async () => {
    try {
      // Verificar se o servidor está respondendo
      const response = await fetch('http://31.97.167.218:3002/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.connected) {
          setConnectionStatus('connected');
          setQrCodeUrl('');
        } else {
          setConnectionStatus('connecting');
          // Atualizar QR Code
          setQrCodeUrl(`http://31.97.167.218:3002/qr?t=${Date.now()}`);
        }
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setConnectionStatus('disconnected');
    }
    setLastUpdate(new Date());
  };

  const refreshQrCode = async () => {
    setIsLoading(true);
    try {
      // Forçar atualização do QR Code
      setQrCodeUrl(`http://31.97.167.218:3002/qr?t=${Date.now()}`);
      
      // Verificar status após refresh
      setTimeout(() => {
        checkConnectionStatus();
      }, 2000);
      
      toast({
        title: "QR Code atualizado",
        description: "O QR Code foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error refreshing QR code:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Erro ao atualizar o QR Code.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    try {
      // Configurar webhook para este sistema
      const webhookUrl = `${window.location.origin}/functions/v1/venom-webhook`;
      
      const configResponse = await fetch('http://31.97.167.218:3002/config-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: webhookUrl
        }),
      });

      if (configResponse.ok) {
        toast({
          title: "Webhook configured",
          description: "Sistema configurado para receber mensagens.",
        });
      }

      // Gerar novo QR Code
      setQrCodeUrl(`http://31.97.167.218:3002/qr?t=${Date.now()}`);
      
      toast({
        title: "Conexão iniciada",
        description: "Escaneie o QR Code com seu WhatsApp para conectar.",
      });
    } catch (error) {
      console.error('Error initializing connection:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Erro na conexão",
        description: "Erro ao inicializar a conexão com WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500 hover:bg-green-600"><Wifi className="w-3 h-3 mr-1" />Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Aguardando</Badge>;
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

                {connectionStatus === 'connecting' && (
                  <Button
                    variant="outline"
                    onClick={refreshQrCode}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar QR Code
                      </>
                    )}
                  </Button>
                )}

                {connectionStatus === 'connected' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      WhatsApp conectado e pronto para receber mensagens!
                    </AlertDescription>
                  </Alert>
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
              {connectionStatus === 'connecting' && qrCodeUrl ? (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code WhatsApp"
                      className="w-48 h-48 md:w-64 md:h-64 mx-auto"
                      onError={() => {
                        console.error('Error loading QR Code image');
                        // Tentar recarregar após 3 segundos
                        setTimeout(() => {
                          setQrCodeUrl(`http://31.97.167.218:3002/qr?t=${Date.now()}`);
                        }, 3000);
                      }}
                      onLoad={() => {
                        console.log('QR Code image loaded successfully');
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
                      5. Aponte a câmera para este código
                    </p>
                  </div>
                </div>
              ) : connectionStatus === 'connected' ? (
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
              ) : (
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

        {/* Informações sobre Agentes */}
        <Card className="mt-4 md:mt-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Agentes Conectados</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <strong>Webhook URL:</strong> {window.location.origin}/functions/v1/venom-webhook<br />
                Os agentes de IA ativos no canal WhatsApp responderão automaticamente às mensagens recebidas.
                Configure seus agentes na seção "Agentes" do sistema.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VenomWhatsAppConnection;