
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user: User) => {
    try {
      console.log('Criando/verificando perfil do usuário:', user.id);
      
      // Verifica se o usuário já existe na tabela users
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar usuário:', checkError);
        return;
      }

      // Se o usuário não existe, cria o registro
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || '',
            phone: user.user_metadata?.phone || null
          });

        if (insertError) {
          console.error('Erro ao criar perfil do usuário:', insertError);
        } else {
          console.log('Perfil do usuário criado com sucesso');
        }
      } else {
        console.log('Perfil do usuário já existe');
      }
    } catch (error) {
      console.error('Erro ao processar perfil do usuário:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao buscar sessão:', error);
        return;
      }
      
      if (session) {
        console.log('Atualizando dados do usuário:', session.user.id);
        setSession(session);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  useEffect(() => {
    console.log('Inicializando AuthProvider...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Usuário logado:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          // Criar perfil do usuário quando ele fizer login
          setTimeout(async () => {
            await createUserProfile(session.user);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('Usuário deslogado');
          setSession(null);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token renovado para:', session.user.email);
          setSession(session);
          setUser(session.user);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('Sessão inicial:', session?.user?.email || 'Nenhuma sessão');
      
      if (error) {
        console.error('Erro ao obter sessão inicial:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Se já tem uma sessão ativa, garante que o perfil existe
      if (session?.user) {
        setTimeout(async () => {
          await createUserProfile(session.user);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleanup AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Iniciando logout...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
        throw error;
      }
      
      // Limpa os estados após o logout bem-sucedido
      setSession(null);
      setUser(null);
      
      console.log('Logout realizado com sucesso');
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Se houver erro, ainda força a limpeza local
      setSession(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
