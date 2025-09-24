import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  ArrowTrendingUpIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  TruckIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../../contexts/AdminContext';

const AnalyticsDashboard: React.FC = () => {
  const { analytics, fetchAnalytics, loading } = useAdmin();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Dados de exemplo para os gráficos
  const revenueData = [
    { date: '01 Jan', revenue: 12000, bookings: 45 },
    { date: '02 Jan', revenue: 18000, bookings: 52 },
    { date: '03 Jan', revenue: 15000, bookings: 48 },
    { date: '04 Jan', revenue: 22000, bookings: 61 },
    { date: '05 Jan', revenue: 19000, bookings: 55 },
    { date: '06 Jan', revenue: 25000, bookings: 68 },
    { date: '07 Jan', revenue: 28000, bookings: 72 },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1200, newUsers: 200 },
    { month: 'Feb', users: 1450, newUsers: 250 },
    { month: 'Mar', users: 1680, newUsers: 230 },
    { month: 'Apr', users: 1920, newUsers: 240 },
    { month: 'May', users: 2150, newUsers: 230 },
    { month: 'Jun', users: 2380, newUsers: 230 },
  ];

  const equipmentCategoryData = [
    { name: 'Construção', value: 35 },
    { name: 'Agricultura', value: 25 },
    { name: 'Indústria', value: 20 },
    { name: 'Eventos', value: 15 },
    { name: 'Outros', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-80 rounded-lg"></div>
            <div className="bg-gray-200 h-80 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = analytics || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalProviders: 0,
    totalEquipment: 0,
    revenueGrowth: 0,
    userGrowth: 0,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análise de Dados</h1>
            <p className="mt-1 text-sm text-gray-500">
              Métricas e insights do seu marketplace
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Período:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              >
                <option value="7d">7 dias</option>
                <option value="30d">30 dias</option>
                <option value="90d">90 dias</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Revenue Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Receita Total
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      R$ {stats.totalRevenue.toLocaleString('pt-BR')}
                    </div>
                    {stats.revenueGrowth !== 0 && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stats.revenueGrowth >= 0 ? (
                          <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                        )}
                        {Math.abs(stats.revenueGrowth)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Usuários
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.totalUsers.toLocaleString('pt-BR')}
                    </div>
                    {stats.userGrowth !== 0 && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stats.userGrowth >= 0 ? (
                          <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                        )}
                        {Math.abs(stats.userGrowth)}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Prestadores Ativos
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.totalProviders.toLocaleString('pt-BR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Equipamentos
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.totalEquipment.toLocaleString('pt-BR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Receita e Reservas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `R$ ${Number(value).toLocaleString('pt-BR')}` : value,
                  name === 'revenue' ? 'Receita' : 'Reservas'
                ]}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#0088FE"
                name="Receita"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke="#00C49F"
                name="Reservas"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crescimento de Usuários</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" name="Total de Usuários" fill="#8884D8" />
              <Bar dataKey="newUsers" name="Novos Usuários" fill="#82CA9D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Equipment Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Categorias de Equipamentos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={equipmentCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const numValue = Number(value) || 0;
                  if (numValue === 0) return `${name}: 0%`;
                  const total = equipmentCategoryData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((numValue / total) * 100).toFixed(0);
                  return `${name}: ${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {equipmentCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Participação']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Taxas de Conversão</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Visitas para Registro</span>
                <span>2.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '2.5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Busca para Reserva</span>
                <span>8.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '8.2%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Retenção Mensal</span>
                <span>76.4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '76.4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas Rápidas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ticket Médio</span>
              <span className="text-sm font-medium text-gray-900">R$ 420,50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tempo Médio de Uso</span>
              <span className="text-sm font-medium text-gray-900">3.2 dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satisfação do Cliente</span>
              <span className="text-sm font-medium text-green-600">4.8/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de Cancelamento</span>
              <span className="text-sm font-medium text-red-600">4.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Exportar Dados</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Exportar CSV
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Exportar PDF
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Agendar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;