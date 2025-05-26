
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Crown, User, Mail, Phone, Key, CreditCard } from 'lucide-react';

const Profile = () => {
  return (
    <Layout>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e assinatura</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue="João Silva" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue="joao@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="+55 11 99999-9999" />
                  </div>
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" defaultValue="Minha Empresa Ltda" />
                  </div>
                </div>
                <Button className="w-full md:w-auto">
                  Salvar Alterações
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
                    defaultValue="sk-abc123..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Sua chave da OpenAI para utilizar os agentes de IA
                  </p>
                </div>
                <Button variant="outline">
                  Atualizar Chave
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
