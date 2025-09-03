import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, CheckCircleIcon, CalendarIcon, TruckIcon, UserIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon, PhoneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Tipos
type EquipmentDetail = {
  id: string;
  name: string;
  category: string;
  provider: {
    id: string;
    name: string;
    rating: number;
    verificationLevel: number;
    phone: string;
  };
  distance: number;
  hourPrice: number;
  dayPrice: number;
  monthPrice?: number;
  mobilizationFee: number;
  includedDistance: number;
  additionalKmPrice: number;
  operatorIncluded: boolean;
  operatorAdditionalPrice?: number;
  images: string[];
  video?: string;
  description: string;
  location: string;
  specifications: Record<string, string | number | boolean>;
  certificates: string[];
  availability: {
    startDate: string;
    endDate: string;
  };
};

// Dados simulados para demonstração
const mockEquipmentDetails: Record<string, EquipmentDetail> = {
  '1': {
    id: '1',
    name: 'Munck Hyundai 15 Ton',
    category: 'munck',
    provider: {
      id: '101',
      name: 'Locadora Silva',
      rating: 4.8,
      verificationLevel: 2,
      phone: '(11) 98765-4321',
    },
    distance: 5.2,
    hourPrice: 180,
    dayPrice: 1200,
    monthPrice: 22000,
    mobilizationFee: 500,
    includedDistance: 50,
    additionalKmPrice: 5,
    operatorIncluded: true,
    images: [
      'https://via.placeholder.com/800x600?text=Munck+1',
      'https://via.placeholder.com/800x600?text=Munck+2',
      'https://via.placeholder.com/800x600?text=Munck+3',
      'https://via.placeholder.com/800x600?text=Munck+4',
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Munck Hyundai 15 toneladas em excelente estado de conservação. Ideal para içamento de cargas em construções, montagens industriais e movimentação de máquinas e equipamentos pesados.',
    location: 'São Paulo, SP',
    specifications: {
      'Capacidade de Carga': '15 ton',
      'Alcance Máximo Horizontal': '12 m',
      'Altura Máxima de Elevação': '15 m',
      'Tipo de Lança': 'Articulada',
      'Momento de Carga': '30 ton.m',
      'Controle Remoto': true,
    },
    certificates: [
      'Certificado de Manutenção 2023',
      'ART do Equipamento',
      'Laudo de Inspeção',
    ],
    availability: {
      startDate: '2023-08-01',
      endDate: '2023-12-31',
    },
  },
  '2': {
    id: '2',
    name: 'Guindaste Liebherr 50 Ton',
    category: 'guindaste',
    provider: {
      id: '102',
      name: 'Mega Locações',
      rating: 4.5,
      verificationLevel: 3,
      phone: '(11) 97654-3210',
    },
    distance: 8.7,
    hourPrice: 350,
    dayPrice: 2800,
    monthPrice: 58000,
    mobilizationFee: 1200,
    includedDistance: 80,
    additionalKmPrice: 8,
    operatorIncluded: true,
    images: [
      'https://via.placeholder.com/800x600?text=Guindaste+1',
      'https://via.placeholder.com/800x600?text=Guindaste+2',
      'https://via.placeholder.com/800x600?text=Guindaste+3',
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Guindaste Liebherr 50 toneladas para serviços de grande porte. Equipamento com manutenção em dia e operador experiente.',
    location: 'São Paulo, SP',
    specifications: {
      'Capacidade Máxima de Içamento': '50 ton',
      'Altura Máxima com Lança': '45 m',
      'Comprimento da Lança': '40 m',
      'Raio de Operação': '35 m',
      'Tipo': 'Móvel',
      'Capacidade com Lança Estendida': '30 ton',
    },
    certificates: [
      'Certificado de Manutenção 2023',
      'ART do Equipamento',
      'Laudo de Inspeção',
      'Certificação do Operador',
    ],
    availability: {
      startDate: '2023-07-15',
      endDate: '2023-11-30',
    },
  },
};

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    isUrgent: false,
    notes: '',
  });

  // Buscar detalhes do equipamento pelo ID
  const equipment = mockEquipmentDetails[id || '1'];

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Equipamento não encontrado</h2>
          <p className="mt-2 text-gray-600">O equipamento que você está procurando não existe ou foi removido.</p>
          <Link to="/search" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Voltar para busca
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRequestData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para enviar a solicitação
    alert('Solicitação enviada com sucesso! Em breve o prestador entrará em contato.');
    setShowRequestForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navegação de volta */}
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Voltar para resultados
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Galeria de imagens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <div className="relative h-80 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={equipment.images[activeImageIndex]}
                  alt={`${equipment.name} - Imagem ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {equipment.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative rounded-md overflow-hidden h-20 ${index === activeImageIndex ? 'ring-2 ring-primary-500' : 'opacity-70'}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${equipment.name} - Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informações principais */}
            <div className="flex flex-col">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>
                  <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-md">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-700">{equipment.provider.rating}</span>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 mt-1">
                  {equipment.provider.name}
                  {equipment.provider.verificationLevel > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="mr-1 h-3 w-3" />
                      Verificado Nível {equipment.provider.verificationLevel}
                    </span>
                  )}
                </p>
                
                <div className="flex items-center mt-2">
                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                  <span className="ml-1 text-sm text-gray-500">{equipment.distance} km - {equipment.location}</span>
                </div>
              </div>

              {/* Preços */}
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Preços</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                      <span className="ml-1 text-sm font-medium text-gray-700">Hora:</span>
                    </div>
                    <p className="text-lg font-bold text-primary-600">{formatCurrency(equipment.hourPrice)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-500" />
                      <span className="ml-1 text-sm font-medium text-gray-700">Dia:</span>
                    </div>
                    <p className="text-lg font-bold text-primary-600">{formatCurrency(equipment.dayPrice)}</p>
                  </div>
                  
                  {equipment.monthPrice && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <span className="ml-1 text-sm font-medium text-gray-700">Mês:</span>
                      </div>
                      <p className="text-lg font-bold text-primary-600">{formatCurrency(equipment.monthPrice)}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 text-gray-500" />
                      <span className="ml-1 text-sm font-medium text-gray-700">Mobilização:</span>
                    </div>
                    <p className="text-lg font-bold text-primary-600">{formatCurrency(equipment.mobilizationFee)}</p>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <p>• Distância incluída no preço: {equipment.includedDistance} km</p>
                  <p>• Valor por km adicional: {formatCurrency(equipment.additionalKmPrice)}</p>
                  <p>• Operador {equipment.operatorIncluded ? 'incluído no preço' : 'não incluído'}</p>
                  {!equipment.operatorIncluded && equipment.operatorAdditionalPrice && (
                    <p>• Valor adicional do operador: {formatCurrency(equipment.operatorAdditionalPrice)}/dia</p>
                  )}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="py-4 mt-auto">
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`https://wa.me/55${equipment.provider.phone.replace(/\D/g, '')}?text=Olá, tenho interesse no equipamento ${equipment.name} (ID: ${equipment.id}) disponível na EQUIPAMAX.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PhoneIcon className="-ml-1 mr-2 h-5 w-5 text-green-600" />
                    WhatsApp
                  </a>
                  
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ChatBubbleLeftRightIcon className="-ml-1 mr-2 h-5 w-5" />
                    Solicitar Orçamento
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição e especificações */}
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
                <p className="text-gray-600">{equipment.description}</p>
                
                {equipment.video && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">Vídeo do Equipamento</h3>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <iframe
                        src={equipment.video}
                        title="Vídeo do equipamento"
                        className="w-full h-64"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
                
                {equipment.certificates.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">Certificados e Documentação</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      {equipment.certificates.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Especificações Técnicas</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-gray-900 mb-2">Disponibilidade</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                      <span className="ml-2 text-sm text-gray-600">
                        Disponível de {new Date(equipment.availability.startDate).toLocaleDateString('pt-BR')} até {new Date(equipment.availability.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de solicitação de orçamento */}
      {showRequestForm && (
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
                      Solicitar Orçamento
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmitRequest}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Local de uso do equipamento*</label>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="Endereço completo onde o equipamento será utilizado"
                              value={requestData.location}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição do serviço*</label>
                            <textarea
                              name="description"
                              id="description"
                              rows={3}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="Descreva detalhadamente o serviço que será realizado"
                              value={requestData.description}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de início*</label>
                              <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={requestData.startDate}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de término*</label>
                              <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={requestData.endDate}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="isUrgent"
                              name="isUrgent"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={requestData.isUrgent}
                              onChange={handleCheckboxChange}
                            />
                            <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">
                              Urgente (+20% sobre o valor)
                            </label>
                          </div>
                          
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Observações adicionais</label>
                            <textarea
                              name="notes"
                              id="notes"
                              rows={2}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="Informações adicionais que possam ser relevantes"
                              value={requestData.notes}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                          >
                            Enviar Solicitação
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setShowRequestForm(false)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetail;