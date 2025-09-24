import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/supabase';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();
  const { signIn, isAdmin, resendConfirmation } = useAuth();

  const withTimeout = async <T,>(promise: Promise<T>, ms = 15000): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), ms);
    });
    try {
      const result = await Promise.race([promise, timeoutPromise]) as T;
      return result;
    } finally {
      clearTimeout(timeoutId!);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setInfoMessage('');

    try {
      console.info('[AdminAuthModal] Iniciando signIn');
      const t0 = performance.now?.() ?? Date.now();
      await signIn(email, password);
      const t1 = performance.now?.() ?? Date.now();
      console.info(`[AdminAuthModal] signIn concluído em ${(t1 - t0).toFixed(0)}ms`);

      await new Promise((r) => setTimeout(r, 250));

      console.info('[AdminAuthModal] Checando privilégios admin (com timeout 8s)');
      let admin = false;
      try {
        admin = await withTimeout(authService.isCurrentUserAdmin(), 8000);
      } catch (err: any) {
        if (err?.message === 'TIMEOUT') {
          console.warn('[AdminAuthModal] isCurrentUserAdmin timeout, usando isAdmin do contexto');
          admin = !!isAdmin;
        } else {
          throw err;
        }
      }
      console.info('[AdminAuthModal] Resultado admin:', { apiAdmin: admin, ctxIsAdmin: isAdmin });

      if (admin || isAdmin) {
        console.info('[AdminAuthModal] Acesso permitido, redirecionando para /admin');
        navigate('/admin');
        onClose();
        setEmail('');
        setPassword('');
      } else {
        console.warn('[AdminAuthModal] Acesso negado: conta sem privilégios administrativos');
        setError('Sua conta não possui privilégios administrativos.');
      }
    } catch (err: any) {
      const message: string = err?.message || 'Falha ao autenticar';
      console.error('[AdminAuthModal] Erro de autenticação:', message);
      if (message === 'EMAIL_NOT_CONFIRMED') {
        setError('E-mail não confirmado. Reenvie o e-mail de confirmação para continuar.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setInfoMessage('');
    onClose();
  };

  const handleResendConfirmation = async () => {
    try {
      setIsLoading(true);
      setInfoMessage('');
      const result = await resendConfirmation(email, password);
      setInfoMessage(result?.detail || 'E-mail de confirmação reenviado.');
    } catch (e: any) {
      setError(e?.message || 'Não foi possível reenviar a confirmação.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Acesso Administrativo
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email do administrador
                      </label>
                      <input
                        type="email"
                        id="admin-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="email@dominio.com"
                        required
                        autoFocus
                        autoComplete="email"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Senha
                      </label>
                      <input
                        type="password"
                        id="admin-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Senha"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                        {error.includes('E-mail não confirmado') && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={handleResendConfirmation}
                              className="text-sm text-primary-700 hover:text-primary-800 underline disabled:opacity-50"
                              disabled={isLoading || !email}
                            >
                              Reenviar e-mail de confirmação
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {infoMessage && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-700">{infoMessage}</p>
                      </div>
                    )}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={isLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Verificando...' : 'Acessar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthModal;