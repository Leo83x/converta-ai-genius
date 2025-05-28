
import { Loader2 } from 'lucide-react';

interface WhatsAppConnectionStatusProps {
  connectionStatus: string;
  qrCode: string;
}

const WhatsAppConnectionStatus = ({ connectionStatus, qrCode }: WhatsAppConnectionStatusProps) => {
  if (connectionStatus === 'connecting' && !qrCode) {
    return (
      <div className="text-center py-4">
        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600">Gerando QR Code...</p>
      </div>
    );
  }

  if (connectionStatus === 'connected') {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
        <p className="font-semibold text-green-800">✅ WhatsApp Conectado!</p>
        <p className="text-sm text-green-700">Sua conta está ativa e pronta para uso</p>
      </div>
    );
  }

  return null;
};

export default WhatsAppConnectionStatus;
