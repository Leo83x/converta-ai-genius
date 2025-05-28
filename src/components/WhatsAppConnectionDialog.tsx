
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWhatsAppConnection } from '@/hooks/useWhatsAppConnection';
import WhatsAppConnectionForm from './WhatsAppConnectionForm';
import WhatsAppQRCode from './WhatsAppQRCode';
import WhatsAppConnectionStatus from './WhatsAppConnectionStatus';

interface WhatsAppConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const WhatsAppConnectionDialog = ({ open, onOpenChange, onSuccess }: WhatsAppConnectionDialogProps) => {
  const {
    sessionName,
    setSessionName,
    qrCode,
    isConnecting,
    connectionStatus,
    createSession,
    resetConnection
  } = useWhatsAppConnection();

  const handleCreateSession = async () => {
    const result = await createSession();
    if (result?.success && result?.connected) {
      onSuccess();
      handleClose();
    }
  };

  const handleClose = () => {
    resetConnection();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp Business</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <WhatsAppConnectionForm
            sessionName={sessionName}
            onSessionNameChange={setSessionName}
            connectionStatus={connectionStatus}
            isConnecting={isConnecting}
            onCreateSession={handleCreateSession}
          />

          <WhatsAppQRCode
            qrCode={qrCode}
            connectionStatus={connectionStatus}
          />

          <WhatsAppConnectionStatus
            connectionStatus={connectionStatus}
            qrCode={qrCode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConnectionDialog;
