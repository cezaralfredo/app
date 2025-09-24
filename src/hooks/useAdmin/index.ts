import { useState, useCallback } from 'react';
import { adminService } from '../../services/admin';

export const useAdminOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOperation = async (operation: () => Promise<any>, successMessage?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      if (successMessage) {
        console.log(successMessage);
        // Aqui você pode adicionar notificações toast
      }
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro na operação administrativa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Operações de Usuário
  const fetchUsers = useCallback(() => 
    handleOperation(() => adminService.getUsers()), []);

  const updateUser = useCallback((userId: string, data: any) => 
    handleOperation(() => adminService.updateUser(userId, data), 'Usuário atualizado com sucesso'), []);

  const deleteUser = useCallback((userId: string) => 
    handleOperation(() => adminService.deleteUser(userId), 'Usuário deletado com sucesso'), []);

  // Operações de Analytics
  const fetchAnalytics = useCallback(() => 
    handleOperation(() => adminService.getAnalytics()), []);

  // Operações de Conteúdo
  const fetchContent = useCallback(() => 
    handleOperation(() => adminService.getContent()), []);

  const updateContent = useCallback((contentId: string, data: any) => 
    handleOperation(() => adminService.updateContent(contentId, data), 'Conteúdo atualizado com sucesso'), []);

  const deleteContent = useCallback((contentId: string) => 
    handleOperation(() => adminService.deleteContent(contentId), 'Conteúdo deletado com sucesso'), []);

  // Operações de Configurações
  const fetchSettings = useCallback(() => 
    handleOperation(() => adminService.getSettings()), []);

  const updateSettings = useCallback((settings: any) => 
    handleOperation(() => adminService.updateSettings(settings), 'Configurações atualizadas com sucesso'), []);

  // Operações de Relatórios
  const fetchReports = useCallback(() => 
    handleOperation(() => adminService.getReports()), []);

  const generateReport = useCallback((type: string, params: any) => 
    handleOperation(() => adminService.generateReport(type, params), 'Relatório gerado com sucesso'), []);

  // Operações de Monitoramento
  const getRealTimeData = useCallback(() => 
    handleOperation(() => adminService.getRealTimeData()), []);

  // Operações de Manutenção
  const createBackup = useCallback(() => 
    handleOperation(() => adminService.createBackup(), 'Backup criado com sucesso'), []);

  const restoreBackup = useCallback((backupId: string) => 
    handleOperation(() => adminService.restoreBackup(backupId), 'Backup restaurado com sucesso'), []);

  const clearCache = useCallback(() => 
    handleOperation(() => adminService.clearCache(), 'Cache limpo com sucesso'), []);

  const runMaintenance = useCallback(() => 
    handleOperation(() => adminService.runMaintenance(), 'Manutenção executada com sucesso'), []);

  return {
    loading,
    error,
    clearError: () => setError(null),
    
    // Operações
    fetchUsers,
    updateUser,
    deleteUser,
    fetchAnalytics,
    fetchContent,
    updateContent,
    deleteContent,
    fetchSettings,
    updateSettings,
    fetchReports,
    generateReport,
    getRealTimeData,
    createBackup,
    restoreBackup,
    clearCache,
    runMaintenance,
  };
};

export const useAdminStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshStats = useCallback(async () => {
    setLoading(true);
    try {
      const analytics = await adminService.getAnalytics();
      setStats(analytics);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    refreshStats,
  };
};

export const useAdminRealTime = () => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = useCallback(async () => {
    setIsMonitoring(true);
    // Implementar lógica de monitoramento em tempo real
    const interval = setInterval(async () => {
      try {
        const data = await adminService.getRealTimeData();
        setRealTimeData(data);
      } catch (error) {
        console.error('Erro no monitoramento em tempo real:', error);
      }
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  return {
    realTimeData,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  };
};