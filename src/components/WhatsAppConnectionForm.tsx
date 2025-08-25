
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface WhatsAppConnectionFormProps {
  sessionName: string;
  onSessionNameChange: (value: string) => void;
  connectionStatus: string;
  isConnecting: boolean;
  onCreateSession: () => void;
  onRefreshQR?: () => void;
}

const WhatsAppConnectionForm = ({
  sessionName,
  onSessionNameChange,
  connectionStatus,
  isConnecting,
  onCreateSession,
  onRefreshQR
}: WhatsAppConnectionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sessionName">Nome da Instância</Label>
        <Input
          id="sessionName"
          placeholder="Ex: Minha Loja WhatsApp"
          value={sessionName}
          onChange={(e) => onSessionNameChange(e.target.value)}
          disabled={connectionStatus === 'connected' || isConnecting}
        />
      </div>

      {connectionStatus === 'disconnected' && (
        <Button
          onClick={onCreateSession}
          disabled={isConnecting || !sessionName.trim()}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Criando Instância...
            </>
          ) : (
            "Criar Instância"
          )}
        </Button>
      )}

      {connectionStatus === 'pending' && onRefreshQR && (
        <Button
          onClick={onRefreshQR}
          variant="outline"
          className="w-full"
        >
          Atualizar QR Code
        </Button>
      )}
    </div>
  );
};

export default WhatsAppConnectionForm;
