
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useZapiConnection } from '@/hooks/useZapiConnection';
import WhatsAppConnectionForm from './WhatsAppConnectionForm';
import WhatsAppQRCode from './WhatsAppQRCode';
import WhatsAppConnectionStatus from './WhatsAppConnectionStatus';
import ZApiConnectionGuide from './ZApiConnectionGuide';

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp Business via Z-API</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect">Conectar</TabsTrigger>
            <TabsTrigger value="guide">Guia Completo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect" className="space-y-6 mt-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  connectionStatus !== 'disconnected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  1
                </div>
                <span className="text-sm text-muted-foreground">Criar</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  connectionStatus === 'pending' || connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  2
                </div>
                <span className="text-sm text-muted-foreground">QR Code</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  3
                </div>
                <span className="text-sm text-muted-foreground">Conectar</span>
              </div>
            </div>

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
          </TabsContent>
          
          <TabsContent value="guide" className="mt-6">
            <ZApiConnectionGuide />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConnectionDialog;
