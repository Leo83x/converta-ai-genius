
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
  color: string;
}

interface PipelineStageConfigProps {
  onStagesUpdated: () => void;
}

const PipelineStageConfig = ({ onStagesUpdated }: PipelineStageConfigProps) => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [open, setOpen] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#3B82F6');
  const { user } = useAuth();

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EF4444', '#059669', '#6B7280', '#EC4899'
  ];

  const fetchStages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index');

      if (error) throw error;
      setStages(data || []);
    } catch (error) {
      console.error('Erro ao carregar estágios:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStages();
    }
  }, [open, user]);

  const addStage = async () => {
    if (!user || !newStageName.trim()) return;

    try {
      const maxOrder = Math.max(...stages.map(s => s.order_index), 0);
      
      const { error } = await supabase
        .from('pipeline_stages')
        .insert({
          user_id: user.id,
          name: newStageName.trim(),
          order_index: maxOrder + 1,
          color: newStageColor
        });

      if (error) throw error;

      setNewStageName('');
      toast.success('Estágio adicionado com sucesso!');
      fetchStages();
      onStagesUpdated();
    } catch (error) {
      console.error('Erro ao adicionar estágio:', error);
      toast.error('Erro ao adicionar estágio');
    }
  };

  const deleteStage = async (stageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pipeline_stages')
        .delete()
        .eq('id', stageId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Estágio removido com sucesso!');
      fetchStages();
      onStagesUpdated();
    } catch (error) {
      console.error('Erro ao remover estágio:', error);
      toast.error('Erro ao remover estágio');
    }
  };

  const updateStageOrder = async (stageId: string, newOrder: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pipeline_stages')
        .update({ order_index: newOrder })
        .eq('id', stageId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      fetchStages();
      onStagesUpdated();
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
    }
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newStages.length) return;
    
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    
    // Atualizar ordem no banco
    newStages.forEach((stage, idx) => {
      updateStageOrder(stage.id, idx + 1);
    });
    
    setStages(newStages);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Funil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurar Estágios do Funil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Adicionar novo estágio */}
          <div className="flex gap-2">
            <Input
              placeholder="Nome do novo estágio"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewStageColor(color)}
                  className={`w-6 h-6 rounded border-2 ${
                    newStageColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Button onClick={addStage} disabled={!newStageName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de estágios */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {stages.map((stage, index) => (
              <Card key={stage.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStage(index, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStage(index, 'down')}
                          disabled={index === stages.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          ↓
                        </Button>
                      </div>
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <Badge 
                        style={{ backgroundColor: stage.color + '20', borderColor: stage.color }}
                        className="border"
                      >
                        {stage.name}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Ordem: {stage.order_index}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStage(stage.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineStageConfig;
