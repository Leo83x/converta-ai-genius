
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const WhatsAppConnection = () => {
  const [sessionName, setSessionName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Carregar sessões existentes ao montar o componente
  useEffect(() => {
    loadExistingSessions();
  }, []);

  // Verificar status periodicamente quando há uma sessão ativa
  useEffect(() => {
    if (currentSession && (connectionStatus === 'pending' || connectionStatus === 'connecting')) {
      const interval = setInterval(() => {
        checkSessionStatus(currentSession);
      }, 5000); // Verificar a cada 5 segundos

      // Limpar interval após 10 minutos
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 600000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [currentSession, connectionStatus]);

  const loadExistingSessions = async () => {
    try {
      const { data: sessions, error } = await supabase
        .from('evolution_tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        setCurrentSession(session.session_name);
        setSessionName(session.session_name);
        setConnectionStatus(session.status || 'disconnected');
        if (session.qr_code_url) {
          setQrCode(session.qr_code_url);
        }
        
        // Se estiver pendente, verificar status imediatamente
        if (session.status === 'pending' || session.status === 'connecting') {
          setTimeout(() => {
            checkSessionStatus(session.session_name);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const checkSessionStatus = async (sessionNameToCheck: string) => {
    if (checkingStatus) return; // Evitar múltiplas verificações simultâneas
    
    setCheckingStatus(true);
    try {
      console.log('Checking status for session:', sessionNameToCheck);
      const { data, error } = await supabase.functions.invoke('whatsapp-check-status', {
        body: { sessionName: sessionNameToCheck }
      });

      if (error) {
        console.error('Error checking status:', error);
        return;
      }

      console.log('Status check response:', data);

      if (data.success) {
        setConnectionStatus(data.status);
        
        if (data.qr_code && data.qr_code !== qrCode) {
          console.log('New QR code received');
          setQrCode(data.qr_code);
        }
        
        if (data.status === 'connected') {
          setQrCode(''); // Limpar QR code quando conectado
          toast({
            title: "WhatsApp Conectado!",
            description: "Sua conta está ativa e pronta para uso",
          });
        } else if (data.status === 'pending' && !data.qr_code) {
          // Se ainda estiver pendente mas sem QR code, tentar novamente em alguns segundos
          setTimeout(() => {
            checkSessionStatus(sessionNameToCheck);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

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
    setQrCode('');
    setConnectionStatus('connecting');
    
    try {
      console.log('Creating session:', sessionName.trim());
      const { data, error } = await supabase.functions.invoke('whatsapp-create-session', {
        body: { sessionName: sessionName.trim() }
      });

      if (error) throw error;

      console.log('Session creation response:', data);

      if (data.success) {
        setCurrentSession(sessionName.trim());
        setConnectionStatus('pending');
        
        toast({
          title: "Sessão criada!",
          description: "Aguarde enquanto geramos o QR Code...",
        });

        // Começar a verificar status após alguns segundos
        setTimeout(() => {
          checkSessionStatus(sessionName.trim());
        }, 3000);
        
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a sessão. Tente novamente.",
        variant: "destructive"
      });
      setConnectionStatus('disconnected');
      setCurrentSession(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectSession = async () => {
    if (!currentSession) return;

    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-disconnect', {
        body: { sessionName: currentSession }
      });

      if (error) throw error;

      setConnectionStatus('disconnected');
      setQrCode('');
      setCurrentSession(null);
      setSessionName('');
      
      toast({
        title: "WhatsApp desconectado",
        description: "Sessão encerrada com sucesso",
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const refreshQrCode = () => {
    if (currentSession && !checkingStatus) {
      checkSessionStatus(currentSession);
      toast({
        title: "Atualizando QR Code",
        description: "Buscando novo QR Code...",
      });
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800">Conectando</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Aguardando</Badge>;
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
                  disabled={connectionStatus === 'connected' || isConnecting}
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

              {(connectionStatus === 'pending' || connectionStatus === 'connecting') && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">⏳ Aguardando Conexão</h4>
                    <p className="text-sm text-blue-700">
                      {qrCode ? 'Escaneie o QR Code para conectar' : 'Gerando QR Code...'}
                    </p>
                    {checkingStatus && (
                      <div className="flex items-center mt-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        <span className="text-xs text-blue-600">Verificando status...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={refreshQrCode}
                      variant="outline"
                      className="flex-1"
                      disabled={checkingStatus}
                    >
                      {checkingStatus ? "Verificando..." : "Atualizar QR Code"}
                    </Button>
                    <Button
                      onClick={disconnectSession}
                      variant="destructive"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
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
                    <div className="p-4 bg-white rounded-lg shadow-inner border">
                      <img
                        src={qrCode}
                        alt="QR Code WhatsApp"
                        className="w-64 h-64 object-contain"
                        onError={(e) => {
                          console.error('Error loading QR code image');
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-gray-900">Como conectar:</p>
                    <ol className="text-sm text-gray-600 space-y-1 text-left">
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
                    <p className="mb-2">
                      {connectionStatus === 'pending' || connectionStatus === 'connecting' 
                        ? 'Gerando QR Code...' 
                        : 'Crie uma sessão para gerar o QR Code'
                      }
                    </p>
                    {(connectionStatus === 'pending' || connectionStatus === 'connecting') && (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    )}
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      V
                    </div>
                    <div>
                      <h4 className="font-semibold">Agente Vendas</h4>
                      <p className="text-sm text-gray-600">Sessão: {currentSession}</p>
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
