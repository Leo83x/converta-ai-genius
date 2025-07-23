
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useWhatsAppConnection = () => {
  const [sessionName, setSessionName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const { toast } = useToast();
  
  // Refs para controle de polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSessionRef = useRef<string>('');

  const createSession = async () => {
    if (!sessionName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a sessão",
        variant: "destructive"
      });
      return { success: false, connected: false };
    }

    // Para qualquer polling anterior
    stopPolling();
    
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setQrCode('');
    currentSessionRef.current = sessionName.trim();
    
    try {
      console.log('Creating session with name:', sessionName.trim());
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Usuário não autenticado');
      }

      // Usar edge function para criar sessão
      const response = await fetch('https://xekxewtggioememydenu.functions.supabase.co/whatsapp-create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          sessionName: sessionName.trim()
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Erro na criação da sessão: ${response.status}`);
      }

      const data = await response.json();
      console.log('Session creation response:', data);

      if (data.success) {
        if (data.data && data.data.status === 'connected') {
          setConnectionStatus('connected');
          toast({
            title: "Conectado!",
            description: "WhatsApp já estava conectado",
          });
          return { success: true, connected: true };
        }

        setConnectionStatus('pending');
        toast({
          title: "Sessão criada!",
          description: "Aguardando QR Code...",
        });

        // Iniciar polling para QR Code e status
        startPollingForQrCodeAndStatus(sessionName.trim(), session.access_token);
        return { success: true, connected: false };
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
      return { success: false, connected: false };
    } finally {
      setIsConnecting(false);
    }
  };

  // Nova função de polling mais robusta
  const startPollingForQrCodeAndStatus = (sessionId: string, token: string) => {
    // Para qualquer polling anterior
    stopPolling();
    
    console.log(`Iniciando polling para sessão: ${sessionId}`);
    
    pollingIntervalRef.current = setInterval(async () => {
      // Verifica se ainda é a sessão atual
      if (currentSessionRef.current !== sessionId) {
        console.log('Sessão mudou, parando polling');
        stopPolling();
        return;
      }

      try {
        // 1. Tentar obter QR Code se ainda não temos
        if (!qrCode) {
          const qrResponse = await fetch('https://xekxewtggioememydenu.functions.supabase.co/venom-qr-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              sessionName: sessionId
            })
          });

          if (qrResponse.ok) {
            const qrData = await qrResponse.json();
            if (qrData.success && qrData.qr_code && qrData.status === 'pending') {
              setQrCode(qrData.qr_code);
              console.log('QR Code obtido via polling');
            } else if (qrData.status === 'server_offline') {
              console.log('Servidor Venom offline, continuando polling...');
            }
          }
        }

        // 2. Verificar status da sessão
        const statusResponse = await fetch('https://xekxewtggioememydenu.functions.supabase.co/whatsapp-check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            sessionName: sessionId
          })
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          
          if (statusData.success) {
            if (statusData.status === 'connected') {
              setConnectionStatus('connected');
              setQrCode('');
              stopPolling();
              toast({
                title: "WhatsApp conectado!",
                description: "Seu agente já pode receber mensagens",
              });
              return;
            } else if (statusData.status === 'pending' && statusData.qr_code && !qrCode) {
              setQrCode(statusData.qr_code);
              console.log('QR Code obtido via status check');
            } else if (statusData.status === 'closed' || statusData.status === 'disconnected') {
              setConnectionStatus('disconnected');
              setQrCode('');
              stopPolling();
              toast({
                title: "Sessão desconectada",
                description: "A sessão foi fechada. Tente criar uma nova.",
                variant: "destructive"
              });
              return;
            }
          }
        }

      } catch (error) {
        console.error('Erro durante polling:', error);
        // Não para o polling em caso de erro, a API pode estar reiniciando
      }
    }, 3000); // Polling a cada 3 segundos

    // Para o polling após 5 minutos (timeout)
    setTimeout(() => {
      if (pollingIntervalRef.current) {
        console.log('Timeout do polling atingido');
        stopPolling();
        if (connectionStatus !== 'connected') {
          toast({
            title: "Timeout",
            description: "Tempo limite para conexão atingido. Tente novamente.",
            variant: "destructive"
          });
          setConnectionStatus('disconnected');
          setQrCode('');
        }
      }
    }, 300000);
  };

  // Função para parar polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log('Polling parado');
    }
  };

  // Função para buscar QR Code diretamente
  const getQrCode = async (sessionNameToCheck: string, token: string) => {
    try {
      console.log('Getting QR code for:', sessionNameToCheck);
      
      // Primeiro tenta a função edge do Supabase
      const response = await fetch('https://xekxewtggioememydenu.functions.supabase.co/venom-qr-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionName: sessionNameToCheck
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('QR code response from Supabase function:', data);
        
        if (data.success && data.qr_code && data.status === 'pending') {
          setQrCode(data.qr_code);
          setConnectionStatus('pending');
          return data.qr_code;
        } else if (data.status === 'server_offline') {
          console.log('Servidor Venom não disponível via Supabase function');
        }
      }

      // Fallback: tenta diretamente a nova rota JSON da API
      try {
        console.log('Trying direct API fallback...');
        const directResponse = await fetch(`https://app.convertamais.online/sessions/${sessionNameToCheck}/qr-json`);
        
        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log('QR code response from direct API:', directData);
          
          if (directData.qrcode) {
            setQrCode(directData.qrcode);
            setConnectionStatus('pending');
            return directData.qrcode;
          }
        }
      } catch (fallbackError) {
        console.error('Fallback API error:', fallbackError);
        toast({
          title: "Erro de conectividade",
          description: "Não foi possível acessar o servidor. Verifique sua conexão.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error getting QR code:', error);
    }
    return null;
  };

  const resetConnection = () => {
    stopPolling();
    setSessionName('');
    setQrCode('');
    setConnectionStatus('disconnected');
    setIsConnecting(false);
    currentSessionRef.current = '';
  };

  const refreshQrCode = async () => {
    if (!sessionName.trim()) return;
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Refreshing QR code for:', sessionName.trim());
      setQrCode(''); // Limpa QR atual
      await getQrCode(sessionName.trim(), session.access_token);
    } catch (error) {
      console.error('Error refreshing QR code:', error);
      toast({
        title: "Erro ao atualizar QR Code",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    sessionName,
    setSessionName,
    qrCode,
    isConnecting,
    connectionStatus,
    createSession,
    resetConnection,
    refreshQrCode
  };
};
