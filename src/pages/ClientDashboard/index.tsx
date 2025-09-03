import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ChatBubbleLeftRightIcon,
  StarIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Tipos
type RequestStatus = 'pending' | 'negotiation' | 'approved' | 'rejected' | 'completed';

type Request = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  requestDate: string;
  startDate: string;
  endDate: string;
  quotationValue?: number;
  status: RequestStatus;
  hasUnreadMessages: boolean;
};

type FavoriteItem = {
  id: string;
  type: 'equipment' | 'provider';
  name: string;
  image: string;
  description: string;
};

type HistoryItem = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  providerId: string;
  providerName: string;
  startDate: string;
  endDate: string;
  value: number;
  hasRated: boolean;
  rating?: number;
};

// Dados simulados para demonstração
const mockRequests: Request[] = [
  {
    id: 'REQ001',
    equipmentId: '1',
    equipmentName: 'Munck Hyundai 15 Ton',
    providerId: '101',
    providerName: 'Locadora Silva',
    providerPhone: '(11) 98765-4321',
    requestDate: '2023-07-15',
    startDate: '2023-08-10',
    endDate: '2023-08-12',
    quotationValue: 2900,
    status: 'negotiation',
    hasUnreadMessages: true,
  },
  {
    id: 'REQ002',
    equipmentId: '2',
    equipmentName: 'Guindaste Liebherr 50 Ton',
    providerId: '102',
    providerName: 'Mega Locações',
    providerPhone: '(11) 97654-3210',
    requestDate: '2023-07-18',
    startDate: '2023-08-20',
    endDate: '2023-08-25',
    status: 'pending',
    hasUnreadMessages: false,
  },
  {
    id: 'REQ003',
    equipmentId: '3',
    equipmentName: 'Empilhadeira Yale 2.5 Ton',
    providerId: '103',
    providerName: 'Aluga Tudo',
    providerPhone: '(11) 96543-2109',
    requestDate: '2023-07-10',
    startDate: '2023-07-25',
    endDate: '2023-07-30',
    quotationValue: 4500,
    status: 'approved',
    hasUnreadMessages: false,
  },
  {
    id: 'REQ004',
    equipmentId: '4',
    equipmentName: 'Caminhão Pipa 15.000L',
    providerId: '104',
    providerName: 'Água Rápida',
    providerPhone: '(11) 95432-1098',
    requestDate: '2023-06-28',
    startDate: '2023-07-05',
    endDate: '2023-07-10',
    quotationValue: 5500,
    status: 'completed',
    hasUnreadMessages: false,
  },
  {
    id: 'REQ005',
    equipmentId: '5',
    equipmentName: 'Guincho Plataforma Mercedes',
    providerId: '105',
    providerName: 'Reboque Express',
    providerPhone: '(11) 94321-0987',
    requestDate: '2023-07-01',
    startDate: '2023-07-15',
    endDate: '2023-07-15',
    quotationValue: 950,
    status: 'rejected',
    hasUnreadMessages: false,
  },
];

const mockFavorites: FavoriteItem[] = [
  {
    id: '1',
    type: 'equipment',
    name: 'Munck Hyundai 15 Ton',
    image: 'https://via.placeholder.com/150?text=Munck',
    description: 'Locadora Silva - São Paulo, SP',
  },
  {
    id: '101',
    type: 'provider',
    name: 'Locadora Silva',
    image: 'https://via.placeholder.com/150?text=Locadora',
    description: 'Munck, Guindaste, Empilhadeira - São Paulo, SP',
  },
  {
    id: '3',
    type: 'equipment',
    name: 'Empilhadeira Yale 2.5 Ton',
    image: 'https://via.placeholder.com/150?text=Empilhadeira',
    description: 'Aluga Tudo - São Paulo, SP',
  },
];

const mockHistory: HistoryItem[] = [
  {
    id: 'HIST001',
    equipmentId: '4',
    equipmentName: 'Caminhão Pipa 15.000L',
    providerId: '104',
    providerName: 'Água Rápida',
    startDate: '2023-06-10',
    endDate: '2023-06-15',
    value: 5500,
    hasRated: true,
    rating: 4,
  },
  {
    id: 'HIST002',
    equipmentId: '6',
    equipmentName: 'Escavadeira Caterpillar 320',
    providerId: '106',
    providerName: 'Terra Plana',
    startDate: '2023-05-20',
    endDate: '2023-05-25',
    value: 11000,
    hasRated: true,
    rating: 5,
  },
  {
    id: 'HIST003',
    equipmentId: '2',
    equipmentName: 'Guindaste Liebherr 50 Ton',
    providerId: '102',
    providerName: 'Mega Locações',
    startDate: '2023-04-15',
    endDate: '2023-04-20',
    value: 14000,
    hasRated: false,
  },
];

const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'favorites' | 'history' | 'profile'>('requests');
  const [requestFilter, setRequestFilter] = useState<RequestStatus | 'all'>('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({
    historyId: '',
    rating: 0,
    comment: '',
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
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-400" />
            Aguardando
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
            Aprovado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" />
            Recusado
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-400" />
            Concluído
          </span>
        );
      default:
        return null;
    }
  };

  const filteredRequests = requestFilter === 'all' 
    ? mockRequests 
    : mockRequests.filter(req => req.status === requestFilter);

  const handleRating = (historyId: string) => {
    setRatingData({
      historyId,
      rating: 0,
      comment: '',
    });
    setShowRatingModal(true);
  };

  const submitRating = () => {
    // Aqui seria implementada a lógica para enviar a avaliação
    alert(`Avaliação enviada com sucesso! Nota: ${ratingData.rating}, Comentário: ${ratingData.comment}`);
    setShowRatingModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Minha Conta</h1>

        {/* Tabs de navegação */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${activeTab === 'requests' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('requests')}
            >
              <ClipboardDocumentListIcon className="-ml-0.5 mr-2 h-5 w-5 inline-block" />
              Minhas Solicitações
            </button>
            <button
              className={`${activeTab === 'favorites' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('favorites')}
            >
              <HeartIcon className="-ml-0.5 mr-2 h-5 w-5 inline-block" />
              Favoritos
            </button>
            <button
              className={`${activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('history')}
            >
              <ClockIcon className="-ml-0.5 mr-2 h-5 w-5 inline-block" />
              Histórico
            </button>
            <button
              className={`${activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('profile')}
            >
              <UserIcon className="-ml-0.5 mr-2 h-5 w-5 inline-block" />
              Perfil
            </button>
          </nav>
        </div>

        {/* Conteúdo da aba Solicitações */}
        {activeTab === 'requests' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Minhas Solicitações</h2>
              <div className="flex space-x-2">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={requestFilter}
                  onChange={(e) => setRequestFilter(e.target.value as RequestStatus | 'all')}
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Aguardando</option>
                  <option value="negotiation">Em Negociação</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Recusado</option>
                  <option value="completed">Concluído</option>
                </select>
                <Link
                  to="/search"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Nova Solicitação
                </Link>
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma solicitação encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">Comece buscando equipamentos para alugar.</p>
                <div className="mt-6">
                  <Link
                    to="/search"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Buscar Equipamentos
                  </Link>
                </div>
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
                              Prestador: {request.providerName}
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
                        <div className="mt-2 sm:flex sm:justify-between">
                          {request.quotationValue && (
                            <p className="text-sm font-medium text-gray-900">
                              Valor do orçamento: {formatCurrency(request.quotationValue)}
                            </p>
                          )}
                          <div className="mt-2 flex space-x-2 sm:mt-0">
                            <a
                              href={`https://wa.me/55${request.providerPhone.replace(/\D/g, '')}?text=Olá, gostaria de falar sobre minha solicitação ${request.id} para o equipamento ${request.equipmentName}.`}
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
                            <Link
                              to={`/request/${request.id}`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Ver Detalhes
                            </Link>
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

        {/* Conteúdo da aba Favoritos */}
        {activeTab === 'favorites' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Meus Favoritos</h2>
            </div>

            {mockFavorites.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum favorito encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Adicione equipamentos ou prestadores aos seus favoritos.</p>
                <div className="mt-6">
                  <Link
                    to="/search"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Buscar Equipamentos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockFavorites.map((favorite) => (
                  <div key={favorite.id} className="relative bg-white rounded-lg shadow overflow-hidden">
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => alert(`Removido dos favoritos: ${favorite.name}`)}
                    >
                      <HeartIcon className="h-5 w-5 text-red-500" />
                    </button>
                    <div className="flex items-center p-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden bg-gray-100">
                        <img src={favorite.image} alt={favorite.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{favorite.name}</h3>
                        <p className="text-sm text-gray-500">{favorite.description}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
                      <Link
                        to={favorite.type === 'equipment' ? `/equipment/${favorite.id}` : `/provider/${favorite.id}`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {favorite.type === 'equipment' ? 'Ver Equipamento' : 'Ver Prestador'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo da aba Histórico */}
        {activeTab === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Meu Histórico</h2>
            </div>

            {mockHistory.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum histórico encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Seus serviços concluídos aparecerão aqui.</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {mockHistory.map((item) => (
                    <li key={item.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {item.equipmentName}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            {item.hasRated ? (
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-1">Sua avaliação:</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-5 w-5 ${i < (item.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleRating(item.id)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Avaliar
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Prestador: {item.providerName}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {formatDate(item.startDate)} a {formatDate(item.endDate)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm font-medium text-gray-900 sm:mt-0">
                            <p>
                              Valor: {formatCurrency(item.value)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Link
                            to={`/equipment/${item.equipmentId}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Ver Equipamento
                          </Link>
                          <button
                            onClick={() => alert(`Solicitando novamente: ${item.equipmentName}`)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Solicitar Novamente
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo da aba Perfil */}
        {activeTab === 'profile' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Meu Perfil</h2>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => alert('Perfil salvo com sucesso!')}
              >
                Salvar Alterações
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Informações Pessoais</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Mantenha seus dados sempre atualizados.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nome completo</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                        defaultValue="João da Silva"
                      />
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">CPF/CNPJ</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                        defaultValue="123.456.789-00"
                      />
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="email"
                        className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                        defaultValue="joao.silva@exemplo.com"
                      />
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="tel"
                        className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                        defaultValue="(11) 98765-4321"
                      />
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Senha</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={() => alert('Funcionalidade de alteração de senha será implementada em breve.')}
                      >
                        Alterar Senha
                      </button>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Notificações</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="email_notifications"
                              name="email_notifications"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="email_notifications" className="font-medium text-gray-700">Email</label>
                            <p className="text-gray-500">Receber notificações por email.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="push_notifications"
                              name="push_notifications"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="push_notifications" className="font-medium text-gray-700">Push</label>
                            <p className="text-gray-500">Receber notificações push no dispositivo.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="whatsapp_notifications"
                              name="whatsapp_notifications"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="whatsapp_notifications" className="font-medium text-gray-700">WhatsApp</label>
                            <p className="text-gray-500">Receber notificações por WhatsApp.</p>
                          </div>
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

      {/* Modal de avaliação */}
      {showRatingModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Avaliar Serviço
                    </h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sua avaliação</label>
                        <div className="flex justify-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="focus:outline-none"
                              onClick={() => setRatingData({ ...ratingData, rating: star })}
                            >
                              <StarIcon
                                className={`h-8 w-8 ${star <= ratingData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comentário (opcional)</label>
                        <textarea
                          id="comment"
                          name="comment"
                          rows={4}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Conte sua experiência com este serviço"
                          value={ratingData.comment}
                          onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={submitRating}
                  disabled={ratingData.rating === 0}
                >
                  Enviar Avaliação
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRatingModal(false)}
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

export default ClientDashboard;