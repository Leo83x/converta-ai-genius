
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, User, Bot, Clock } from "lucide-react";

interface ConversationHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: {
    id: string;
    agent_name: string;
    user_session_id: string;
    messages: Array<{
      role: string;
      content: string;
    }>;
    created_at: string;
  } | null;
}

const ConversationHistoryDialog = ({ isOpen, onClose, conversation }: ConversationHistoryDialogProps) => {
  if (!conversation) return null;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Histórico da Conversa - {conversation.agent_name}
          </DialogTitle>
          <div className="flex gap-2 text-sm text-gray-500">
            <span>Sessão: {conversation.user_session_id}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(conversation.created_at)}
            </span>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] w-full pr-4">
          <div className="space-y-4">
            {conversation.messages && conversation.messages.length > 0 ? (
              conversation.messages.map((message, index) => (
                <Card key={index} className={`${
                  message.role === 'user' ? 'ml-8 bg-blue-50 border-blue-200' : 
                  message.role === 'assistant' ? 'mr-8 bg-gray-50 border-gray-200' : 
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-blue-600" />
                        ) : message.role === 'assistant' ? (
                          <Bot className="h-5 w-5 text-gray-600" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {message.role === 'user' ? 'Usuário' : 
                             message.role === 'assistant' ? 'Assistente' : 
                             'Sistema'}
                          </Badge>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content || 'Mensagem vazia'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma mensagem encontrada nesta conversa</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationHistoryDialog;
