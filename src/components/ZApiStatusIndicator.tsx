import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';

interface ZApiStatusIndicatorProps {
  status: string;
  developmentMode?: boolean;
}

const ZApiStatusIndicator = ({ status, developmentMode }: ZApiStatusIndicatorProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          text: developmentMode ? 'Conectado (Dev)' : 'Conectado',
          variant: 'outline' as const,
          className: 'text-green-600 border-green-300 bg-green-50'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Aguardando QR',
          variant: 'outline' as const,
          className: 'text-orange-600 border-orange-300 bg-orange-50'
        };
      case 'creating':
        return {
          icon: Loader2,
          text: 'Criando...',
          variant: 'outline' as const,
          className: 'text-blue-600 border-blue-300 bg-blue-50'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Erro',
          variant: 'outline' as const,
          className: 'text-red-600 border-red-300 bg-red-50'
        };
      case 'disconnected':
      default:
        return {
          icon: XCircle,
          text: 'Desconectado',
          variant: 'outline' as const,
          className: 'text-gray-600 border-gray-300 bg-gray-50'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className={`w-3 h-3 mr-1 ${status === 'creating' ? 'animate-spin' : ''}`} />
      {config.text}
    </Badge>
  );
};

export default ZApiStatusIndicator;