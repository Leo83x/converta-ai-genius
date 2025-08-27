import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, RefreshCw, MessageSquare, Settings } from 'lucide-react';
import ZApiStatusIndicator from './ZApiStatusIndicator';

interface ZApiInstance {
  id: string;
  instanceId: string;
  signed: boolean;
  status: string;
  created_at: string;
}

interface ZApiInstanceCardProps {
  instance: ZApiInstance;
  onRefresh: () => void;
  onDisconnect: () => void;
  onTest: () => void;
}

const ZApiInstanceCard = ({ instance, onRefresh, onDisconnect, onTest }: ZApiInstanceCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Instância Z-API
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {instance.instanceId}
            </p>
          </div>
          <ZApiStatusIndicator 
            status={instance.status} 
            developmentMode={true} 
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status da Assinatura</span>
            <Badge variant={instance.signed ? 'default' : 'secondary'}>
              {instance.signed ? 'Assinada' : 'Não Assinada'}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Criado em</span>
            <span className="text-sm font-medium">
              {formatDate(instance.created_at)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          {instance.status === 'connected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTest}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Testar
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className={instance.status === 'connected' ? 'flex-1' : 'flex-1'}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onDisconnect}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZApiInstanceCard;