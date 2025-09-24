import React, { useEffect } from 'react';
import { 
  UsersIcon, 
  TruckIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../../contexts/AdminContext';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change?: number;
  changeType?: 'increase' | 'decrease';
  description?: string;
}> = ({ title, value, icon: Icon, change, changeType, description }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {changeType === 'increase' ? (
                    <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                  )}
                  {change}%
                </div>
              )}
            </dd>
            {description && (
              <dd className="mt-1 text-sm text-gray-400">
                {description}
              </dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const DashboardOverview: React.FC = () => {
  const { analytics, fetchAnalytics, loading } = useAdmin();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = analytics || {
    totalUsers: 0,
    activeUsers: 0,
    totalProviders: 0,
    totalEquipment: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    userGrowth: 0,
    revenueGrowth: 0,
  };

  return (
    <div className="py-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="mt-1 text-sm text-gray-500">
          Estatísticas e métricas do sistema
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers.toLocaleString('pt-BR')}
          icon={UsersIcon}
          change={stats.userGrowth}
          changeType={stats.userGrowth >= 0 ? 'increase' : 'decrease'}
          description="Crescimento mensal"
        />
        
        <StatCard
          title="Prestadores Ativos"
          value={stats.totalProviders.toLocaleString('pt-BR')}
          icon={TruckIcon}
          description="Prestadores verificados"
        />
        
        <StatCard
          title="Equipamentos"
          value={stats.totalEquipment.toLocaleString('pt-BR')}
          icon={TruckIcon}
          description="Total cadastrado"
        />
        
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={CurrencyDollarIcon}
          change={stats.revenueGrowth}
          changeType={stats.revenueGrowth >= 0 ? 'increase' : 'decrease'}
          description="Crescimento mensal"
        />
      </div>

      {/* Additional metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Receita Mensal"
          value={`R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={CurrencyDollarIcon}
          description="Últimos 30 dias"
        />
        
        <StatCard
          title="Usuários Ativos"
          value={stats.activeUsers.toLocaleString('pt-BR')}
          icon={UsersIcon}
          description="Últimos 30 dias"
        />
        
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.conversionRate || 0}%`}
          icon={ChartBarIcon}
          description="Visitas para aluguéis"
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Ver Usuários
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Gerar Relatório
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Configurações
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
            Monitoramento
          </button>
        </div>
      </div>

      {/* System status */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Status do Sistema</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
            <span className="text-sm text-gray-600">API Online</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
            <span className="text-sm text-gray-600">Database Online</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
            <span className="text-sm text-gray-600">Cache Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;