
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const InstagramConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const connectInstagram = async () => {
    setIsConnecting(true);
    console.log('Conectando Instagram via Meta OAuth...');

    // TODO: Implementar OAuth do Meta/Facebook
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsConnecting(false);
      toast({
        title: "Instagram conectado!",
        description: "Sua conta está pronta para receber mensagens",
      });
    }, 3000);
  };

  const disconnectInstagram = () => {
    setConnectionStatus('disconnected');
    toast({
      title: "Instagram desconectado",
      description: "Conexão removida com sucesso",
    });
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800">Conectando</Badge>;
      default:
        return <Badge variant="secondary">Desconectado</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Converta+
            </h1>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Conexão Instagram</h2>
          <p className="text-gray-600">Conecte sua conta do Instagram para automatizar mensagens diretas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📸</span>
                <span>Instagram Business</span>
              </div>
              {getStatusBadge()}
            </CardTitle>
            <CardDescription>
              Conecte sua conta comercial do Instagram via Meta OAuth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {connectionStatus === 'disconnected' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Requisitos</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Conta comercial do Instagram</li>
                    <li>• Página do Facebook vinculada</li>
                    <li>• Permissões de administrador</li>
                  </ul>
                </div>
                <Button
                  onClick={connectInstagram}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  {isConnecting ? "Conectando Instagram..." : "Conectar com Instagram"}
                </Button>
              </div>
            )}

            {connectionStatus === 'connected' && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Instagram Conectado</h4>
                  <p className="text-sm text-green-700">
                    Sua conta @minha_empresa está ativa e recebendo mensagens
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900">Página conectada</h4>
                    <p className="text-sm text-gray-600">@minha_empresa</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900">Seguidores</h4>
                    <p className="text-sm text-gray-600">12,543</p>
                  </div>
                </div>

                <Button
                  onClick={disconnectInstagram}
                  variant="destructive"
                  className="w-full"
                >
                  Desconectar Instagram
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connected Agents */}
        {connectionStatus === 'connected' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Agentes Conectados</CardTitle>
              <CardDescription>
                Agentes que estão usando esta conexão do Instagram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      I
                    </div>
                    <div>
                      <h4 className="font-semibold">Instagram Bot</h4>
                      <p className="text-sm text-gray-600">Engajamento e atendimento</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default InstagramConnection;
