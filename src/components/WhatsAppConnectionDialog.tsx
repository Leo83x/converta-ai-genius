
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useZapiConnection } from '@/hooks/useZapiConnection';
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
    instanceName,
    setInstanceName,
    qrCode,
    isConnecting,
    connectionStatus,
    createInstance,
    resetConnection,
    refreshQrCode,
  } = useZapiConnection();

  const handleCreateInstance = async () => {
    const result = await createInstance();
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
            sessionName={instanceName}
            onSessionNameChange={setInstanceName}
            connectionStatus={connectionStatus}
            isConnecting={isConnecting}
            onCreateSession={handleCreateInstance}
            onRefreshQR={refreshQrCode}
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
