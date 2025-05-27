
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Settings, Play, Pause, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Agent {
  id: string;
  name: string;
  channel: string;
  active: boolean;
  system_prompt: string;
  user_id: string;
  created_at: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Erro ao buscar agentes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agentes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAgent = async (agentId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ active: !currentActive })
        .eq('id', agentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAgents(agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, active: !currentActive }
          : agent
      ));

      toast({
        title: "Sucesso",
        description: `Agente ${!currentActive ? 'ativado' : 'pausado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o agente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAgents(agents.filter(agent => agent.id !== agentId));
      toast({
        title: "Sucesso",
        description: "Agente removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao remover agente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o agente.",
        variant: "destructive"
      });
    }
  };

  const handleEditAgent = (agentId: string) => {
    navigate(`/agents/edit/${agentId}`);
  };

  const handleCreateAgent = () => {
    navigate('/agents/create');
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agentes</h1>
            <p className="text-gray-600 mt-2">Gerencie seus agentes de IA</p>
          </div>
          <Button 
            onClick={handleCreateAgent}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Button>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agente criado</h3>
            <p className="text-gray-500 mb-4">Comece criando seu primeiro agente de IA</p>
            <Button onClick={handleCreateAgent} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Agente
            </Button>
          </div>
        ) : (
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
                        <p className="text-sm text-gray-500 capitalize">{agent.channel}</p>
                      </div>
                    </div>
                    <Badge variant={agent.active ? 'default' : 'secondary'}>
                      {agent.active ? 'Ativo' : 'Pausado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conversas</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Qualificados</span>
                      <span className="font-medium text-green-600">0</span>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditAgent(agent.id)}
                      >
                        <Settings className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button 
                        variant={agent.active ? 'destructive' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleAgent(agent.id, agent.active)}
                      >
                        {agent.active ? (
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Trash2 className="mr-1 h-3 w-3" />
                          Remover
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover Agente</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover o agente "{agent.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Agents;
