import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  UsersIcon, 
  UserPlusIcon, 
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface UserReportProps {
  data: any;
  filters: any;
}

const UserReports: React.FC<UserReportProps> = ({ data, filters }) => {
  const [selectedMetric, setSelectedMetric] = useState('newUsers');

  // Dados de exemplo para demonstração
  const userData = [
    { month: 'Jan', newUsers: 120, activeUsers: 850, totalUsers: 1200, churnRate: 8.2 },
    { month: 'Fev', newUsers: 150, activeUsers: 920, totalUsers: 1350, churnRate: 7.5 },
    { month: 'Mar', newUsers: 130, activeUsers: 980, totalUsers: 1480, churnRate: 6.8 },
    { month: 'Abr', newUsers: 160, activeUsers: 1050, totalUsers: 1640, churnRate: 6.2 },
    { month: 'Mai', newUsers: 140, activeUsers: 1120, totalUsers: 1780, churnRate: 5.9 },
    { month: 'Jun', newUsers: 180, activeUsers: 1200, totalUsers: 1960, churnRate: 5.4 },
  ];

  const userTypeData = [
    { name: 'Clientes', value: 1560, color: '#0088FE' },
    { name: 'Prestadores', value: 356, color: '#00C49F' },
    { name: 'Administradores', value: 12, color: '#FFBB28' },
  ];

  const metrics = [
    { id: 'newUsers', name: 'Novos Usuários', color: '#10B981' },
    { id: 'activeUsers', name: 'Usuários Ativos', color: '#3B82F6' },
    { id: 'totalUsers', name: 'Total de Usuários', color: '#8B5CF6' },
    { id: 'churnRate', name: 'Taxa de Churn', color: '#EF4444' },
  ];

  const exportUserReport = () => {
    // Simular exportação de relatório de usuários
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mês,Novos Usuários,Usuários Ativos,Total Usuários,Taxa de Churn\n"
      + userData.map(row => 
          `${row.month},${row.newUsers},${row.activeUsers},${row.totalUsers},${row.churnRate}%`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio-usuarios-${filters.startDate}-${filters.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Relatório de Usuários</h2>
            <p className="text-sm text-gray-500">
              Período: {new Date(filters.startDate).toLocaleDateString('pt-BR')} - {new Date(filters.endDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        
        <button
          onClick={exportUserReport}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Novos Usuários</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-900">1.247</div>
            <div className="text-sm text-gray-500 mt-1">Total cadastrados</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Usuários Ativos</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-900">892</div>
            <div className="text-sm text-gray-500 mt-1">Últimos 30 dias</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-purple-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Taxa de Crescimento</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">+8.2%</div>
            <div className="text-sm text-gray-500 mt-1">Mensal</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Taxa de Churn</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-red-600">5.4%</div>
            <div className="text-sm text-gray-500 mt-1">Mensal</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendências */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Crescimento de Usuários</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [
                selectedMetric === 'churnRate' ? `${value}%` : value,
                metrics.find(m => m.id === selectedMetric)?.name
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={metrics.find(m => m.id === selectedMetric)?.color}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos em Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Tipo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Distribuição por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => {
                  if (!value) return `${name}: 0%`;
                  const numValue = Number(value) || 0;
                  const total = userTypeData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((numValue / total) * 100).toFixed(0);
                  return `${name} (${percentage}%)`;
                }}
              >
                {userTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Usuários']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Comparativo Mensal */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Comparativo Mensal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newUsers" fill="#10B981" name="Novos Usuários" />
              <Bar dataKey="activeUsers" fill="#3B82F6" name="Usuários Ativos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhamento de Usuários</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mês
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Novos Usuários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuários Ativos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Usuários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Churn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Crescimento
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.map((row) => {
                const growthRate = ((row.newUsers / (row.totalUsers - row.newUsers)) * 100) || 0;
                return (
                  <tr key={row.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {row.newUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {row.activeUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.totalUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {row.churnRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +{growthRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Insights do Relatório</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📈 Tendência Positiva</h4>
            <p className="text-sm text-blue-700">
              Crescimento consistente de 8.2% ao mês na base de usuários
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ Baixa Taxa de Churn</h4>
            <p className="text-sm text-green-700">
              Taxa de churn reduzida de 8.2% para 5.4% nos últimos 6 meses
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">👥 Engajamento Alto</h4>
            <p className="text-sm text-purple-700">
              72% dos usuários estão ativos mensalmente
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">🎯 Oportunidade</h4>
            <p className="text-sm text-orange-700">
              Potencial para aumentar conversão em meses de alta demanda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReports;