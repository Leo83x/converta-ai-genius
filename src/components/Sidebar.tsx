

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  Bot,
  Users,
  MessageSquare,
  Settings,
  User,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Smartphone
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-500'
  },
  {
    title: 'Agentes',
    href: '/agents',
    icon: Bot,
    color: 'text-green-500'
  },
  {
    title: 'CRM',
    href: '/crm',
    icon: Users,
    color: 'text-orange-500'
  },
  {
    title: 'Conversas',
    href: '/conversations',
    icon: MessageSquare,
    color: 'text-purple-500'
  },
  {
    title: 'Integrações',
    href: '/integrations',
    icon: Settings,
    color: 'text-gray-500'
  },
  {
    title: 'WhatsApp (Venom)',
    href: '/venom-whatsapp',
    icon: Smartphone,
    color: 'text-emerald-500'
  },
  {
    title: 'Painel do Representante',
    href: '/affiliate-panel',
    icon: TrendingUp,
    color: 'text-pink-500'
  },
];

const profileItems = [
  {
    title: 'Tutorial',
    href: '/profile/tutorial',
  },
  {
    title: 'Assinatura',
    href: '/profile/subscription',
  },
  {
    title: 'Dados da Conta',
    href: '/profile/account',
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    
    try {
      console.log('Botão sair clicado');
      setIsLoggingOut(true);
      
      await signOut();
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Manter submenu aberto se estiver em alguma das páginas do perfil
  const shouldKeepProfileOpen = location.pathname.startsWith('/profile');

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-4">
        <Link to="/dashboard" className="flex items-center space-x-1" onClick={closeMobileMenu}>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center">
            <img 
              src="/lovable-uploads/ed994187-ef8e-434c-9a61-b934609ad228.png" 
              alt="Converta+" 
              className="h-8 w-8 mb-0.5"
            />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Converta+
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={closeMobileMenu}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                // Quebra de linha melhorada para mobile
                item.title === 'Painel do Representante' && isMobile 
                  ? 'whitespace-normal leading-tight' 
                  : 'whitespace-nowrap',
                isActive
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0', 
                isActive ? 'text-purple-600 dark:text-purple-400' : item.color
              )} />
              <span className={item.title === 'Painel do Representante' && isMobile ? 'text-xs' : ''}>{item.title}</span>
            </Link>
          );
        })}

        {/* Profile Section */}
        <div className="mt-6">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
              (profileExpanded || shouldKeepProfileOpen)
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                : ''
            )}
            onClick={() => setProfileExpanded(!profileExpanded)}
          >
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-indigo-500" />
              <span>Perfil</span>
            </div>
            {(profileExpanded || shouldKeepProfileOpen) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {(profileExpanded || shouldKeepProfileOpen) && (
            <div className="ml-8 mt-1 space-y-1">
              {profileItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Support */}
        <Link
          to="/support"
          onClick={closeMobileMenu}
          className={cn(
            'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            location.pathname === '/support'
              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          )}
        >
          <HelpCircle className="h-5 w-5 text-yellow-500" />
          <span>Suporte</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </Button>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeMobileMenu} />
            <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
