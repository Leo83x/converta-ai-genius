
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, Wifi, WifiOff, RefreshCw, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';

const WhatsAppConnection = () => {
  const [sessionName, setSessionName] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'qr_code'>('disconnected');
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isRefreshingQR, setIsRefreshingQR] = useState(false);
  const [currentSession, setCurrentSession] = useState<string>('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<string>('');
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingSessions();
  }, []);

  const loadExistingSessions = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.log('User not authenticated');
        return;
      }

      const { data: tokens, error } = await supabase
        .from('evolution_tokens')
        .select('session_name, status')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading sessions:', error);
        return;
      }

      if (tokens && tokens.length > 0) {
        const latestSession = tokens[0];
        setCurrentSession(latestSession.session_name);
        setSessionName(latestSession.session_name);
        
        // Só verificar status se não estiver explicitamente desconectado
        if (latestSession.status === 'connected') {
          setConnectionStatus('connected');
          setSessionStatus('connected');
        } else if (latestSession.status !== 'disconnected') {
          // Não conectar automaticamente - apenas mostrar que existe uma sessão
          setConnectionStatus('disconnected');
          setSessionStatus(latestSession.status || 'disconnected');
        }
      }
    } catch (error) {
      console.error('Error in loadExistingSessions:', error);
    }
  };

  const checkSessionStatus = async (sessionNameToCheck: string) => {
    if (!sessionNameToCheck) return;
    
    setCheckingStatus(true);
    console.log('Checking status for session:', sessionNameToCheck);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('https://xekxewtggioememydenu.functions.supabase.co/whatsapp-check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionName: sessionNameToCheck
        })
      });

      if (!response.ok) {
        console.error('Status check failed:', response.status);
        setConnectionStatus('disconnected');
        return;
      }

      const data = await response.json();
      console.log('Status check response:', data);

      if (data && data.success) {
        if (data.status === 'connected') {
          setConnectionStatus('connected');
          setQrCode('');
          setSessionStatus('connected');
          toast({
            title: "Conectado",
            description: "WhatsApp conectado com sucesso!",
          });
        } else if (data.qr_code && typeof data.qr_code === 'string' && data.qr_code.trim().length > 20) {
          const qrCodeData = data.qr_code.trim();
          if (qrCodeData.startsWith('data:image') || qrCodeData.length > 100) {
            setConnectionStatus('qr_code');
            setQrCode(qrCodeData);
            setSessionStatus(data.connection_status || 'pending');
            console.log('QR Code válido encontrado');
          } else {
            console.log('QR Code inválido, tentando novamente...');
            setTimeout(() => checkSessionStatus(sessionNameToCheck), 3000);
          }
        } else {
          console.log('Sem QR code válido, tentando novamente...');
          setTimeout(() => checkSessionStatus(sessionNameToCheck), 3000);
        }
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error checking session status:', error);
      setConnectionStatus('disconnected');
    } finally {
      setCheckingStatus(false);
    }
  };

  const createSession = async () => {
    if (!sessionName.trim()) {
      toast({
        title: "Nome da sessão obrigatório",
        description: "Por favor, insira um nome para a sessão.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setIsGeneratingQR(true);
    setConnectionStatus('connecting');
    setQrCode('');
    
    try {
      console.log('Creating session with name:', sessionName);
      
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('https://xekxewtggioememydenu.functions.supabase.co/whatsapp-create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionName: sessionName.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Session creation response:', data);

      if (data.success) {
        setCurrentSession(sessionName.trim());
        
        if (data.data && data.data.status) {
          setSessionStatus(data.data.status);
        }
        
        if (data.data && data.data.qr_code && typeof data.data.qr_code === 'string') {
          const qrCodeData = data.data.qr_code.trim();
          if (qrCodeData.length > 20 && (qrCodeData.startsWith('data:image') || qrCodeData.length > 100)) {
            setQrCode(qrCodeData);
            setConnectionStatus('qr_code');
            toast({
              title: "QR Code gerado",
              description: "Escaneie o QR Code com seu WhatsApp para conectar.",
            });
          } else {
            setTimeout(() => checkSessionStatus(sessionName.trim()), 2000);
          }
        } else if (data.data && data.data.status === 'open') {
          setConnectionStatus('connected');
          toast({
            title: "Conectado com sucesso",
            description: "Sua sessão WhatsApp está ativa.",
          });
        } else {
          setTimeout(() => checkSessionStatus(sessionName.trim()), 3000);
        }
      } else {
        throw new Error(data.error || 'Falha ao criar sessão');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      setConnectionStatus('disconnected');
      setQrCode('');
      toast({
        title: "Erro ao criar sessão",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsGeneratingQR(false);
    }
  };

  const refreshQrCode = async () => {
    if (!currentSession) return;
    
    setIsRefreshingQR(true);
    try {
      console.log('Refreshing QR code for session:', currentSession);
      
      await checkSessionStatus(currentSession);
      
      toast({
        title: "Status atualizado",
        description: "Verificação de status realizada com sucesso.",
      });
    } catch (error) {
      console.error('Error refreshing QR code:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsRefreshingQR(false);
    }
  };

  const disconnectSession = async () => {
    if (!currentSession) return;

    setIsDisconnecting(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('https://xekxewtggioememydenu.functions.supabase.co/whatsapp-disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionName: currentSession
        })
      });

      const data = await response.json();
      console.log('Disconnect response:', data);

      // Sempre resetar o estado local, independente da resposta da API
      setConnectionStatus('disconnected');
      setQrCode('');
      setCurrentSession('');
      setSessionName('');
      setSessionStatus('');
      
      toast({
        title: "Desconectado",
        description: "Sessão WhatsApp desconectada com sucesso.",
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      
      // Mesmo com erro, resetar o estado local
      setConnectionStatus('disconnected');
      setQrCode('');
      setCurrentSession('');
      setSessionName('');
      setSessionStatus('');
      
      toast({
        title: "Sessão resetada",
        description: "Estado da sessão foi resetado localmente.",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500 hover:bg-green-600"><Wifi className="w-3 h-3 mr-1" />Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Conectando</Badge>;
      case 'qr_code':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><QrCode className="w-3 h-3 mr-1" />QR Code</Badge>;
      default:
        return <Badge variant="secondary"><WifiOff className="w-3 h-3 mr-1" />Desconectado</Badge>;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Conexão WhatsApp</h1>
          <p className="text-sm md:text-base text-gray-600">Configure e gerencie sua conexão com o WhatsApp Business API.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Card de Configuração */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Configuração
                </div>
                {getStatusBadge()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Sessão
                </label>
                <Input
                  type="text"
                  placeholder="Ex: minha-empresa-whatsapp"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  disabled={connectionStatus === 'connected' || isLoading}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                {connectionStatus === 'disconnected' && (
                  <Button
                    onClick={createSession}
                    disabled={isLoading || !sessionName.trim()}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando Sessão...
                      </>
                    ) : (
                      'Criar Sessão'
                    )}
                  </Button>
                )}

                {(connectionStatus === 'connected' || connectionStatus === 'qr_code' || connectionStatus === 'connecting') && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={refreshQrCode}
                      disabled={isRefreshingQR || checkingStatus}
                      className="flex-1"
                    >
                      {(isRefreshingQR || checkingStatus) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Atualizar Status
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={disconnectSession}
                      disabled={isDisconnecting}
                      className="flex-1"
                    >
                      {isDisconnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Desconectando...
                        </>
                      ) : (
                        'Desconectar'
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {currentSession && (
                <Alert>
                  <AlertDescription className="text-sm">
                    Sessão atual: <strong>{currentSession}</strong>
                    {sessionStatus && (
                      <span className="ml-2 text-xs text-gray-500">
                        Status: {sessionStatus}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Card do QR Code */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              {isGeneratingQR ? (
                <div className="text-center py-8 md:py-12">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 animate-spin text-blue-600" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    Gerando QR Code...
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Aguarde enquanto criamos seu QR Code de conexão.
                  </p>
                </div>
              ) : connectionStatus === 'qr_code' && qrCode && qrCode.length > 20 ? (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                    <img
                      src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                      alt="QR Code WhatsApp"
                      className="w-48 h-48 md:w-64 md:h-64 mx-auto"
                      onError={() => {
                        console.error('Error loading QR Code image');
                        setTimeout(() => {
                          if (currentSession) {
                            checkSessionStatus(currentSession);
                          }
                        }, 2000);
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
                    Sua sessão está ativa e pronta para uso.
                  </p>
                </div>
              ) : connectionStatus === 'connecting' || checkingStatus ? (
                <div className="text-center py-8 md:py-12">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 animate-spin text-blue-600" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    Buscando QR Code...
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Aguarde enquanto verificamos o status da conexão e geramos o QR Code.
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
                    Crie uma sessão para gerar o QR Code.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default WhatsAppConnection;
