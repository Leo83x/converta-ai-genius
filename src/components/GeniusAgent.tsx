
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Upload, BarChart3, TrendingUp, Lightbulb } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
}

interface GeniusAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeniusAgent = ({ isOpen, onClose }: GeniusAgentProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá! Sou o Genius, seu assistente inteligente especializado em otimização de campanhas e agentes de IA. Posso analisar suas métricas, sugerir melhorias e ajudar a otimizar todo seu funil de conversão. Como posso ajudar hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const predefinedQuestions = [
    {
      icon: <BarChart3 className="h-4 w-4" />,
      text: "Analisar métricas dos meus agentes",
      message: "Pode analisar as métricas de performance dos meus agentes e sugerir melhorias?"
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: "Otimizar taxa de conversão",
      message: "Como posso melhorar a taxa de conversão dos meus leads?"
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      text: "Sugestões de prompts",
      message: "Pode sugerir melhorias nos prompts dos meus agentes de IA?"
    }
  ];

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: messageToSend
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with more contextual responses
    setTimeout(() => {
      let responseContent = '';
      
      if (messageToSend.toLowerCase().includes('métrica') || messageToSend.toLowerCase().includes('performance')) {
        responseContent = 'Analisando suas métricas... Com base nos dados do seu dashboard, vejo que você tem 0 leads ativos. Recomendo:\n\n1. **Ativar mais canais**: Configure WhatsApp e Instagram para aumentar pontos de contato\n2. **Otimizar prompts**: Ajustar a linguagem dos agentes para ser mais envolvente\n3. **Definir CTAs**: Criar chamadas para ação mais diretas\n\nGostaria que eu detalhe alguma dessas estratégias?';
      } else if (messageToSend.toLowerCase().includes('conversão') || messageToSend.toLowerCase().includes('taxa')) {
        responseContent = 'Para melhorar sua taxa de conversão, sugiro:\n\n📈 **Estratégias principais:**\n• Implementar qualificação automática de leads\n• Criar fluxos de nurturing personalizados\n• Usar gatilhos mentais nos prompts\n• Configurar follow-ups automáticos\n\n💡 **Dica importante:** Leads que recebem resposta em até 5 minutos têm 21x mais chance de conversão. Seus agentes já fazem isso automaticamente!';
      } else if (messageToSend.toLowerCase().includes('prompt')) {
        responseContent = 'Vou sugerir melhorias para seus prompts:\n\n✨ **Estrutura ideal:**\n1. **Saudação personalizada** com o nome do lead\n2. **Identificação clara** do valor oferecido\n3. **Perguntas qualificadoras** estratégicas\n4. **CTA específica** para próximo passo\n\n📝 **Exemplo otimizado:**\n"Olá [nome]! Vi seu interesse em [produto/serviço]. Para personalizar a melhor solução, me conta: qual seu maior desafio hoje com [área específica]?"\n\nQuer que eu ajude a reescrever algum prompt específico?';
      } else if (messageToSend.toLowerCase().includes('campanha') || messageToSend.toLowerCase().includes('analisar')) {
        responseContent = 'Perfeito! Para analisar campanhas externas, você pode:\n\n📤 **Enviar prints ou dados de:**\n• Facebook/Instagram Ads\n• Google Ads\n• WhatsApp Business\n• E-mail marketing\n• Landing pages\n\n🔍 **Vou analisar:**\n• CTR e taxa de conversão\n• Qualidade do copy\n• Segmentação de público\n• Funil de conversão\n• Oportunidades de melhoria\n\nEnvie os prints ou dados que você quer que eu analise!';
      } else {
        responseContent = 'Entendi! Com base na sua pergunta, posso ajudar você a:\n\n🎯 **Otimizar agentes**: Melhorar prompts e fluxos de conversa\n📊 **Analisar métricas**: Identificar gargalos e oportunidades\n🚀 **Aumentar conversões**: Estratégias para melhorar resultados\n💡 **Insights personalizados**: Baseados no seu negócio específico\n\nQual dessas áreas você gostaria de focar primeiro? Ou tem alguma campanha/métrica específica que quer analisar?';
      }

      const response: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: responseContent
      };
      
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "Upload de arquivos",
      description: "Funcionalidade em desenvolvimento. Em breve você poderá enviar prints de campanhas!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">✨</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-xl font-bold">
              Genius AI
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              Assistente de Otimização
            </span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Ações rápidas:</span>
          {predefinedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(question.message)}
              className="text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900"
            >
              {question.icon}
              <span className="ml-1">{question.text}</span>
            </Button>
          ))}
        </div>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFileUpload}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta ou descreva o que precisa analisar..."
            className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Enviar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeniusAgent;
