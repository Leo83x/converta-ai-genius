
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    openaiKey: '',
    password: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Primeiro, criar o usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
            phone: registerData.phone
          }
        }
      });

      if (authError) {
        toast({
          title: "Erro no cadastro",
          description: authError.message,
          variant: "destructive"
        });
        return;
      }

      if (authData.user) {
        // Inserir dados adicionais na tabela users
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: registerData.name,
            phone: registerData.phone,
            email: registerData.email,
            openai_key: registerData.openaiKey
          });

        if (userError) {
          console.error('Erro ao inserir dados do usuário:', userError);
        }

        toast({
          title: "Conta criada com sucesso!",
          description: "Você pode fazer login agora.",
        });
        
        // Limpar o formulário
        setRegisterData({
          name: '',
          phone: '',
          email: '',
          openaiKey: '',
          password: ''
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Converta+
          </h1>
          <p className="text-gray-600 mt-2">
            Automação inteligente de leads com IA
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bem-vindo</CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="seu@email.com"
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        required
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        required
                        value={registerData.phone}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      placeholder="seu@email.com"
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">Chave OpenAI (opcional)</Label>
                    <Input
                      id="openai-key"
                      placeholder="sk-..."
                      type="password"
                      value={registerData.openaiKey}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, openaiKey: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <Input
                      id="password-register"
                      type="password"
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
