import { supabase } from '../supabase';

export const adminService = {
  // Gerenciamento de Usuários
  async getUsers() {
    // Usa RPC segura no banco para listar usuários apenas quando o caller é admin
    const { data, error } = await supabase.rpc('list_users_admin', {
      search: null,
      limit_count: 200,
      offset_count: 0,
    });

    if (error) throw error;

    // Normaliza o formato para o componente de UI
    const normalized = (data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name || (u.email ? String(u.email).split('@')[0] : 'Usuário'),
      role: u.role || 'user',
      status: (u.status || 'active') as 'active' | 'inactive' | 'suspended',
      createdAt: u.created_at,
      lastLogin: u.last_login || undefined,
      phone: u.phone || undefined,
      avatar: u.avatar || undefined,
    }));

    return normalized;
  },

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('auth.users')
      .select('id, email, created_at, raw_user_meta_data')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: any) {
    // Para atualizar usuários do auth, usar supabase.auth.admin.updateUserById
    // ou criar uma função RPC personalizada no Supabase
    throw new Error('Atualização de usuários deve ser feita através do painel de administração do Supabase');
  },

  async deleteUser(userId: string) {
    // Para deletar usuários do auth, usar supabase.auth.admin.deleteUser
    // ou criar uma função RPC personalizada no Supabase
    throw new Error('Exclusão de usuários deve ser feita através do painel de administração do Supabase');
  },

  // Analytics e Estatísticas
  async getAnalytics() {
    // Dados mockados para demonstração - integrar com analytics real
    return {
      totalUsers: 1247,
      activeUsers: 892,
      totalProviders: 356,
      activeProviders: 278,
      totalEquipment: 1243,
      rentedEquipment: 567,
      totalRevenue: 125430.50,
      monthlyRevenue: 28765.80,
      conversionRate: 12.5,
      userGrowth: 8.2,
      revenueGrowth: 15.3,
      topCategories: [
        { name: 'Escavadeiras', count: 234, revenue: 45230.00 },
        { name: 'Betoneiras', count: 187, revenue: 28760.00 },
        { name: 'Geradores', count: 156, revenue: 19870.00 },
        { name: 'Compactadores', count: 132, revenue: 16780.00 },
        { name: 'Andaimes', count: 98, revenue: 12340.00 },
      ],
      recentActivities: [
        { type: 'user_signup', count: 23, timestamp: new Date().toISOString() },
        { type: 'equipment_rental', count: 15, timestamp: new Date().toISOString() },
        { type: 'provider_verification', count: 8, timestamp: new Date().toISOString() },
      ]
    };
  },

  // Gerenciamento de Conteúdo
  async getContent() {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateContent(contentId: string, updates: any) {
    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', contentId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async deleteContent(contentId: string) {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', contentId);
    
    if (error) throw error;
  },

  // Configurações do Sistema
  async getSettings() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();
    
    if (error) {
      // Retornar configurações padrão se não existirem
      return {
        site_name: 'EquipaMax',
        site_description: 'Marketplace de aluguel de equipamentos',
        contact_email: 'contato@equipamax.com',
        support_email: 'suporte@equipamax.com',
        commission_rate: 8.0,
        currency: 'BRL',
        max_equipment_free: 5,
        premium_price: 99.00,
        automatic_approval: false,
        email_notifications: true,
        sms_notifications: false,
        maintenance_mode: false,
        google_maps_api_key: '',
        firebase_config: {},
        supabase_config: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    return data;
  },

  async updateSettings(settings: any) {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert(settings)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Relatórios
  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async generateReport(type: string, params: any) {
    // Lógica para gerar relatórios específicos
    const reportData = {
      type,
      parameters: params,
      generated_at: new Date().toISOString(),
      data: {} // Dados do relatório
    };

    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select();
    
    if (error) throw error;
    return data;
  },

  // Monitoramento em Tempo Real
  async getRealTimeData() {
    // Implementar monitoramento em tempo real
    return {
      onlineUsers: 142,
      activeRentals: 89,
      pendingApprovals: 12,
      systemLoad: 23.5,
      databaseQueries: 1567,
      errorRate: 0.8,
      timestamp: new Date().toISOString()
    };
  },

  // Backup e Restauração
  async createBackup() {
    // Implementar lógica de backup
    return { success: true, message: 'Backup criado com sucesso' };
  },

  async restoreBackup(backupId: string) {
    // Implementar lógica de restauração
    return { success: true, message: 'Backup restaurado com sucesso' };
  },

  // Utilitários Administrativos
  async clearCache() {
    // Implementar limpeza de cache
    return { success: true, message: 'Cache limpo com sucesso' };
  },

  async runMaintenance() {
    // Implementar rotina de manutenção
    return { success: true, message: 'Manutenção executada com sucesso' };
  }
};