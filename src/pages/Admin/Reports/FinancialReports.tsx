import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface FinancialReportProps {
  data: any;
  filters: any;
}

const FinancialReports: React.FC<FinancialReportProps> = ({ data, filters }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Dados de exemplo para demonstração
  const financialData = [
    { month: 'Jan', revenue: 12500, expenses: 8500, profit: 4000, bookings: 45 },
    { month: 'Fev', revenue: 18000, expenses: 9200, profit: 8800, bookings: 52 },
    { month: 'Mar', revenue: 15000, expenses: 7800, profit: 7200, bookings: 48 },
    { month: 'Abr', revenue: 22000, expenses: 10500, profit: 11500, bookings: 61 },
    { month: 'Mai', revenue: 19000, expenses: 8800, profit: 10200, bookings: 55 },
    { month: 'Jun', revenue: 25000, expenses: 11200, profit: 13800, bookings: 68 },
  ];

  const categoryRevenueData = [
    { name: 'Escavadeiras', value: 45230, color: '#0088FE' },
    { name: 'Betoneiras', value: 28760, color: '#00C49F' },
    { name: 'Geradores', value: 19870, color: '#FFBB28' },
    { name: 'Compactadores', value: 16780, color: '#FF8042' },
    { name: 'Andaimes', value: 12340, color: '#8884D8' },
  ];

  const metrics = [
    { id: 'revenue', name: 'Receita', color: '#10B981' },
    { id: 'expenses', name: 'Despesas', color: '#EF4444' },
    { id: 'profit', name: 'Lucro', color: '#3B82F6' },
    { id: 'bookings', name: 'Reservas', color: '#8B5CF6' },
  ];

  const exportFinancialReport = () => {
    // Simular exportação de relatório financeiro
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mês,Receita,Despesas,Lucro,Reservas\n"
      + financialData.map(row => 
          `${row.month},${row.revenue},${row.expenses},${row.profit},${row.bookings}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio-financeiro-${filters.startDate}-${filters.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Relatório Financeiro</h2>
            <p className="text-sm text-gray-500">
              Período: {new Date(filters.startDate).toLocaleDateString('pt-BR')} - {new Date(filters.endDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        
        <button
          onClick={exportFinancialReport}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-2" 
                style={{ backgroundColor: metric.color }}
              />
              <span className="text-sm font-medium text-gray-700">{metric.name}</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">
                {metric.id === 'revenue' && 'R$ 125.430,50'}
                {metric.id === 'expenses' && 'R$ 58.920,30'}
                {metric.id === 'profit' && 'R$ 66.510,20'}
                {metric.id === 'bookings' && '567'}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {metric.id !== 'bookings' && 'Total'}
                {metric.id === 'bookings' && 'Reservas realizadas'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Tendências */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Tendência Financeira</h3>
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
          <LineChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => 
                selectedMetric === 'bookings' 
                  ? value 
                  : `R$ ${value.toLocaleString('pt-BR')}`
              }
            />
            <Tooltip 
              formatter={(value: number) => [
                selectedMetric === 'bookings' 
                  ? value 
                  : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
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
        {/* Receita por Categoria */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Receita por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryRevenueData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => {
                  if (!value) return `${name}: 0%`;
                  const numValue = Number(value) || 0;
                  const total = categoryRevenueData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((numValue / total) * 100).toFixed(0);
                  return `${name} (${percentage}%)`;
                }}
              >
                {categoryRevenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Comparativo Mensal */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Comparativo Mensal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Receita" />
              <Bar dataKey="expenses" fill="#EF4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhamento Financeiro</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mês
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Despesas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lucro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financialData.map((row) => (
                <tr key={row.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    R$ {row.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    R$ {row.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    R$ {row.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {((row.profit / row.revenue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;