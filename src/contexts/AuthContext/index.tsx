import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '../../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: 'client' | 'provider') => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string, passwordFallback?: string) => Promise<{ status: string; detail: string }>;
  isAdmin: boolean;
  emailNotConfirmed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const refreshAdmin = async () => {
      try {
        const admin = await authService.isCurrentUserAdmin();
        setIsAdmin(!!admin);
      } catch {
        setIsAdmin(false);
      }
    };

    // Verificar se há usuário logado ao carregar
    const getCurrentUser = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setError(null);
        if (currentUser) {
          await refreshAdmin();
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar usuário');
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setError(null);
          // Garante bootstrap do admin designado e atualiza isAdmin
          await authService.ensureDesignatedAdminBootstrap();
          await refreshAdmin();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      setEmailNotConfirmed(false);
      const { user: authUser } = await authService.signIn(email, password);
      setUser(authUser);
      await authService.ensureDesignatedAdminBootstrap();
      const admin = await authService.isCurrentUserAdmin();
      setIsAdmin(!!admin);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      setIsAdmin(false);
      
      // Verifica se é erro de email não confirmado
      if (errorMessage === 'EMAIL_NOT_CONFIRMED') {
        setEmailNotConfirmed(true);
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userType: 'client' | 'provider') => {
    try {
      setLoading(true);
      setError(null);
      const { user: authUser } = await authService.signUp(email, password, userType);
      setUser(authUser);
      await authService.ensureDesignatedAdminBootstrap();
      const admin = await authService.isCurrentUserAdmin();
      setIsAdmin(!!admin);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(errorMessage);
      setIsAdmin(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
      setIsAdmin(false);
      setEmailNotConfirmed(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async (email: string, passwordFallback?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.resendConfirmation(email, passwordFallback);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reenviar confirmação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
    isAdmin,
    emailNotConfirmed,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Componente de proteção de rotas
export const ProtectedRoute: React.FC<{
  children: ReactNode;
  adminOnly?: boolean;
  fallback?: React.ReactElement | null;
}> = ({ children, adminOnly = false, fallback = null }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Para rotas administrativas, priorizamos a verificação de isAdmin
  if (adminOnly) {
    if (!isAdmin) {
      return fallback ?? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso restrito</h2>
            <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta área.</p>
            <a href="/" className="btn-primary">Voltar ao Início</a>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Para rotas não administrativas, exigir usuário logado normalmente
  if (!user) {
    return fallback ?? (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso não autorizado</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
          <a href="/login" className="btn-primary">Fazer Login</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};