
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Instagram, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Criar Agente',
      description: 'Configure um novo agente de IA',
      icon: Plus,
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/agents/create'),
    },
    {
      title: 'Conectar WhatsApp',
      description: 'Vincule seu número do WhatsApp',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/integrations'),
    },
    {
      title: 'Ativar Instagram',
      description: 'Conecte com suas redes sociais',
      icon: Instagram,
      color: 'from-pink-500 to-rose-500',
      onClick: () => navigate('/integrations'),
    },
    {
      title: 'Widget do Site',
      description: 'Adicione chat ao seu site',
      icon: Globe,
      color: 'from-purple-500 to-violet-500',
      onClick: () => navigate('/integrations'),
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex flex-col items-center p-6 text-center space-y-3 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={action.onClick}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
