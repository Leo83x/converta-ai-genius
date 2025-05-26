
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Settings, Play, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Agents = () => {
  const [agents] = useState([
    {
      id: 1,
      name: 'Vendas WhatsApp',
      channel: 'WhatsApp',
      status: 'active',
      conversations: 24,
      qualified: 12
    },
    {
      id: 2,
      name: 'Suporte Instagram',
      channel: 'Instagram',
      status: 'paused',
      conversations: 8,
      qualified: 3
    }
  ]);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agentes</h1>
            <p className="text-gray-600 mt-2">Gerencie seus agentes de IA</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <p className="text-sm text-gray-500">{agent.channel}</p>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status === 'active' ? 'Ativo' : 'Pausado'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversas</span>
                    <span className="font-medium">{agent.conversations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Qualificados</span>
                    <span className="font-medium text-green-600">{agent.qualified}</span>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Settings className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button 
                      variant={agent.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      className="flex-1"
                    >
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="mr-1 h-3 w-3" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Ativar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Agents;
