
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Users, 
  MessageSquare, 
  Settings, 
  User, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Crown,
  BookOpen,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Sidebar = () => {
  const location = useLocation();
  const [perfilExpanded, setPerfilExpanded] = useState(false);
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Agentes',
      icon: Bot,
      path: '/agents',
      color: 'text-purple-600'
    },
    {
      title: 'CRM',
      icon: Users,
      path: '/crm',
      color: 'text-green-600'
    },
    {
      title: 'Conversas',
      icon: MessageSquare,
      path: '/conversations',
      color: 'text-orange-600'
    },
    {
      title: 'Integrações',
      icon: Settings,
      path: '/integrations',
      color: 'text-indigo-600'
    }
  ];

  const perfilSubItems = [
    {
      title: 'Tutorial',
      icon: BookOpen,
      path: '/profile/tutorial'
    },
    {
      title: 'Assinatura',
      icon: Crown,
      path: '/profile/subscription'
    },
    {
      title: 'Dados da Conta',
      icon: CreditCard,
      path: '/profile/account'
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Converta+</h1>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-11 px-3 ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? item.color : ''}`} />
                {item.title}
              </Button>
            </Link>
          );
        })}

        <Separator className="my-4" />

        {/* Perfil with submenu */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setPerfilExpanded(!perfilExpanded)}
            className="w-full justify-between h-11 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <User className="mr-3 h-5 w-5" />
              Perfil
            </div>
            {perfilExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          
          {perfilExpanded && (
            <div className="ml-4 mt-2 space-y-1">
              {perfilSubItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start h-10 px-3 text-sm ${
                        isActive 
                          ? 'bg-gray-100 text-gray-900 font-medium' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Suporte */}
        <Link to="/support">
          <Button
            variant={isActivePath('/support') ? "secondary" : "ghost"}
            className={`w-full justify-start h-11 px-3 ${
              isActivePath('/support')
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Suporte
          </Button>
        </Link>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Usuário</p>
            <p className="text-xs text-gray-500">Plano Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
