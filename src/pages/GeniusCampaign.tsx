import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  Users, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Lightbulb,
  Zap,
  CheckCircle,
  Plus,
  Edit,
  Play,
  BarChart3,
  Eye,
  Grid3X3
} from 'lucide-react';

const segments = [
  'Médico', 'Dentista', 'Esteticista', 'Advogado', 'Infoprodutor',
  'Coach', 'Consultor', 'E-commerce', 'Restaurante', 'Academia',
  'Imobiliário', 'Financeiro', 'Educação', 'Tecnologia', 'Outro'
];

const objectives = [
  'Captar leads qualificados',
  'Vender um produto específico',
  'Agendar consultas/reuniões',
  'Lançar infoproduto',
  'Aumentar engajamento',
  'Educar o mercado',
  'Remarketing para clientes',
  'Expandir base de seguidores'
];

const platforms = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'google', label: 'Google Ads' },
  { id: 'facebook', label: 'Facebook Ads' },
  { id: 'email', label: 'E-mail Marketing' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'linkedin', label: 'LinkedIn' }
];

const formats = [
  { id: 'video', label: 'Vídeo' },
  { id: 'carousel', label: 'Carrossel' },
  { id: 'automation', label: 'Mensagem Automática' },
  { id: 'email-sequence', label: 'Sequência de E-mails' },
  { id: 'stories', label: 'Stories' },
  { id: 'webinar', label: 'Webinar' },
  { id: 'ebook', label: 'E-book' },
  { id: 'quiz', label: 'Quiz Interativo' }
];

const tones = [
  'Profissional e formal',
  'Amigável e próximo',
  'Especialista e educativo',
  'Inspiracional e motivador',
  'Urgente e persuasivo',
  'Descontraído e divertido'
];

type Campaign = Tables<'genius_campaigns'>;

export default function GeniusCampaign() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'dashboard' | 'wizard'>('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    segment: '',
    objective: '',
    platforms: [] as string[],
    budget: '',
    duration: '',
    formats: [] as string[],
    tone: '',
    persona: '',
    hasStrategy: false,
    additionalInfo: ''
  });

  const steps = [
    { title: 'Informações Básicas', icon: Target },
    { title: 'Público & Objetivo', icon: Users },
    { title: 'Plataformas & Orçamento', icon: DollarSign },
    { title: 'Formato & Cronograma', icon: Calendar },
    { title: 'Tom & Persona', icon: MessageSquare },
    { title: 'Finalização', icon: CheckCircle }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (view === 'dashboard') {
      loadCampaigns();
    }
  }, [view]);

  const loadCampaigns = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('genius_campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas campanhas.",
        variant: "destructive"
      });
    }
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setCampaignData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platformId]
        : prev.platforms.filter(p => p !== platformId)
    }));
  };

  const handleFormatChange = (formatId: string, checked: boolean) => {
    setCampaignData(prev => ({
      ...prev,
      formats: checked 
        ? [...prev.formats, formatId]
        : prev.formats.filter(f => f !== formatId)
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      if (editingCampaign) {
        // Update existing campaign
        const { error } = await supabase
          .from('genius_campaigns')
          .update({
            name: campaignData.name,
            segment: campaignData.segment,
            objective: campaignData.objective,
            platform: campaignData.platforms,
            budget: campaignData.budget,
            duration: campaignData.duration,
            format: campaignData.formats,
            tone: campaignData.tone,
            persona: campaignData.persona,
            has_strategy: campaignData.hasStrategy,
            campaign_data: campaignData
          })
          .eq('id', editingCampaign.id);

        if (error) throw error;

        toast({
          title: "Campanha atualizada!",
          description: "Sua campanha foi atualizada com sucesso.",
        });
      } else {
        // Create new campaign
        const { error } = await supabase
          .from('genius_campaigns')
          .insert({
            user_id: user.id,
            name: campaignData.name,
            segment: campaignData.segment,
            objective: campaignData.objective,
            platform: campaignData.platforms,
            budget: campaignData.budget,
            duration: campaignData.duration,
            format: campaignData.formats,
            tone: campaignData.tone,
            persona: campaignData.persona,
            has_strategy: campaignData.hasStrategy,
            status: 'draft',
            campaign_data: campaignData
          });

        if (error) throw error;

        toast({
          title: "Campanha criada!",
          description: "Sua campanha foi criada com sucesso. O Genius AI começará a processar suas estratégias.",
        });
      }

      // Reset form and go back to dashboard
      resetForm();
      setView('dashboard');

    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a campanha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCampaignData({
      name: '',
      segment: '',
      objective: '',
      platforms: [],
      budget: '',
      duration: '',
      formats: [],
      tone: '',
      persona: '',
      hasStrategy: false,
      additionalInfo: ''
    });
    setCurrentStep(0);
    setEditingCampaign(null);
  };

  const handleNewCampaign = () => {
    resetForm();
    setView('wizard');
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignData({
      name: campaign.name,
      segment: campaign.segment || '',
      objective: campaign.objective || '',
      platforms: campaign.platform || [],
      budget: campaign.budget || '',
      duration: campaign.duration || '',
      formats: campaign.format || [],
      tone: campaign.tone || '',
      persona: campaign.persona || '',
      hasStrategy: campaign.has_strategy || false,
      additionalInfo: ''
    });
    setView('wizard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'draft': return 'Rascunho';
      case 'completed': return 'Concluída';
      case 'paused': return 'Pausada';
      default: return 'Rascunho';
    }
  };

  const handleActivateCampaign = async (campaign: Campaign) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('genius_campaigns')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', campaign.id);

      if (error) throw error;

      // Atualiza o estado local
      setCampaigns(prev => 
        prev.map(c => 
          c.id === campaign.id 
            ? { ...c, status: 'active' as const }
            : c
        )
      );

      toast({
        title: "Campanha ativada!",
        description: `A campanha "${campaign.name}" foi ativada com sucesso. Você pode acompanhar o desempenho no Dashboard.`
      });

      // Integração: Criar leads automáticos no CRM baseado na campanha
      if (campaign.objective?.includes('leads') || campaign.objective?.includes('captar')) {
        // Criar um lead inicial no CRM para rastreamento
        await supabase
          .from('leads')
          .insert({
            user_id: user.id,
            name: `Lead Campanha: ${campaign.name}`,
            source: `Campanha Genius - ${campaign.platform?.join(', ')}`,
            stage: 'new',
            notes: `Lead gerado automaticamente pela ativação da campanha "${campaign.name}" no segmento ${campaign.segment}`
          });
      }

    } catch (error) {
      console.error('Erro ao ativar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível ativar a campanha. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewCRM = () => {
    navigate('/crm');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-bold">Vamos criar sua campanha!</h2>
              <p className="text-muted-foreground">O Genius AI vai te guiar para criar a campanha perfeita</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Campanha</Label>
                <Input
                  id="name"
                  placeholder="Ex: Campanha Black Friday 2024"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="segment">Segmento de Atuação</Label>
                <Select value={campaignData.segment} onValueChange={(value) => setCampaignData(prev => ({ ...prev, segment: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map(segment => (
                      <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 text-blue-500 mx-auto" />
              <h2 className="text-2xl font-bold">Defina seu objetivo</h2>
              <p className="text-muted-foreground">Qual o principal objetivo desta campanha?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Objetivo Principal</Label>
                <Select value={campaignData.objective} onValueChange={(value) => setCampaignData(prev => ({ ...prev, objective: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map(objective => (
                      <SelectItem key={objective} value={objective}>{objective}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="persona">Descreva seu público-alvo</Label>
                <Textarea
                  id="persona"
                  placeholder="Ex: Mulheres de 25-40 anos, interessadas em estética, renda média-alta, ativas nas redes sociais..."
                  value={campaignData.persona}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, persona: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <DollarSign className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Plataformas & Orçamento</h2>
              <p className="text-muted-foreground">Onde você quer divulgar e quanto pode investir?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Plataformas Desejadas (selecione todas que interessam)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {platforms.map(platform => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={campaignData.platforms.includes(platform.id)}
                        onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                      />
                      <Label htmlFor={platform.id}>{platform.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="budget">Orçamento Disponível</Label>
                <Select value={campaignData.budget} onValueChange={(value) => setCampaignData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua faixa de orçamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500">Até R$ 500</SelectItem>
                    <SelectItem value="500-1500">R$ 500 - R$ 1.500</SelectItem>
                    <SelectItem value="1500-5000">R$ 1.500 - R$ 5.000</SelectItem>
                    <SelectItem value="5000-15000">R$ 5.000 - R$ 15.000</SelectItem>
                    <SelectItem value="15000+">Acima de R$ 15.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 text-purple-500 mx-auto" />
              <h2 className="text-2xl font-bold">Formato & Cronograma</h2>
              <p className="text-muted-foreground">Como você quer se comunicar com seu público?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Formatos Preferidos</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {formats.map(format => (
                    <div key={format.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={format.id}
                        checked={campaignData.formats.includes(format.id)}
                        onCheckedChange={(checked) => handleFormatChange(format.id, checked as boolean)}
                      />
                      <Label htmlFor={format.id}>{format.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="duration">Duração/Urgência da Campanha</Label>
                <Select value={campaignData.duration} onValueChange={(value) => setCampaignData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-week">1 semana (urgente)</SelectItem>
                    <SelectItem value="2-4-weeks">2-4 semanas</SelectItem>
                    <SelectItem value="1-3-months">1-3 meses</SelectItem>
                    <SelectItem value="ongoing">Campanha contínua</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <MessageSquare className="h-12 w-12 text-indigo-500 mx-auto" />
              <h2 className="text-2xl font-bold">Tom & Estratégia</h2>
              <p className="text-muted-foreground">Como você quer se comunicar?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Tom de Linguagem</Label>
                <Select value={campaignData.tone} onValueChange={(value) => setCampaignData(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o tom ideal" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(tone => (
                      <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasStrategy"
                  checked={campaignData.hasStrategy}
                  onCheckedChange={(checked) => setCampaignData(prev => ({ ...prev, hasStrategy: checked as boolean }))}
                />
                <Label htmlFor="hasStrategy">
                  Já tenho uma estratégia definida (caso contrário, o Genius AI criará uma para você)
                </Label>
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Alguma observação especial, preferência ou restrição que devemos considerar?"
                  value={campaignData.additionalInfo}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Resumo da Campanha</h2>
              <p className="text-muted-foreground">Confira os dados antes de criar sua campanha</p>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    {campaignData.name}
                  </CardTitle>
                  <CardDescription>{campaignData.segment} • {campaignData.objective}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">PLATAFORMAS</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaignData.platforms.map(platform => (
                        <Badge key={platform} variant="secondary">
                          {platforms.find(p => p.id === platform)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">FORMATOS</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaignData.formats.map(format => (
                        <Badge key={format} variant="outline">
                          {formats.find(f => f.id === format)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">ORÇAMENTO</Label>
                      <p>R$ {campaignData.budget}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">DURAÇÃO</Label>
                      <p>{campaignData.duration}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">TOM</Label>
                    <p className="text-sm">{campaignData.tone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (view === 'dashboard') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-amber-500" />
                Campanhas Genius
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas campanhas de marketing inteligentes
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleViewDashboard}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleViewCRM}>
                <Users className="h-4 w-4 mr-2" />
                CRM
              </Button>
              <Button onClick={handleNewCampaign} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Campanha
              </Button>
            </div>
            </div>

          {/* Campaign Grid */}
          {campaigns.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma campanha criada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira campanha inteligente com o Genius AI
                </p>
                <Button onClick={handleNewCampaign}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Campanha
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status || 'draft')}`} />
                          {getStatusLabel(campaign.status || 'draft')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">{campaign.segment}</p>
                      <p className="text-xs text-muted-foreground">{campaign.objective}</p>
                    </div>
                    
                    {campaign.platform && campaign.platform.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">PLATAFORMAS</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {campaign.platform.slice(0, 3).map((platform: string) => (
                            <Badge key={platform} variant="secondary" className="text-xs">
                              {platforms.find(p => p.id === platform)?.label}
                            </Badge>
                          ))}
                          {campaign.platform.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{campaign.platform.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Criada: {new Date(campaign.created_at).toLocaleDateString()}</span>
                      <span>{campaign.budget}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCampaign(campaign)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        disabled={campaign.status === 'active'}
                        onClick={() => handleActivateCampaign(campaign)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {campaign.status === 'active' ? 'Ativa' : 'Ativar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-amber-500" />
              {editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
            </h1>
            <p className="text-muted-foreground">
              {editingCampaign ? 'Atualize os dados da sua campanha' : 'Crie campanhas de marketing inteligentes com a ajuda da IA'}
            </p>
          </div>
          <Button variant="outline" onClick={() => setView('dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Progresso</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div className={`
                    p-2 rounded-full border-2 transition-colors
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 border-blue-500 text-white' : 
                      'bg-muted border-border text-muted-foreground'}
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-center hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSave}
              disabled={isLoading || !campaignData.name}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {isLoading ? (editingCampaign ? 'Salvando...' : 'Criando...') : (editingCampaign ? 'Salvar Alterações' : 'Criar Campanha')}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && (!campaignData.name || !campaignData.segment)) ||
                (currentStep === 1 && (!campaignData.objective || !campaignData.persona))
              }
              className="flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}