
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-create-session', {
        body: { sessionName: sessionName.trim() }
      });

      if (error) throw error;

      if (data.success) {
        setQrCode(data.data.qr_code);
        setConnectionStatus('pending');
        
        toast({
          title: "Sessão criada!",
          description: "Escaneie o QR Code com seu WhatsApp",
        });

        // Verificar status periodicamente
        const checkStatus = setInterval(async () => {
          try {
            const { data: statusData } = await supabase.functions.invoke('whatsapp-check-status', {
              body: { sessionName: sessionName.trim() }
            });

            if (statusData?.status === 'connected') {
              setConnectionStatus('connected');
              clearInterval(checkStatus);
              toast({
                title: "WhatsApp conectado!",
                description: "Seu agente já pode receber mensagens",
              });
              onSuccess();
              onOpenChange(false);
            }
          } catch (error) {
            console.error('Error checking status:', error);
          }
        }, 5000);

        // Parar de verificar após 5 minutos
        setTimeout(() => clearInterval(checkStatus), 300000);
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a sessão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    setSessionName('');
    setQrCode('');
    setConnectionStatus('disconnected');
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
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? "Criando Sessão..." : "Criar Sessão"}
            </Button>
          )}

          {qrCode && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-semibold mb-2">Escaneie o QR Code:</p>
                <div className="flex justify-center">
                  <img
                    src={qrCode}
                    alt="QR Code WhatsApp"
                    className="w-48 h-48 border rounded"
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
