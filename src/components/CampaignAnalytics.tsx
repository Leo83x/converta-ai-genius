import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, DollarSign, MousePointer, Eye } from 'lucide-react';

interface CampaignAnalyticsProps {
  campaignId: string;
}

const CampaignAnalytics = ({ campaignId }: CampaignAnalyticsProps) => {
  const { user } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['campaign-metrics', campaignId],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      const totalMetrics = data?.reduce((acc, curr) => ({
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

      return { dailyMetrics: data, totalMetrics };
    },
    enabled: !!user?.id && !!campaignId
  });

  const { data: campaignLeads } = useQuery({
    queryKey: ['campaign-leads', campaignId],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id);

      return data || [];
    },
    enabled: !!user?.id && !!campaignId
  });

  if (isLoading) {
    return <div className="animate-pulse">Carregando métricas...</div>;
  }

  const ctr = metrics?.totalMetrics?.impressions > 0 
    ? (metrics.totalMetrics.clicks / metrics.totalMetrics.impressions * 100).toFixed(2)
    : 0;

  const conversionRate = metrics?.totalMetrics?.clicks > 0
    ? (metrics.totalMetrics.conversions / metrics.totalMetrics.clicks * 100).toFixed(2)
    : 0;

  const roi = metrics?.totalMetrics?.cost > 0
    ? (((metrics.totalMetrics.revenue - metrics.totalMetrics.cost) / metrics.totalMetrics.cost) * 100).toFixed(2)
    : 0;

  const costPerLead = metrics?.totalMetrics?.leads_generated > 0
    ? (metrics.totalMetrics.cost / metrics.totalMetrics.leads_generated).toFixed(2)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressões</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalMetrics?.impressions || 0}</div>
            <p className="text-xs text-muted-foreground">Total de visualizações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalMetrics?.clicks || 0}</div>
            <p className="text-xs text-muted-foreground">CTR: {ctr}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignLeads?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Custo por lead: R$ {costPerLead}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalMetrics?.conversions || 0}</div>
            <p className="text-xs text-muted-foreground">Taxa: {conversionRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metrics?.totalMetrics?.cost || 0}</div>
            <p className="text-xs text-muted-foreground">Gasto total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Leads da Campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {campaignLeads?.map((lead) => (
              <div key={lead.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email || lead.phone}</p>
                </div>
                <Badge variant={
                  lead.stage === 'won' ? 'default' :
                  lead.stage === 'qualified' ? 'secondary' :
                  'outline'
                }>
                  {lead.stage}
                </Badge>
              </div>
            )) || <p className="text-muted-foreground">Nenhum lead gerado ainda</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAnalytics;