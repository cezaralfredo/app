import React, { useState } from 'react';
import { 
  ArrowDownTrayIcon, 
  CalendarIcon, 
  FunnelIcon,
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../../contexts/AdminContext';
import FinancialReports from './FinancialReports';
import UserReports from './UserReports';

interface ReportFilter {
  startDate: string;
  endDate: string;
  reportType: 'financial' | 'users' | 'equipment' | 'providers' | 'all';
  format: 'csv' | 'pdf' | 'excel';
}

const ReportsDashboard: React.FC = () => {
  const { analytics } = useAdmin();
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reportType: 'all',
    format: 'csv'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'financial', name: 'Financeiro', icon: CurrencyDollarIcon, color: 'text-green-600' },
    { id: 'users', name: 'Usuários', icon: UsersIcon, color: 'text-blue-600' },
    { id: 'equipment', name: 'Equipamentos', icon: TruckIcon, color: 'text-orange-600' },
    { id: 'providers', name: 'Prestadores', icon: UsersIcon, color: 'text-purple-600' },
    { id: 'all', name: 'Completo', icon: ChartBarIcon, color: 'text-gray-600' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar link de download simulado
      const blob = new Blob(['Relatório gerado com sucesso'], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio-${filters.reportType}-${new Date().toISOString().split('T')[0]}.${filters.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Relatório gerado e baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleReport = () => {
    alert('Funcionalidade de agendamento será implementada em breve!');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gere relatórios detalhados do seu marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filtros do Relatório</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Data Inicial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Data Final */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tipo de Relatório */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relatório
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters({ ...filters, reportType: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formato
            </label>
            <select
              value={filters.format}
              onChange={(e) => setFilters({ ...filters, format: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tipos de Relatório */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-all hover:shadow-md ${
                filters.reportType === type.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setFilters({ ...filters, reportType: type.id as any })}
            >
              <div className="flex items-center">
                <Icon className={`h-8 w-8 ${type.color}`} />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                  <p className="text-xs text-gray-500">
                    {type.id === 'all' ? 'Relatório completo' : `Relatório de ${type.name.toLowerCase()}`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ações */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gerar Relatório</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
          </button>
          
          <button
            onClick={handleScheduleReport}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Agendar Relatório
          </button>
          
          <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            <ClockIcon className="h-5 w-5 mr-2" />
            Relatórios Agendados
          </button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas do Período</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics?.totalUsers || 0}
            </div>
            <div className="text-sm text-gray-600">Usuários</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              R$ {(analytics?.totalRevenue || 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Receita</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics?.totalEquipment || 0}
            </div>
            <div className="text-sm text-gray-600">Equipamentos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics?.totalProviders || 0}
            </div>
            <div className="text-sm text-gray-600">Prestadores</div>
          </div>
        </div>
      </div>

      {/* Relatórios Específicos */}
      <div className="mt-8">
        {filters.reportType === 'financial' && (
          <FinancialReports data={analytics} filters={filters} />
        )}
        
        {filters.reportType === 'users' && (
          <UserReports data={analytics} filters={filters} />
        )}
        
        {(filters.reportType === 'equipment' || filters.reportType === 'providers' || filters.reportType === 'all') && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Relatório {filters.reportType === 'equipment' ? 'de Equipamentos' : 
                         filters.reportType === 'providers' ? 'de Prestadores' : 'Completo'}
              </h3>
              <p className="text-gray-500 mb-4">
                Esta funcionalidade será implementada em breve.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Solicitar Desenvolvimento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;
export { ReportsDashboard as Reports };