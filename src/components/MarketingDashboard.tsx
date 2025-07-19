import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  BarChart3,
  Play,
  Pause,
  Eye
} from 'lucide-react';

const MarketingDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: marketingStats, isLoading } = useQuery({
    queryKey: ['marketing-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Buscar campanhas
      const { data: campaigns } = await supabase
        .from('genius_campaigns')
        .select('*')
        .eq('user_id', user.id);

      // Buscar métricas das campanhas
      const { data: metrics } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('user_id', user.id);

      // Buscar leads por campanha
      const { data: campaignLeads } = await supabase
        .from('leads')
        .select('*, genius_campaigns!campaign_id(name)')
        .eq('user_id', user.id)
        .not('campaign_id', 'is', null);

      const totalMetrics = metrics?.reduce((acc, curr) => ({
        impressions: acc.impressions + curr.impressions,
        clicks: acc.clicks + curr.clicks,
        conversions: acc.conversions + curr.conversions,
        cost: acc.cost + curr.cost,
        revenue: acc.revenue + curr.revenue,
        leads_generated: acc.leads_generated + curr.leads_generated
      }), {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        revenue: 0,
        leads_generated: 0
      });

      const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
      const totalCampaigns = campaigns?.length || 0;

      return {
        campaigns,
        totalMetrics,
        campaignLeads,
        activeCampaigns,
        totalCampaigns
      };
    },
    enabled: !!user?.id
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'completed': return 'outline';
      default: return 'destructive';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Finalizada';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  const roi = marketingStats?.totalMetrics?.cost > 0
    ? (((marketingStats.totalMetrics.revenue - marketingStats.totalMetrics.cost) / marketingStats.totalMetrics.cost) * 100).toFixed(2)
    : 0;

  if (isLoading) {
    return <div className="animate-pulse">Carregando dashboard de marketing...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingStats?.activeCampaigns || 0}</div>
            <p className="text-xs text-muted-foreground">
              de {marketingStats?.totalCampaigns || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads de Marketing</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingStats?.campaignLeads?.length || 0}</div>
            <p className="text-xs text-muted-foreground">leads por campanhas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {marketingStats?.totalMetrics?.cost || 0}</div>
            <p className="text-xs text-muted-foreground">em todas as campanhas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roi}%</div>
            <Badge variant={Number(roi) > 0 ? "default" : "destructive"}>
              {Number(roi) > 0 ? "Positivo" : "Negativo"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Campanha */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance por Campanha</CardTitle>
          <Button 
            onClick={() => navigate('/genius-campaign')}
            size="sm"
          >
            Ver Todas
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketingStats?.campaigns?.slice(0, 5).map((campaign) => {
              const campaignLeads = marketingStats.campaignLeads?.filter(
                lead => lead.campaign_id === campaign.id
              ).length || 0;

              return (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <Badge variant={getStatusColor(campaign.status)}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.objective} • {campaign.platform?.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{campaignLeads}</div>
                      <div className="text-muted-foreground">Leads</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/genius-campaign?edit=${campaign.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              );
            }) || <p className="text-muted-foreground">Nenhuma campanha criada ainda</p>}
          </div>
        </CardContent>
      </Card>

      {/* Leads Recentes de Campanhas */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Recentes (Campanhas)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {marketingStats?.campaignLeads?.slice(0, 10).map((lead) => (
              <div key={lead.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.email || lead.phone} • {(lead as any).genius_campaigns?.name}
                  </p>
                </div>
                <Badge variant={
                  lead.stage === 'won' ? 'default' :
                  lead.stage === 'qualified' ? 'secondary' :
                  'outline'
                }>
                  {lead.stage}
                </Badge>
              </div>
            )) || <p className="text-muted-foreground">Nenhum lead de campanha ainda</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingDashboard;