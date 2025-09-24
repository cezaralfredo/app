import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  TruckIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  ServerIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../../contexts/AdminContext';

const MonitoringDashboard: React.FC = () => {
  const { realTimeData, startRealTimeMonitoring, stopRealTimeMonitoring } = useAdmin();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'system'>('overview');

  useEffect(() => {
    // Iniciar monitoramento automaticamente
    startRealTimeMonitoring();
    setIsMonitoring(true);

    return () => {
      stopRealTimeMonitoring();
      setIsMonitoring(false);
    };
  }, [startRealTimeMonitoring, stopRealTimeMonitoring]);

  const data = realTimeData || {
    onlineUsers: 0,
    activeRentals: 0,
    pendingApprovals: 0,
    systemLoad: 0,
    databaseQueries: 0,
    errorRate: 0,
    responseTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    timestamp: new Date().toISOString()
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number; critical: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number; critical: number }) => {
    if (value <= thresholds.good) return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (value <= thresholds.warning) return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monitoramento em Tempo Real</h1>
            <p className="mt-1 text-sm text-gray-500">
              Acompanhe o desempenho do sistema em tempo real
              {data.timestamp && (
                <span className="ml-2 text-xs text-gray-400">
                  Última atualização: {new Date(data.timestamp).toLocaleString('pt-BR')}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${isMonitoring ? 'bg-green-400' : 'bg-gray-400'} mr-2`} />
              <span className="text-sm text-gray-600">
                {isMonitoring ? 'Monitorando' : 'Pausado'}
              </span>
            </div>
            
            <button
              onClick={() => {
                if (isMonitoring) {
                  stopRealTimeMonitoring();
                  setIsMonitoring(false);
                } else {
                  startRealTimeMonitoring();
                  setIsMonitoring(true);
                }
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                isMonitoring 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isMonitoring ? 'Parar' : 'Iniciar'}
            </button>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <div className="flex space-x-4">
          {[
            { id: 'overview', label: 'Visão Geral', icon: ChartBarIcon },
            { id: 'performance', label: 'Desempenho', icon: ArrowTrendingUpIcon },
            { id: 'system', label: 'Sistema', icon: ServerIcon }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === view.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <view.icon className="h-4 w-4 mr-2" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 gap-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Online Users */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Usuários Online
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {data.onlineUsers}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span className="ml-1">+12%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Active Rentals */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TruckIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aluguéis Ativos
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {data.activeRentals}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span className="ml-1">+8%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aprovações Pendentes
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {data.pendingApprovals}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                        <ArrowTrendingDownIcon className="h-4 w-4" />
                        <span className="ml-1">-3%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Database Queries */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ServerIcon className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Queries/min
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {data.databaseQueries}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span className="ml-1">+15%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                {getStatusIcon(data.systemLoad, { good: 30, warning: 70, critical: 90 })}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">CPU</p>
                  <p className={`text-sm ${getStatusColor(data.systemLoad, { good: 30, warning: 70, critical: 90 })}`}>
                    {data.systemLoad}%
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {getStatusIcon(data.memoryUsage, { good: 50, warning: 80, critical: 95 })}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Memória</p>
                  <p className={`text-sm ${getStatusColor(data.memoryUsage, { good: 50, warning: 80, critical: 95 })}`}>
                    {data.memoryUsage}%
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {getStatusIcon(data.errorRate, { good: 0.1, warning: 1, critical: 5 })}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Taxa de Erro</p>
                  <p className={`text-sm ${getStatusColor(data.errorRate, { good: 0.1, warning: 1, critical: 5 })}`}>
                    {data.errorRate}%
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {getStatusIcon(data.responseTime, { good: 100, warning: 300, critical: 500 })}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Tempo de Resposta</p>
                  <p className={`text-sm ${getStatusColor(data.responseTime, { good: 100, warning: 300, critical: 500 })}`}>
                    {data.responseTime}ms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance View */}
      {selectedView === 'performance' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Desempenho</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Utilização de Recursos</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU</span>
                      <span className="font-medium">{data.systemLoad}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${data.systemLoad}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Memória</span>
                      <span className="font-medium">{data.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{ width: `${data.memoryUsage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Estatísticas de Rede</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Queries/min</span>
                    <span className="font-medium">{data.databaseQueries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tempo de Resposta</span>
                    <span className="font-medium">{data.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Erro</span>
                    <span className="font-medium">{data.errorRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System View */}
      {selectedView === 'system' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Status dos Serviços</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Principal</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Banco de Dados</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notificações</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Estatísticas</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">99.98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Usuários Ativos</span>
                    <span className="font-medium">{data.onlineUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Aluguéis Ativos</span>
                    <span className="font-medium">{data.activeRentals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Requisições/min</span>
                    <span className="font-medium">1,234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Gerar Relatório
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Backup Agora
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
            Limpar Cache
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
            Reiniciar Serviços
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;