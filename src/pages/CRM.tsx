
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Phone, Kanban, List } from 'lucide-react';
import NewLeadDialog from '@/components/NewLeadDialog';
import KanbanBoard from '@/components/KanbanBoard';
import LeadsListView from '@/components/LeadsListView';
import PipelineStageConfig from '@/components/PipelineStageConfig';

const CRM = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const handleLeadCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStagesUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
            <p className="text-gray-600 mt-2">Gerencie seus leads e funil de vendas</p>
          </div>
          <div className="flex gap-3">
            <PipelineStageConfig onStagesUpdated={handleStagesUpdated} />
            <NewLeadDialog onLeadCreated={handleLeadCreated} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Leads</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Qualificados</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Contato</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <Phone className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa Conversão</p>
                  <p className="text-2xl font-bold">36%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle and Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Funil de Vendas</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <Kanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'kanban' ? (
              <KanbanBoard refreshTrigger={refreshTrigger} />
            ) : (
              <LeadsListView refreshTrigger={refreshTrigger} />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CRM;
