import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  UserIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

// Tipos
type RequestStatus = 'new' | 'negotiation' | 'approved' | 'rejected' | 'completed';

type Equipment = {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  year: string;
  status: 'available' | 'rented' | 'maintenance';
  hourlyPrice: number;
  dailyPrice: number;
  monthlyPrice?: number;
  mobilizationFee: number;
  hasOperator: boolean;
  operatorPrice?: number;
  image: string;
};

type Request = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  requestDate: string;
  startDate: string;
  endDate: string;
  location: string;
  distance: number;
  notes?: string;
  quotationValue?: number;
  status: RequestStatus;
  hasUnreadMessages: boolean;
};

type Metric = {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
};

// Dados simulados para demonstração
const mockEquipments: Equipment[] = [
  {
    id: '1',
    name: 'Munck Hyundai 15 Ton',
    category: 'Munck',
    brand: 'Hyundai',
    model: 'HD-15',
    year: '2019',
    status: 'available',
    hourlyPrice: 250,
    dailyPrice: 1800,
    monthlyPrice: 32000,
    mobilizationFee: 800,
    hasOperator: true,
    operatorPrice: 200,
    image: 'https://via.placeholder.com/150?text=Munck',
  },
  {
    id: '2',
    name: 'Guindaste Liebherr 50 Ton',
    category: 'Guindaste',
    brand: 'Liebherr',
    model: 'LTM 1050',
    year: '2018',
    status: 'rented',
    hourlyPrice: 450,
    dailyPrice: 3500,
    monthlyPrice: 65000,
    mobilizationFee: 2000,
    hasOperator: true,
    operatorPrice: 300,
    image: 'https://via.placeholder.com/150?text=Guindaste',
  },
  {
    id: '3',
    name: 'Empilhadeira Yale 2.5 Ton',
    category: 'Empilhadeira',
    brand: 'Yale',
    model: 'GDP25',
    year: '2020',
    status: 'available',
    hourlyPrice: 120,
    dailyPrice: 900,
    monthlyPrice: 18000,
    mobilizationFee: 500,
    hasOperator: false,
    image: 'https://via.placeholder.com/150?text=Empilhadeira',
  },
  {
    id: '4',
    name: 'Caminhão Pipa 15.000L',
    category: 'Pipa',
    brand: 'Mercedes-Benz',
    model: 'Atego 2426',
    year: '2021',
    status: 'maintenance',
    hourlyPrice: 180,
    dailyPrice: 1400,
    monthlyPrice: 28000,
    mobilizationFee: 600,
    hasOperator: true,
    operatorPrice: 150,
    image: 'https://via.placeholder.com/150?text=Pipa',
  },
];

const mockRequests: Request[] = [
  {
    id: 'REQ001',
    equipmentId: '1',
    equipmentName: 'Munck Hyundai 15 Ton',
    clientId: '101',
    clientName: 'Construtora ABC',
    clientPhone: '(11) 98765-4321',
    requestDate: '2023-07-15',
    startDate: '2023-08-10',
    endDate: '2023-08-12',
    location: 'Av. Paulista, 1000 - São Paulo, SP',
    distance: 12.5,
    notes: 'Necessário içamento de materiais para o 5º andar',
    quotationValue: 2900,
    status: 'negotiation',
    hasUnreadMessages: true,
  },
  {
    id: 'REQ002',
    equipmentId: '2',
    equipmentName: 'Guindaste Liebherr 50 Ton',
    clientId: '102',
    clientName: 'Incorporadora XYZ',
    clientPhone: '(11) 97654-3210',
    requestDate: '2023-07-18',
    startDate: '2023-08-20',
    endDate: '2023-08-25',
    location: 'Rua Augusta, 500 - São Paulo, SP',
    distance: 8.3,
    notes: 'Montagem de estrutura metálica',
    status: 'new',
    hasUnreadMessages: false,
  },
  {
    id: 'REQ003',
    equipmentId: '3',
    equipmentName: 'Empilhadeira Yale 2.5 Ton',
    clientId: '103',
    clientName: 'Logística Rápida',
    clientPhone: '(11) 96543-2109',
    requestDate: '2023-07-10',
    startDate: '2023-07-25',
    endDate: '2023-07-30',
    location: 'Rodovia Anhanguera, Km 15 - Osasco, SP',
    distance: 22.7,
    quotationValue: 4500,
    status: 'approved',
    hasUnreadMessages: false,
  },
  {
    id: 'REQ004',
    equipmentId: '1',
    equipmentName: 'Munck Hyundai 15 Ton',
    clientId: '104',
    clientName: 'Metalúrgica Silva',
    clientPhone: '(11) 95432-1098',
    requestDate: '2023-06-28',
    startDate: '2023-07-05',
    endDate: '2023-07-10',
    location: 'Av. Industrial, 1500 - Santo André, SP',
    distance: 35.2,
    quotationValue: 5500,
    status: 'completed',
    hasUnreadMessages: false,
  },
  {
    id: 'REQ005',
    equipmentId: '4',
    equipmentName: 'Caminhão Pipa 15.000L',
    clientId: '105',
    clientName: 'Construtora Horizonte',
    clientPhone: '(11) 94321-0987',
    requestDate: '2023-07-01',
    startDate: '2023-07-15',
    endDate: '2023-07-15',
    location: 'Estrada das Lágrimas, 2000 - São Caetano, SP',
    distance: 28.9,
    quotationValue: 950,
    status: 'rejected',
    hasUnreadMessages: false,
  },
];

const ProviderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'equipments' | 'requests' | 'calendar' | 'reports' | 'profile'>('dashboard');
  const [requestFilter, setRequestFilter] = useState<RequestStatus | 'all'>('all');
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationData, setQuotationData] = useState({
    requestId: '',
    value: 0,
    notes: '',
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-400" />
            Nova
          </span>
        );
      case 'negotiation':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ChatBubbleLeftRightIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-400" />
            Em Negociação
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-green-400" />
            Aprovada
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" />
            Recusada
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-400" />
            Concluída
          </span>
        );
      default:
        return null;
    }
  };

  const getEquipmentStatusBadge = (status: 'available' | 'rented' | 'maintenance') => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-green-400" />
            Disponível
          </span>
        );
      case 'rented':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-400" />
            Alugado
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" />
            Em Manutenção
          </span>
        );
      default:
        return null;
    }
  };

  const filteredRequests = requestFilter === 'all' 
    ? mockRequests 
    : mockRequests.filter(req => req.status === requestFilter);

  const handleQuotation = (requestId: string) => {
    const request = mockRequests.find(req => req.id === requestId);
    if (request) {
      setQuotationData({
        requestId,
        value: request.quotationValue || 0,
        notes: '',
      });
      setShowQuotationModal(true);
    }
  };

  const submitQuotation = () => {
    // Aqui seria implementada a lógica para enviar o orçamento
    alert(`Orçamento enviado com sucesso! Valor: ${formatCurrency(quotationData.value)}, Observações: ${quotationData.notes}`);
    setShowQuotationModal(false);
  };

  // Métricas para o dashboard
  const metrics: Metric[] = [
    {
      label: 'Solicitações Novas',
      value: mockRequests.filter(req => req.status === 'new').length,
      icon: <ClockIcon className="h-6 w-6" />,
      color: 'bg-yellow-500',
    },
    {
      label: 'Em Negociação',
      value: mockRequests.filter(req => req.status === 'negotiation').length,
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Fechadas este mês',
      value: mockRequests.filter(req => req.status === 'completed').length,
      change: 20,
      icon: <CheckCircleIcon className="h-6 w-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Taxa de Conversão',
      value: '35%',
      change: 5,
      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h2 className="text-lg font-semibold text-primary-600">EQUIPAMAX</h2>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                <button
                  className={`${activeTab === 'dashboard' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <ChartBarIcon className="mr-3 h-6 w-6" />
                  Dashboard
                </button>
                <button
                  className={`${activeTab === 'equipments' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  onClick={() => setActiveTab('equipments')}
                >
                  <CubeIcon className="mr-3 h-6 w-6" />
                  Meus Equipamentos
                </button>
                <button
                  className={`${activeTab === 'requests' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  onClick={() => setActiveTab('requests')}
                >
                  <ClipboardDocumentListIcon className="mr-3 h-6 w-6" />
                  Solicitações
                  {mockRequests.filter(req => req.status === 'new').length > 0 && (
                    <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {mockRequests.filter(req => req.status === 'new').length}
                    </span>
                  )}
                </button>
                <button
                  className={`${activeTab === 'calendar' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  onClick={() => setActiveTab('calendar')}
                >
                  <CalendarIcon className="mr-3 h-6 w-6" />
                  Calendário
                </button>
                <button
                  className={`${activeTab === 'reports' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  onClick={() => setActiveTab('reports')}
                >
                  <ChartBarIcon className="mr-3 h-6 w-6" />
                  Relatórios
                </button>
                <button
                  className={`${activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  onClick={() => setActiveTab('profile')}
                >
                  <UserIcon className="mr-3 h-6 w-6" />
                  Perfil da Empresa
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
                
                {/* Métricas */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {metrics.map((metric, index) => (
                    <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 rounded-md p-3 ${metric.color}`}>
                            <div className="text-white">{metric.icon}</div>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">{metric.label}</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">{metric.value}</div>
                                {metric.change && (
                                  <div className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {metric.change > 0 ? '+' : ''}{metric.change}%
                                  </div>
                                )}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Solicitações recentes */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Solicitações Recentes</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
                  <ul className="divide-y divide-gray-200">
                    {mockRequests.slice(0, 3).map((request) => (
                      <li key={request.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-primary-600 truncate">
                                {request.equipmentName}
                              </p>
                              {request.hasUnreadMessages && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Nova mensagem
                                </span>
                              )}
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Cliente: {request.clientName}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {formatDate(request.startDate)} a {formatDate(request.endDate)}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Solicitado em: {formatDate(request.requestDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 px-4 py-3 text-center">
                    <button
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      onClick={() => setActiveTab('requests')}
                    >
                      Ver todas as solicitações
                    </button>
                  </div>
                </div>

                {/* Status dos equipamentos */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status dos Equipamentos</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {mockEquipments.map((equipment) => (
                      <li key={equipment.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-100">
                                <img src={equipment.image} alt={equipment.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-primary-600 truncate">
                                  {equipment.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {equipment.brand} {equipment.model} ({equipment.year})
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              {getEquipmentStatusBadge(equipment.status)}
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Categoria: {equipment.category}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm font-medium text-gray-9s00 sm:mt-0">
                              <p>
                                {formatCurrency(equipment.dailyPrice)}/dia
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Meus Equipamentos */}
            {activeTab === 'equipments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Meus Equipamentos</h1>
                  <Link
                    to="/equipment-register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Adicionar Equipamento
                  </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {mockEquipments.map((equipment) => (
                      <li key={equipment.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden bg-gray-100">
                                <img src={equipment.image} alt={equipment.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="ml-4">
                                <p className="text-lg font-medium text-gray-900">
                                  {equipment.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {equipment.brand} {equipment.model} ({equipment.year})
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              {getEquipmentStatusBadge(equipment.status)}
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preços</h4>
                              <div className="mt-1 text-sm text-gray-900">
                                <p>Hora: {formatCurrency(equipment.hourlyPrice)}</p>
                                <p>Dia: {formatCurrency(equipment.dailyPrice)}</p>
                                {equipment.monthlyPrice && (
                                  <p>Mês: {formatCurrency(equipment.monthlyPrice)}</p>
                                )}
                                <p>Mobilização: {formatCurrency(equipment.mobilizationFee)}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</h4>
                              <div className="mt-1 text-sm text-gray-900">
                                <p>{equipment.hasOperator ? 'Incluído' : 'Não incluído'}</p>
                                {equipment.hasOperator && equipment.operatorPrice && (
                                  <p>Valor adicional: {formatCurrency(equipment.operatorPrice)}/dia</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-end justify-end space-x-2">
                              <button
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                onClick={() => alert(`Alterando status do equipamento: ${equipment.name}`)}
                              >
                                Alterar Status
                              </button>
                              <Link
                                to={`/equipment-edit/${equipment.id}`}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Editar
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Solicitações */}
            {activeTab === 'requests' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Solicitações</h1>
                  <div>
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      value={requestFilter}
                      onChange={(e) => setRequestFilter(e.target.value as RequestStatus | 'all')}
                    >
                      <option value="all">Todos os status</option>
                      <option value="new">Novas</option>
                      <option value="negotiation">Em Negociação</option>
                      <option value="approved">Aprovadas</option>
                      <option value="rejected">Recusadas</option>
                      <option value="completed">Concluídas</option>
                    </select>
                  </div>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma solicitação encontrada</h3>
                    <p className="mt-1 text-sm text-gray-500">Aguarde novas solicitações de clientes.</p>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <li key={request.id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-primary-600 truncate">
                                  {request.equipmentName}
                                </p>
                                {request.hasUnreadMessages && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Nova mensagem
                                  </span>
                                )}
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                {getStatusBadge(request.status)}
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  Cliente: {request.clientName}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  {formatDate(request.startDate)} a {formatDate(request.endDate)}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>
                                  Solicitado em: {formatDate(request.requestDate)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Local: {request.location} ({request.distance.toFixed(1)} km de distância)
                              </p>
                              {request.notes && (
                                <p className="mt-1 text-sm text-gray-500">
                                  Observações: {request.notes}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              {request.quotationValue && (
                                <p className="text-sm font-medium text-gray-900">
                                  Valor do orçamento: {formatCurrency(request.quotationValue)}
                                </p>
                              )}
                              <div className="mt-2 flex space-x-2 sm:mt-0">
                                <a
                                  href={`https://wa.me/55${request.clientPhone.replace(/\D/g, '')}?text=Olá, recebemos sua solicitação ${request.id} para o equipamento ${request.equipmentName}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  WhatsApp
                                </a>
                                <Link
                                  to={`/chat/${request.id}`}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  Chat
                                </Link>
                                {request.status === 'new' && (
                                  <button
                                    onClick={() => handleQuotation(request.id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                  >
                                    Enviar Orçamento
                                  </button>
                                )}
                                {request.status === 'negotiation' && (
                                  <button
                                    onClick={() => handleQuotation(request.id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                  >
                                    Revisar Orçamento
                                  </button>
                                )}
                                {request.status === 'approved' && (
                                  <button
                                    onClick={() => alert(`Marcando como concluído: ${request.id}`)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    Marcar como Concluído
                                  </button>
                                )}
                                {request.status === 'new' && (
                                  <button
                                    onClick={() => alert(`Recusando solicitação: ${request.id}`)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    Recusar
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Calendário */}
            {activeTab === 'calendar' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendário de Equipamentos</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                  <p className="text-center text-gray-500">Funcionalidade de calendário será implementada em breve.</p>
                  <div className="mt-4 border rounded-lg p-4">
                    <div className="grid grid-cols-7 gap-px border-b">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="text-center py-2 font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px">
                      {Array.from({ length: 35 }).map((_, i) => {
                        const day = i - 2; // Ajuste para começar no dia correto do mês
                        return (
                          <div key={i} className={`h-24 p-2 ${day < 1 || day > 31 ? 'bg-gray-50' : 'bg-white'}`}>
                            {day > 0 && day <= 31 && (
                              <>
                                <p className="text-sm font-medium">{day}</p>
                                {day === 10 && (
                                  <div className="mt-1 p-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    Munck - Alugado
                                  </div>
                                )}
                                {day === 15 && (
                                  <div className="mt-1 p-1 text-xs bg-green-100 text-green-800 rounded">
                                    Empilhadeira - Reservado
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relatórios */}
            {activeTab === 'reports' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Relatórios</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                  <p className="text-center text-gray-500">Funcionalidade de relatórios será implementada em breve.</p>
                  <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitações por Período</h3>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                        <p className="text-gray-500">Gráfico de solicitações</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Taxa de Conversão</h3>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                        <p className="text-gray-500">Gráfico de conversão</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Equipamentos Mais Procurados</h3>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                        <p className="text-gray-500">Gráfico de popularidade</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Faturamento Estimado</h3>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                        <p className="text-gray-500">Gráfico de faturamento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Perfil da Empresa */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Perfil da Empresa</h1>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => alert('Perfil salvo com sucesso!')}
                  >
                    Salvar Alterações
                  </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Informações da Empresa</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Mantenha seus dados sempre atualizados.</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Nome do Responsável</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <input
                            type="text"
                            className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            defaultValue="Carlos Oliveira"
                          />
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Observações</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <textarea
                            rows={3}
                            className="max-w-lg shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                            defaultValue="Empresa especializada em locação de equipamentos pesados para construção civil e industrial."
                          />
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Configurações de Notificação</dt>
                        <dd className="mt-1 text-sm text-gray-9s00 sm:mt-0 sm:col-span-2">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                id="notification-email"
                                name="notification-email"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label htmlFor="notification-email" className="ml-3 block text-sm text-gray-700">
                                Receber notificações por email
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="notification-sms"
                                name="notification-sms"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label htmlFor="notification-sms" className="ml-3 block text-sm text-gray-700">
                                Receber notificações por SMS
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="notification-push"
                                name="notification-push"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label htmlFor="notification-push" className="ml-3 block text-sm text-gray-700">
                                Receber notificações push
                              </label>
                            </div>
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Orçamento */}
      {showQuotationModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Enviar Orçamento
                    </h3>
                    <div className="mt-4">
                      <label htmlFor="quotation-value" className="block text-sm font-medium text-gray-700">
                        Valor do Orçamento (R$)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="quotation-value"
                          id="quotation-value"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={quotationData.value}
                          onChange={(e) => setQuotationData({ ...quotationData, value: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="quotation-notes" className="block text-sm font-medium text-gray-700">
                        Observações
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="quotation-notes"
                          name="quotation-notes"
                          rows={3}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={quotationData.notes}
                          onChange={(e) => setQuotationData({ ...quotationData, notes: e.target.value })}
                          placeholder="Detalhes adicionais sobre o orçamento..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={submitQuotation}
                >
                  Enviar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowQuotationModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;