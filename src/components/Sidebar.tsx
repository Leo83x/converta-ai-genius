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
  X
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Agentes',
    href: '/agents',
    icon: Bot,
  },
  {
    title: 'CRM',
    href: '/crm',
    icon: Users,
  },
  {
    title: 'Conversas',
    href: '/conversations',
    icon: MessageSquare,
  },
  {
    title: 'Integrações',
    href: '/integrations',
    icon: Settings,
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

  const handleSignOut = async () => {
    try {
      console.log('Botão sair clicado');
      await signOut();
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Redireciona para a página de login
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeMobileMenu}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-green-600"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
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
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* Profile Section */}
        <div className="mt-6">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-between px-3 py-2 text-sm font-medium',
              profileExpanded || location.pathname.startsWith('/profile')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => setProfileExpanded(!profileExpanded)}
          >
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5" />
              <span>Perfil</span>
            </div>
            {profileExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {profileExpanded && (
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
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <HelpCircle className="h-5 w-5" />
          <span>Suporte</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="border-t px-3 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button - Fixed position */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white shadow-md border"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeMobileMenu} />
            <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
