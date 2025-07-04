
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
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suporte</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Encontre ajuda e entre em contato conosco</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Help */}
          <div className="lg:col-span-2 space-y-6">
            {/* Support Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Book className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Documentação</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Guias completos e tutoriais</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Vídeo Tutoriais</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aprenda assistindo</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Chat ao Vivo</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Suporte em tempo real</p>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-white">{item.question}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Mail className="mr-2 h-5 w-5" />
                  Abrir Ticket de Suporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">Assunto</Label>
                    <Input 
                      id="subject" 
                      placeholder="Descreva brevemente o problema"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Prioridade</Label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva o problema em detalhes..."
                    rows={5}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white">
                  Enviar Ticket
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Tickets */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Clock className="mr-2 h-5 w-5" />
                  Meus Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">#{ticket.id}</span>
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
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{ticket.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Criado em {ticket.created}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Contato Direto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">E-mail</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">suporte@converta.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+55 11 99999-0000</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Horário de Atendimento</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Segunda à Sexta<br />9h às 18h</p>
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
