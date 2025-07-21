
interface WhatsAppQRCodeProps {
  qrCode: string;
  connectionStatus: string;
}

const WhatsAppQRCode = ({ qrCode, connectionStatus }: WhatsAppQRCodeProps) => {
  // Debug logs para rastrear o estado
  console.log('WhatsAppQRCode - connectionStatus:', connectionStatus);
  console.log('WhatsAppQRCode - qrCode length:', qrCode?.length || 0);
  console.log('WhatsAppQRCode - qrCode preview:', qrCode?.substring(0, 50) || 'empty');

  // Só esconde se realmente não tiver QR code E o status não for pending
  if (!qrCode && connectionStatus !== 'pending') {
    console.log('WhatsAppQRCode - Hiding: no qrCode and status not pending');
    return null;
  }

  // Se tem QR code, usa diretamente (pode ser SVG ou PNG)
  let imageSrc = '';
  if (qrCode) {
    imageSrc = qrCode; // Usa diretamente o que vem da API
    console.log('WhatsAppQRCode - Image src prepared:', imageSrc.substring(0, 50));
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-semibold mb-2">Escaneie o QR Code:</p>
        <div className="flex justify-center">
          {qrCode ? (
            <img
              id="qrCodeImage"
              src={imageSrc}
              alt="QR Code WhatsApp"
              className="w-48 h-48 border-2 border-border rounded-lg bg-background"
              style={{
                display: 'block',
                minWidth: '192px',
                minHeight: '192px',
                maxWidth: '250px',
                maxHeight: '250px'
              }}
              onError={(e) => {
                console.error('QR Code image ERROR loading:', {
                  src: imageSrc.substring(0, 100),
                  length: imageSrc.length,
                  connectionStatus
                });
                e.currentTarget.style.border = '2px solid red';
                e.currentTarget.alt = 'Erro ao carregar QR Code';
              }}
              onLoad={() => {
                console.log('QR Code image loaded successfully', {
                  src: imageSrc.substring(0, 50),
                  connectionStatus
                });
              }}
            />
          ) : (
            <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/50 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Aguardando QR Code...</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {qrCode ? 'Se o QR Code não aparecer, clique em "Atualizar QR Code"' : 'Conectando com servidor...'}
        </p>
      </div>
      
      <div className="text-sm text-muted-foreground space-y-1">
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
