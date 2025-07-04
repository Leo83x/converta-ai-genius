
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { TrendingUp, Users, DollarSign, Award, Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AffiliatePanel = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência.",
    });
  };

  const stats = [
    {
      title: "Vendas Este Mês",
      value: "15",
      change: "+23%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Comissão Acumulada",
      value: "R$ 2.847,50",
      change: "+18%",
      icon: DollarSign,
      color: "text-blue-600"
    },
    {
      title: "Leads Convertidos",
      value: "47",
      change: "+12%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Nível do Representante",
      value: "Bronze",
      change: "Próximo: 20 vendas",
      icon: Award,
      color: "text-orange-600"
    }
  ];

  const recentSales = [
    { client: "João Silva", plan: "Anual", commission: "R$ 259,40", date: "Hoje" },
    { client: "Maria Santos", plan: "Mensal", commission: "R$ 25,80", date: "Ontem" },
    { client: "Pedro Costa", plan: "Anual", commission: "R$ 259,40", date: "2 dias atrás" },
    { client: "Ana Lima", plan: "Mensal", commission: "R$ 25,80", date: "3 dias atrás" },
  ];

  const affiliateLinks = [
    {
      name: "Link Principal",
      url: "https://convertamais.online/ref/SEU123",
      clicks: 342,
      conversions: 8
    },
    {
      name: "Landing Page Específica",
      url: "https://convertamais.online/lp1/ref/SEU123",
      clicks: 198,
      conversions: 5
    },
    {
      name: "Página de Preços",
      url: "https://convertamais.online/precos/ref/SEU123",
      clicks: 156,
      conversions: 2
    }
  ];

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Painel do Representante</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Acompanhe suas vendas, comissões e performance como representante Converta+
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`text-2xl ${stat.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Links de Afiliado */}
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Seus Links de Afiliado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {affiliateLinks.map((link, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{link.name}</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(link.url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-mono break-all">
                      {link.url}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {link.clicks} cliques
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {link.conversions} conversões
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendas Recentes */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{sale.client}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{sale.plan} • {sale.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600 dark:text-green-400 text-sm">{sale.commission}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Programa de Níveis */}
        <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Programa de Níveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium text-orange-800 dark:text-orange-200">Bronze</h4>
                <p className="text-sm text-orange-600 dark:text-orange-400">0-19 vendas</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">20% comissão</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <Award className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Prata</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">20-49 vendas</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">25% comissão</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <Award className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Ouro</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">50-99 vendas</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">30% comissão</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <Award className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Diamante</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">100+ vendas</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">35% comissão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AffiliatePanel;
