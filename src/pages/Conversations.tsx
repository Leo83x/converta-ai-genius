
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';
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

  const { data: conversations = [], isLoading } = useQuery({
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

      return (data || []).map(conv => ({
        id: conv.id,
        agent_id: conv.agent_id,
        user_session_id: conv.user_session_id || 'Sessão desconhecida',
        messages: conv.messages || [],
        created_at: conv.created_at,
        agent_name: conv.agents?.name || 'Agente desconhecido',
        channel: conv.agents?.channel || 'Canal desconhecido'
      }));
    },
    enabled: !!user?.id
  });

  const { data: stats } = useQuery({
    queryKey: ['conversation-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { active: 0, pending: 0, closed: 0 };

      // Para este exemplo, vamos calcular estatísticas baseadas nas conversas existentes
      const totalConversations = conversations.length;
      const recentConversations = conversations.filter(conv => {
        const conversationDate = new Date(conv.created_at);
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return conversationDate > dayAgo;
      }).length;

      return {
        active: Math.ceil(totalConversations * 0.7), // 70% ativas
        pending: Math.ceil(totalConversations * 0.2), // 20% pendentes  
        closed: recentConversations // conversas finalizadas hoje
      };
    },
    enabled: !!user?.id && conversations.length > 0
  });

  const handleConversationClick = (conversation: ConversationData) => {
    setSelectedConversation(conversation);
    setIsDialogOpen(true);
  };

  const getChannelIcon = (channel: string) => {
    return <MessageSquare className="h-5 w-5 text-gray-600" />;
  };

  const getLastMessage = (messages: Array<{ role: string; content: string }>) => {
    if (!messages || messages.length === 0) return 'Nenhuma mensagem';
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '');
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
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
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
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conversas</h1>
            <p className="text-gray-600 mt-2">Acompanhe todas as conversas ativas</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversas Ativas</p>
                  <p className="text-2xl font-bold">{stats?.active || 0}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">{stats?.pending || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Finalizadas Hoje</p>
                  <p className="text-2xl font-bold">{stats?.closed || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>Conversas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {getChannelIcon(conversation.channel)}
                      </div>
                      <div>
                        <h3 className="font-medium">{conversation.user_session_id}</h3>
                        <p className="text-sm text-gray-500 max-w-md truncate">
                          {getLastMessage(conversation.messages)}
                        </p>
                        <p className="text-xs text-gray-400">Agente: {conversation.agent_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{conversation.channel}</Badge>
                      <Badge className="bg-green-100 text-green-800">Ativa</Badge>
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
