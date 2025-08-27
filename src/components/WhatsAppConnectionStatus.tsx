
import { Loader2 } from 'lucide-react';

interface WhatsAppConnectionStatusProps {
  connectionStatus: string;
  qrCode: string;
}

const WhatsAppConnectionStatus = ({ connectionStatus, qrCode }: WhatsAppConnectionStatusProps) => {
  if (connectionStatus === 'creating' && !qrCode) {
    return (
      <div className="text-center py-4">
        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600">Criando instância...</p>
      </div>
    );
  }

  if (connectionStatus === 'pending' && !qrCode) {
    return (
      <div className="text-center py-4">
        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-orange-600" />
        <p className="text-sm text-gray-600">Aguardando QR Code...</p>
        <p className="text-xs text-gray-500 mt-1">Conectando com Z-API...</p>
      </div>
    );
  }

  if (connectionStatus === 'pending' && qrCode) {
    return (
      <div className="text-center py-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-orange-600 font-medium">Aguardando escaneamento...</p>
        </div>
        <p className="text-xs text-gray-500">Escaneie o QR Code com seu WhatsApp</p>
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

  if (connectionStatus === 'disconnected') {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-gray-500">Clique em "Criar Instância" para começar</p>
      </div>
    );
  }

  return null;
};

export default WhatsAppConnectionStatus;
