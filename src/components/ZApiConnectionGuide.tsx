import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Smartphone, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ArrowRight,
  ExternalLink 
} from 'lucide-react';

const ZApiConnectionGuide = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-green-600" />
          Guia de Conexão Z-API
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Alert Informativo */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Modo Desenvolvimento:</strong> As instâncias Z-API são criadas em modo de desenvolvimento 
            com funcionalidades limitadas para fins de teste.
          </AlertDescription>
        </Alert>

        {/* Etapas do Processo */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Processo de Conexão:</h3>
          
          {/* Etapa 1 */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-blue-600">1</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Criar Instância</h4>
              <p className="text-sm text-muted-foreground">
                Insira um nome para sua instância e clique em "Criar Instância". 
                O sistema criará automaticamente uma instância Z-API e a assinará.
              </p>
              <Badge variant="secondary" className="text-xs">
                Automático
              </Badge>
            </div>
          </div>

          {/* Etapa 2 */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <QrCode className="w-4 h-4 text-orange-600" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Obter QR Code</h4>
              <p className="text-sm text-muted-foreground">
                Após a criação, o sistema busca automaticamente o QR Code da instância. 
                Se não aparecer imediatamente, clique em "Atualizar QR Code".
              </p>
              <Badge variant="secondary" className="text-xs">
                Manual se necessário
              </Badge>
            </div>
          </div>

          {/* Etapa 3 */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Conectar WhatsApp</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>1. Abra o WhatsApp no seu celular</p>
                <p>2. Toque em "Mais opções" (⋮) → "Dispositivos conectados"</p>
                <p>3. Toque em "Conectar um dispositivo"</p>
                <p>4. Escaneie o QR Code exibido</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Status Indicators */}
        <div className="space-y-3">
          <h3 className="font-semibold">Indicadores de Status:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span><strong>Aguardando QR:</strong> Instância criada, buscando QR Code</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span><strong>Conectado:</strong> WhatsApp ativo e pronto</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span><strong>Erro:</strong> Problema na conexão</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Dev</Badge>
              <span><strong>Modo Desenvolvimento</strong></span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Dicas e Troubleshooting */}
        <div className="space-y-3">
          <h3 className="font-semibold">Dicas de Troubleshooting:</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Se o QR Code não aparecer, aguarde alguns segundos e tente "Atualizar QR Code"</li>
            <li>• Certifique-se de que seu WhatsApp está na versão mais recente</li>
            <li>• O QR Code tem validade limitada - se expirar, gere um novo</li>
            <li>• Apenas um dispositivo pode estar conectado por vez na mesma conta</li>
          </ul>
        </div>

        {/* Links Úteis */}
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" asChild>
            <a href="https://developer.z-api.io/partner/introduction" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação Oficial Z-API
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZApiConnectionGuide;