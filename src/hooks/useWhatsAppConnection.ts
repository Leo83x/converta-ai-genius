
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
              // QR code muito pequeno, vamos tentar buscar diretamente
              console.log('QR code too small, trying to fetch directly');
              setTimeout(async () => {
                const qrCodeResult = await getQrCode(sessionName.trim(), session.access_token);
                if (!qrCodeResult) {
                  checkSessionStatus(sessionName.trim(), session.access_token);
                }
              }, 2000);
            }
        } else {
          // Não recebemos QR code, vamos tentar buscar diretamente
          console.log('No QR code in response, trying to fetch directly');
          setTimeout(async () => {
            const qrCodeResult = await getQrCode(sessionName.trim(), session.access_token);
            if (!qrCodeResult) {
              checkSessionStatus(sessionName.trim(), session.access_token);
            }
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
      
      // Usar edge function para verificar status
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

      if (response.ok) {
        const data = await response.json();
        console.log('Status response:', data);

        if (data.success) {
          if (data.status === 'connected') {
            setConnectionStatus('connected');
            setQrCode('');
            toast({
              title: "Conectado!",
              description: "WhatsApp conectado com sucesso!",
            });
            return { success: true, connected: true };
          } else if (data.status === 'pending' && data.qr_code) {
            setConnectionStatus('pending');
            setQrCode(data.qr_code);
            console.log('QR Code atualizado do status check');
          }
        }
      }
    } catch (error) {
      console.error('Error checking session status:', error);
    }
    return { success: false, connected: false };
  };

  const getQrCode = async (sessionNameToCheck: string, token: string) => {
    try {
      console.log('Getting QR code for:', sessionNameToCheck);
      
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
        console.log('QR code response:', data);
        
        if (data.success && data.qr_code) {
          setQrCode(data.qr_code);
          setConnectionStatus('pending');
          return data.qr_code;
        }
      }
    } catch (error) {
      console.error('Error getting QR code:', error);
    }
    return null;
  };

  const startStatusChecking = (sessionNameToCheck: string, token: string) => {
    const interval = setInterval(async () => {
      try {
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

        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.status === 'connected') {
            setConnectionStatus('connected');
            setQrCode('');
            clearInterval(interval);
            toast({
              title: "WhatsApp conectado!",
              description: "Seu agente já pode receber mensagens",
            });
            return true;
          } else if (data.success && data.status === 'pending' && !qrCode) {
            // Se ainda está pendente e não temos QR code, tenta buscar
            await getQrCode(sessionNameToCheck, token);
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

  const refreshQrCode = async () => {
    if (!sessionName.trim()) return;
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Refreshing QR code for:', sessionName.trim());
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
