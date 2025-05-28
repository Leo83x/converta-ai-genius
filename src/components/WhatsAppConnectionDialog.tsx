
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const WhatsAppConnectionDialog = ({ open, onOpenChange, onSuccess }: WhatsAppConnectionDialogProps) => {
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
    setQrCode(''); // Limpar QR code anterior
    
    try {
      console.log('Creating session with name:', sessionName.trim());
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Usuário não autenticado');
      }

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
        // Verificar se já veio conectado
        if (data.data && data.data.status === 'connected') {
          setConnectionStatus('connected');
          toast({
            title: "Conectado!",
            description: "WhatsApp já estava conectado",
          });
          onSuccess();
          handleClose();
          return;
        }

        // Verificar se tem QR code
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

            // Iniciar verificação de status
            startStatusChecking(sessionName.trim(), session.access_token);
          } else {
            // Se não tem QR code válido, tentar buscar
            setTimeout(() => {
              checkSessionStatus(sessionName.trim(), session.access_token);
            }, 2000);
          }
        } else {
          // Tentar buscar QR code
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
    } finally {
      setIsConnecting(false);
    }
  };

  const checkSessionStatus = async (sessionNameToCheck: string, token: string) => {
    try {
      console.log('Checking status for:', sessionNameToCheck);
      
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
        console.log('Status check response:', data);

        if (data && data.success) {
          if (data.status === 'connected') {
            setConnectionStatus('connected');
            setQrCode('');
            toast({
              title: "Conectado!",
              description: "WhatsApp conectado com sucesso!",
            });
            onSuccess();
            handleClose();
          } else if (data.qr_code && data.qr_code.length > 50) {
            setConnectionStatus('pending');
            setQrCode(data.qr_code);
            console.log('QR Code atualizado do status check');
          }
        }
      } else {
        console.error('Status check failed:', response.status);
      }
    } catch (error) {
      console.error('Error checking session status:', error);
    }
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
          
          if (data?.status === 'connected') {
            setConnectionStatus('connected');
            clearInterval(interval);
            toast({
              title: "WhatsApp conectado!",
              description: "Seu agente já pode receber mensagens",
            });
            onSuccess();
            handleClose();
          }
        }
      } catch (error) {
        console.error('Error in status check interval:', error);
      }
    }, 5000);

    // Parar de verificar após 5 minutos
    setTimeout(() => clearInterval(interval), 300000);
  };

  const handleClose = () => {
    setSessionName('');
    setQrCode('');
    setConnectionStatus('disconnected');
    setIsConnecting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp Business</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionName">Nome da Sessão</Label>
            <Input
              id="sessionName"
              placeholder="Ex: minha-loja-zap"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              disabled={connectionStatus === 'connected' || isConnecting}
            />
          </div>

          {connectionStatus === 'disconnected' && (
            <Button
              onClick={createSession}
              disabled={isConnecting || !sessionName.trim()}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando Sessão...
                </>
              ) : (
                "Criar Sessão"
              )}
            </Button>
          )}

          {qrCode && connectionStatus === 'pending' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-semibold mb-2">Escaneie o QR Code:</p>
                <div className="flex justify-center">
                  <img
                    src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                    alt="QR Code WhatsApp"
                    className="w-48 h-48 border rounded"
                    onError={(e) => {
                      console.error('Error loading QR Code image');
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('QR Code image loaded successfully');
                    }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Como conectar:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Toque em "Mais opções" (⋮) → "Dispositivos conectados"</li>
                  <li>Toque em "Conectar um dispositivo"</li>
                  <li>Aponte a câmera para este QR code</li>
                </ol>
              </div>
            </div>
          )}

          {connectionStatus === 'connecting' && !qrCode && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Gerando QR Code...</p>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="font-semibold text-green-800">✅ WhatsApp Conectado!</p>
              <p className="text-sm text-green-700">Sua conta está ativa e pronta para uso</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConnectionDialog;
