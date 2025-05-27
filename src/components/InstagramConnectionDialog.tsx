
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InstagramConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const InstagramConnectionDialog = ({ open, onOpenChange, onSuccess }: InstagramConnectionDialogProps) => {
  const [pageId, setPageId] = useState('');
  const [pageName, setPageName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const connectInstagram = async () => {
    if (!pageId.trim() || !pageName.trim() || !accessToken.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const { error } = await supabase
        .from('meta_connections')
        .insert({
          user_id: user?.id,
          channel_type: 'instagram',
          page_id: pageId.trim(),
          page_name: pageName.trim(),
          access_token: accessToken.trim(),
          token_expiration: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 dias
        });

      if (error) throw error;

      toast({
        title: "Instagram conectado!",
        description: "Sua página do Instagram foi conectada com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
      
      // Limpar campos
      setPageId('');
      setPageName('');
      setAccessToken('');
    } catch (error) {
      console.error('Error connecting Instagram:', error);
      toast({
        title: "Erro",
        description: "Não foi possível conectar o Instagram. Verifique os dados.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    setPageId('');
    setPageName('');
    setAccessToken('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar Instagram Direct</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pageName">Nome da Página</Label>
            <Input
              id="pageName"
              placeholder="Ex: Minha Loja"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pageId">ID da Página</Label>
            <Input
              id="pageId"
              placeholder="Ex: 123456789"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessToken">Token de Acesso</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="Token do Facebook/Meta"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
          </div>

          <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded">
            <p><strong>Como obter esses dados:</strong></p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Acesse o Facebook Developers</li>
              <li>Crie um app e configure Instagram Basic Display</li>
              <li>Gere um token de acesso de longa duração</li>
              <li>Copie o ID da sua página do Instagram</li>
            </ol>
          </div>

          <Button
            onClick={connectInstagram}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Conectando..." : "Conectar Instagram"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramConnectionDialog;
