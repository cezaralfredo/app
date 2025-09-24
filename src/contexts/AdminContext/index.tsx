import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { adminService } from '../../services/admin';

interface AdminState {
  users: any[];
  analytics: any;
  content: any[];
  settings: any;
  reports: any[];
  loading: boolean;
  error: string | null;
  realTimeData: any;
}

interface AdminContextType extends AdminState {
  fetchUsers: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchContent: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchReports: () => Promise<void>;
  updateUser: (userId: string, data: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateSettings: (settings: any) => Promise<void>;
  startRealTimeMonitoring: () => void;
  stopRealTimeMonitoring: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: any[] }
  | { type: 'SET_ANALYTICS'; payload: any }
  | { type: 'SET_CONTENT'; payload: any[] }
  | { type: 'SET_SETTINGS'; payload: any }
  | { type: 'SET_REPORTS'; payload: any[] }
  | { type: 'SET_REAL_TIME_DATA'; payload: any }
  | { type: 'UPDATE_USER'; payload: { userId: string; data: any } }
  | { type: 'DELETE_USER'; payload: string };

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload, loading: false };
    case 'SET_CONTENT':
      return { ...state, content: action.payload, loading: false };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, loading: false };
    case 'SET_REPORTS':
      return { ...state, reports: action.payload, loading: false };
    case 'SET_REAL_TIME_DATA':
      return { ...state, realTimeData: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId ? { ...user, ...action.payload.data } : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    default:
      return state;
  }
};

const initialState: AdminState = {
  users: [],
  analytics: null,
  content: [],
  settings: null,
  reports: [],
  loading: false,
  error: null,
  realTimeData: null,
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const fetchUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const users = await adminService.getUsers();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar usuários' });
    }
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const analytics = await adminService.getAnalytics();
      dispatch({ type: 'SET_ANALYTICS', payload: analytics });
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar analytics' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchContent = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const content = await adminService.getContent();
      dispatch({ type: 'SET_CONTENT', payload: content });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar conteúdo' });
    }
  };

  const fetchSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const settings = await adminService.getSettings();
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar configurações' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchReports = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const reports = await adminService.getReports();
      dispatch({ type: 'SET_REPORTS', payload: reports });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar relatórios' });
    }
  };

  const updateUser = async (userId: string, data: any) => {
    try {
      await adminService.updateUser(userId, data);
      dispatch({ type: 'UPDATE_USER', payload: { userId, data } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar usuário' });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      dispatch({ type: 'DELETE_USER', payload: userId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar usuário' });
    }
  };

  const updateSettings = async (settings: any) => {
    try {
      await adminService.updateSettings(settings);
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar configurações' });
    }
  };

  const startRealTimeMonitoring = () => {
    // Iniciar monitoramento em tempo real com intervalo de 3 segundos
    const interval = setInterval(async () => {
      try {
        const realTimeData = await adminService.getRealTimeData();
        dispatch({ type: 'SET_REAL_TIME_DATA', payload: { ...realTimeData, monitoringInterval: interval } });
      } catch (error) {
        console.error('Erro no monitoramento em tempo real:', error);
      }
    }, 3000);

    // Armazenar o intervalo no estado para poder parar depois
    dispatch({ type: 'SET_REAL_TIME_DATA', payload: { monitoringInterval: interval } });
  };

  const stopRealTimeMonitoring = () => {
    // Parar monitoramento em tempo real
    if (state.realTimeData?.monitoringInterval) {
      clearInterval(state.realTimeData.monitoringInterval);
      dispatch({ type: 'SET_REAL_TIME_DATA', payload: null });
    }
  };

  useEffect(() => {
    // Carregar dados iniciais
    fetchAnalytics();
    fetchSettings();
  }, [fetchAnalytics, fetchSettings]);

  const contextValue: AdminContextType = {
    ...state,
    fetchUsers,
    fetchAnalytics,
    fetchContent,
    fetchSettings,
    fetchReports,
    updateUser,
    deleteUser,
    updateSettings,
    startRealTimeMonitoring,
    stopRealTimeMonitoring,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin deve ser usado dentro de um AdminProvider');
  }
  return context;
};