
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
import { useIsMobile } from '@/hooks/use-mobile';

const CRM = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const isMobile = useIsMobile();

  const handleLeadCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStagesUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">CRM</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Gerencie seus leads e funil de vendas</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <PipelineStageConfig onStagesUpdated={handleStagesUpdated} />
            <NewLeadDialog onLeadCreated={handleLeadCreated} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total de Leads</p>
                  <p className="text-lg md:text-2xl font-bold">0</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Qualificados</p>
                  <p className="text-lg md:text-2xl font-bold">0</p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Em Contato</p>
                  <p className="text-lg md:text-2xl font-bold">0</p>
                </div>
                <Phone className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Taxa Conversão</p>
                  <p className="text-lg md:text-2xl font-bold">0%</p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle and Content */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <CardTitle className="text-lg md:text-xl">Funil de Vendas</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size={isMobile ? 'sm' : 'default'}
                onClick={() => setViewMode('kanban')}
                className="flex-1 sm:flex-none"
              >
                <Kanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size={isMobile ? 'sm' : 'default'}
                onClick={() => setViewMode('list')}
                className="flex-1 sm:flex-none"
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
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
