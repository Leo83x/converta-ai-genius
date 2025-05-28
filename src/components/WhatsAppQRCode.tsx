
interface WhatsAppQRCodeProps {
  qrCode: string;
  connectionStatus: string;
}

const WhatsAppQRCode = ({ qrCode, connectionStatus }: WhatsAppQRCodeProps) => {
  if (connectionStatus !== 'pending' || !qrCode) {
    return null;
  }

  return (
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
  );
};

export default WhatsAppQRCode;
