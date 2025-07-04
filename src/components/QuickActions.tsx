
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Criar Agente",
      description: "Configure um novo agente de IA",
      icon: "🤖",
      action: () => navigate('/agents/create'),
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Conectar WhatsApp",
      description: "Vincule seu número do WhatsApp",
      icon: "📱",
      action: () => navigate('/channels/whatsapp'),
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Ativar Instagram",
      description: "Conecte com suas redes sociais",
      icon: "📸",
      action: () => navigate('/channels/instagram'),
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Widget do Site",
      description: "Adicione chat ao seu site",
      icon: "💬",
      action: () => navigate('/channels/widget'),
      color: "from-purple-500 to-violet-500"
    }
  ];

  return (
    <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center space-y-3 hover:scale-105 transition-transform bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center text-white text-xl`}>
                {action.icon}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
