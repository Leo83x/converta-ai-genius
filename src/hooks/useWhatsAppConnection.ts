
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useWhatsAppConnection = () => {
  const [sessionName, setSessionName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const { toast } = useToast();

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
    setConnectionStatus('connecting');
    setQrCode('');
    
    try {
      console.log('Creating session with name:', sessionName.trim());
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Usuário não autenticado');
      }

      // Fazer chamada direta ao servidor Venom local
      const venomResponse = await fetch('http://localhost:3002/api/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionName: sessionName.trim(),
          qrcode: true
        })
      });

      console.log('Venom response status:', venomResponse.status);

      if (!venomResponse.ok) {
        throw new Error(`Servidor Venom não disponível: ${venomResponse.status}`);
      }

      const venomData = await venomResponse.json();
      console.log('Venom response:', venomData);

      // Salvar no banco usando edge function
      const response = await fetch('https://xekxewtggioememydenu.functions.supabase.co/whatsapp-create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          sessionName: sessionName.trim(),
          venomData: venomData
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

        if (data.data && data.data.qr_code) {
          const qrCodeData = data.data.qr_code;
          console.log('QR Code received:', qrCodeData ? 'Yes' : 'No');
          
          if (qrCodeData && qrCodeData.length > 50) {
            setQrCode(qrCodeData);
            setConnectionStatus('pending');
            toast({
              title: "QR Code gerado!",
              description: "Escaneie o código com seu WhatsApp",
            });

            startStatusChecking(sessionName.trim(), session.access_token);
            return { success: true, connected: false };
          } else {
            setTimeout(() => {
              checkSessionStatus(sessionName.trim(), session.access_token);
            }, 2000);
          }
        } else {
          setTimeout(() => {
            checkSessionStatus(sessionName.trim(), session.access_token);
          }, 2000);
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
      return { success: false, connected: false };
    } finally {
      setIsConnecting(false);
    }
  };

  const checkSessionStatus = async (sessionNameToCheck: string, token: string) => {
    try {
      console.log('Checking status for:', sessionNameToCheck);
      
      // Verificar status diretamente no servidor Venom
      const venomStatusResponse = await fetch(`http://localhost:3002/api/session/${sessionNameToCheck}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (venomStatusResponse.ok) {
        const venomStatusData = await venomStatusResponse.json();
        console.log('Venom status response:', venomStatusData);

        if (venomStatusData.connectionStatus === 'open' || venomStatusData.status === 'connected') {
          setConnectionStatus('connected');
          setQrCode('');
          toast({
            title: "Conectado!",
            description: "WhatsApp conectado com sucesso!",
          });
          return { success: true, connected: true };
        } else if (venomStatusData.connectionStatus === 'connecting' || venomStatusData.status === 'pending') {
          // Tentar buscar QR code
          try {
            const qrResponse = await fetch(`http://localhost:3002/api/session/${sessionNameToCheck}/qr`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (qrResponse.ok) {
              const qrData = await qrResponse.json();
              const qrCode = qrData.qrcode || qrData.qr || qrData.base64;
              
              if (qrCode && qrCode.length > 50) {
                setConnectionStatus('pending');
                setQrCode(qrCode);
                console.log('QR Code atualizado do status check');
              }
            }
          } catch (qrError) {
            console.warn('Erro ao buscar QR code:', qrError);
          }
        }
      } else {
        console.error('Status check failed:', venomStatusResponse.status);
      }
    } catch (error) {
      console.error('Error checking session status:', error);
    }
    return { success: false, connected: false };
  };

  const startStatusChecking = (sessionNameToCheck: string, token: string) => {
    const interval = setInterval(async () => {
      try {
        // Verificar status diretamente no servidor Venom
        const venomStatusResponse = await fetch(`http://localhost:3002/api/session/${sessionNameToCheck}/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (venomStatusResponse.ok) {
          const venomStatusData = await venomStatusResponse.json();
          
          if (venomStatusData.connectionStatus === 'open' || venomStatusData.status === 'connected') {
            setConnectionStatus('connected');
            clearInterval(interval);
            toast({
              title: "WhatsApp conectado!",
              description: "Seu agente já pode receber mensagens",
            });
            return true;
          }
        }
      } catch (error) {
        console.error('Error in status check interval:', error);
      }
    }, 5000);

    setTimeout(() => clearInterval(interval), 300000);
  };

  const resetConnection = () => {
    setSessionName('');
    setQrCode('');
    setConnectionStatus('disconnected');
    setIsConnecting(false);
  };

  return {
    sessionName,
    setSessionName,
    qrCode,
    isConnecting,
    connectionStatus,
    createSession,
    resetConnection
  };
};
