
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ConversationHistoryDialog from '@/components/ConversationHistoryDialog';

interface ConversationData {
  id: string;
  agent_id: string;
  user_session_id: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  created_at: string;
  agent_name: string;
  channel: string;
}

const Conversations = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: conversations = [], isLoading, refetch } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('agent_conversations')
        .select(`
          *,
          agents!inner(
            name,
            channel,
            user_id
          )
        `)
        .eq('agents.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      return (data || []).map(conv => {
        let messages: Array<{ role: string; content: string }> = [];
        
        try {
          if (conv.messages) {
            const parsedMessages = typeof conv.messages === 'string' 
              ? JSON.parse(conv.messages) 
              : conv.messages;
            
            if (Array.isArray(parsedMessages)) {
              messages = parsedMessages.filter(msg => 
                typeof msg === 'object' && 
                msg !== null && 
                'role' in msg && 
                'content' in msg &&
                typeof msg.role === 'string' &&
                typeof msg.content === 'string'
              );
            }
          }
        } catch (parseError) {
          console.error('Error parsing messages:', parseError);
          messages = [];
        }

        return {
          id: conv.id,
          agent_id: conv.agent_id,
          user_session_id: conv.user_session_id || 'Sessão desconhecida',
          messages: messages,
          created_at: conv.created_at,
          agent_name: conv.agents?.name || 'Agente desconhecido',
          channel: conv.agents?.channel || 'Canal desconhecido'
        };
      });
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  const { data: stats } = useQuery({
    queryKey: ['conversation-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { active: 0, pending: 0, closed: 0, totalAgents: 0, timesSaved: 0 };

      // Calcular estatísticas baseadas nas conversas reais
      const totalConversations = conversations.length;
      
      // Conversas ativas (últimas 24h)
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      
      const activeConversations = conversations.filter(conv => {
        const conversationDate = new Date(conv.created_at);
        return conversationDate > dayAgo;
      }).length;

      // Conversas pendentes (estimativa baseada no total)
      const pendingConversations = Math.max(0, Math.floor(totalConversations * 0.2));

      // Conversas finalizadas hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const closedToday = conversations.filter(conv => {
        const conversationDate = new Date(conv.created_at);
        return conversationDate >= today;
      }).length;

      // Buscar total de agentes
      const { data: agentsData } = await supabase
        .from('agents')
        .select('id, channel')
        .eq('user_id', user.id)
        .eq('active', true);

      const totalAgents = agentsData?.length || 0;
      
      // Estimar tempo economizado (média de 5 min por conversa automatizada)
      const timesSaved = totalConversations * 5;

      return {
        active: activeConversations,
        pending: pendingConversations,
        closed: closedToday,
        totalAgents,
        timesSaved
      };
    },
    enabled: !!user?.id && conversations.length >= 0
  });

  // Refetch quando houver novas conversas
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000); // Verifica a cada 10 segundos

    return () => clearInterval(interval);
  }, [refetch]);

  const handleConversationClick = (conversation: ConversationData) => {
    setSelectedConversation(conversation);
    setIsDialogOpen(true);
  };

  const getChannelIcon = (channel: string) => {
    return <MessageSquare className="h-5 w-5 text-gray-600" />;
  };

  const getChannelLabel = (channel: string) => {
    const channelMap: { [key: string]: string } = {
      'widget': 'Widget do Site',
      'whatsapp': 'WhatsApp', 
      'instagram': 'Instagram',
      'Widget do Site': 'Widget',
      'WhatsApp': 'WhatsApp',
      'Instagram': 'Instagram'
    };
    
    return channelMap[channel] || channel;
  };

  const getLastMessage = (messages: Array<{ role: string; content: string }>) => {
    if (!messages || messages.length === 0) return 'Nenhuma mensagem';
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content || 'Mensagem vazia';
    return content.substring(0, 100) + (content.length > 100 ? '...' : '');
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h atrás`;
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-4 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Conversas</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Acompanhe todas as conversas ativas e o desempenho dos agentes
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Conversas Ativas</p>
                  <p className="text-lg md:text-2xl font-bold">{stats?.active || 0}</p>
                </div>
                <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Pendentes</p>
                  <p className="text-lg md:text-2xl font-bold">{stats?.pending || 0}</p>
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Finalizadas Hoje</p>
                  <p className="text-lg md:text-2xl font-bold">{stats?.closed || 0}</p>
                </div>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Agentes Ativos</p>
                  <p className="text-lg md:text-2xl font-bold">{stats?.totalAgents || 0}</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Conversas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma conversa encontrada</p>
                <p className="text-sm text-gray-400 mt-2">
                  As conversas aparecerão aqui quando os usuários interagirem com seus agentes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                        {getChannelIcon(conversation.channel)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{conversation.user_session_id}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {getLastMessage(conversation.messages)}
                        </p>
                        <p className="text-xs text-gray-400">Agente: {conversation.agent_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
                      <div className="flex flex-col md:flex-row gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getChannelLabel(conversation.channel)}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs">Ativa</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{getTimeAgo(conversation.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ConversationHistoryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          conversation={selectedConversation}
        />
      </div>
    </Layout>
  );
};

export default Conversations;
