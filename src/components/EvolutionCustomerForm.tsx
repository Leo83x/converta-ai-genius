
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Mail, Phone, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EvolutionCustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateCustomer = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      console.log('Creating Evolution customer:', formData.name);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('https://xekxewtggioememydenu.functions.supabase.co/evolution-customer-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Erro na criação do cliente: ${response.status}`);
      }

      const data = await response.json();
      console.log('Customer creation response:', data);

      if (data.success) {
        toast({
          title: "Cliente criado com sucesso!",
          description: "Cliente registrado na Evolution API Cloud com canal WhatsApp ativado",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: ''
        });
      } else {
        throw new Error(data.error || 'Falha ao criar cliente');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Erro ao criar cliente",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Criar Cliente Evolution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Cliente</Label>
          <Input
            id="name"
            placeholder="Nome completo do cliente"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={isCreating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="cliente@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isCreating}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="phone"
              placeholder="+5511999999999"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={isCreating}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Senha segura para o cliente"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isCreating}
              className="pl-10"
            />
          </div>
        </div>

        <Button
          onClick={handleCreateCustomer}
          disabled={isCreating || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim()}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Criando Cliente...
            </>
          ) : (
            "Criar Cliente"
          )}
        </Button>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Configurações padrão:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Módulos: Chatbot, CRM, Events</li>
            <li>Canal WhatsApp ativado</li>
            <li>Limite de 2 instâncias por cliente</li>
            <li>Usuário criado automaticamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvolutionCustomerForm;
