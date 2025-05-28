
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Crown, User, Mail, Phone, Key, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    openai_key: ''
  });

  useEffect(() => {
    console.log('Profile useEffect - user:', user?.id);
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) {
      console.log('Nenhum usuário logado para buscar dados');
      return;
    }
    
    console.log('Buscando dados do usuário:', user.id);
    setRefreshing(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar dados do usuário:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar suas informações.",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        console.log('Dados do usuário encontrados:', data);
        setUserData({
          name: data.name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          openai_key: data.openai_key || ''
        });
      } else {
        console.log('Usando dados do auth para usuário:', user.id);
        // Se não há dados na tabela users, usa dados do auth
        setUserData({
          name: user.user_metadata?.name || user.email?.split('@')[0] || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          openai_key: ''
        });
        
        // Cria o perfil automaticamente se não existir
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || null
          });
          
        if (insertError) {
          console.error('Erro ao criar perfil automaticamente:', insertError);
        } else {
          console.log('Perfil criado automaticamente');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro inesperado ao carregar suas informações.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshData = async () => {
    console.log('Atualizando dados manualmente...');
    await refreshUserData();
    await fetchUserData();
    toast({
      title: "Dados atualizados",
      description: "Suas informações foram recarregadas.",
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOpenAIKey = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          openai_key: userData.openai_key,
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Atualiza o estado local com os dados retornados
      if (data) {
        setUserData(prev => ({
          ...prev,
          openai_key: data.openai_key || ''
        }));
      }

      toast({
        title: "Chave OpenAI atualizada",
        description: "Sua chave da OpenAI foi salva com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar chave OpenAI:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar sua chave da OpenAI.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <Layout>
        <div className="p-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Acesso Negado</h1>
            <p className="text-gray-600 mt-2">Você precisa estar logado para acessar esta página.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
            <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e assinatura</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Dados da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-500 mb-4">
                  <strong>ID do Usuário:</strong> {user.id}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full md:w-auto" 
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Configurações de API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="openai-key">Chave OpenAI</Label>
                  <Input 
                    id="openai-key" 
                    type="password" 
                    placeholder="sk-..." 
                    value={userData.openai_key}
                    onChange={(e) => handleInputChange('openai_key', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Sua chave da OpenAI para utilizar os agentes de IA
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSaveOpenAIKey}
                  disabled={loading}
                >
                  {loading ? 'Atualizando...' : 'Atualizar Chave'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="mr-2 h-5 w-5 text-yellow-600" />
                  Plano Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-yellow-100 text-yellow-800 mb-4">
                    Premium Ativo
                  </Badge>
                  <p className="text-2xl font-bold">R$ 197,00</p>
                  <p className="text-sm text-gray-600">por mês</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Agentes ilimitados</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conversas ilimitadas</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CRM avançado</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Suporte prioritário</span>
                    <span className="text-green-600">✓</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Próxima cobrança:</p>
                  <p className="font-medium">15 de Fevereiro, 2025</p>
                </div>

                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Gerenciar Assinatura
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso do Plano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tokens Utilizados</span>
                    <span>85.234 / ∞</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Agentes Ativos</span>
                    <span>3 / ∞</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Conversas este mês</span>
                    <span>1.247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
