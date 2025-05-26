
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, MessageCircle, Book, Video, Mail, Clock } from 'lucide-react';

const Support = () => {
  const tickets = [
    {
      id: 'T001',
      subject: 'Problema com integração WhatsApp',
      status: 'open',
      priority: 'high',
      created: '2024-01-15'
    },
    {
      id: 'T002',
      subject: 'Dúvida sobre configuração de agente',
      status: 'resolved',
      priority: 'medium',
      created: '2024-01-10'
    }
  ];

  const faqItems = [
    {
      question: 'Como conectar meu WhatsApp Business?',
      answer: 'Para conectar seu WhatsApp Business, acesse a seção Integrações e clique em WhatsApp...'
    },
    {
      question: 'Como criar um novo agente de IA?',
      answer: 'Vá para a página Agentes e clique em "Novo Agente". Defina o nome, canal e prompt do sistema...'
    },
    {
      question: 'Posso usar minha própria chave OpenAI?',
      answer: 'Sim! Você pode configurar sua chave OpenAI na seção Perfil > Configurações de API...'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Suporte</h1>
          <p className="text-gray-600 mt-2">Encontre ajuda e entre em contato conosco</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Help */}
          <div className="lg:col-span-2 space-y-6">
            {/* Support Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Book className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Documentação</h3>
                  <p className="text-sm text-gray-600">Guias completos e tutoriais</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Vídeo Tutoriais</h3>
                  <p className="text-sm text-gray-600">Aprenda assistindo</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Chat ao Vivo</h3>
                  <p className="text-sm text-gray-600">Suporte em tempo real</p>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium mb-2">{item.question}</h4>
                      <p className="text-sm text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Abrir Ticket de Suporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input id="subject" placeholder="Descreva brevemente o problema" />
                  </div>
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva o problema em detalhes..."
                    rows={5}
                  />
                </div>
                <Button className="w-full md:w-auto">
                  Enviar Ticket
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Meus Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">#{ticket.id}</span>
                        <div className="flex space-x-1">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status === 'open' ? 'Aberto' : 
                             ticket.status === 'resolved' ? 'Resolvido' : ticket.status}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority === 'high' ? 'Alta' :
                             ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">Criado em {ticket.created}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contato Direto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">E-mail</p>
                  <p className="text-sm text-gray-600">suporte@converta.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-600">+55 11 99999-0000</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Horário de Atendimento</p>
                  <p className="text-sm text-gray-600">Segunda à Sexta<br />9h às 18h</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
