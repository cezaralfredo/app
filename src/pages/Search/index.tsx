import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Tipos
type Equipment = {
  id: string;
  name: string;
  category: string;
  provider: {
    id: string;
    name: string;
    rating: number;
  };
  distance: number;
  hourPrice: number;
  dayPrice: number;
  mainImage: string;
  location: string;
};

const equipmentCategories = [
  { id: 'munck', name: 'Munck', icon: '🏗️' },
  { id: 'guindaste', name: 'Guindaste', icon: '🏗️' },
  { id: 'empilhadeira', name: 'Empilhadeira', icon: '🚜' },
  { id: 'pipa', name: 'Pipa (Caminhão Pipa)', icon: '🚒' },
  { id: 'guincho', name: 'Guincho/Reboque', icon: '🚚' },
  { id: 'escavadeira', name: 'Escavadeira', icon: '🚜' },
  { id: 'trator', name: 'Trator', icon: '🚜' },
  { id: 'betoneira', name: 'Betoneira', icon: '🏗️' },
];

// Dados simulados para demonstração
const mockEquipments: Equipment[] = [
  {
    id: '1',
    name: 'Munck Hyundai 15 Ton',
    category: 'munck',
    provider: {
      id: '101',
      name: 'Locadora Silva',
      rating: 4.8,
    },
    distance: 5.2,
    hourPrice: 180,
    dayPrice: 1200,
    mainImage: '/images/equipment/munck.svg',
    location: 'São Paulo, SP',
  },
  {
    id: '2',
    name: 'Guindaste Liebherr 50 Ton',
    category: 'guindaste',
    provider: {
      id: '102',
      name: 'Mega Locações',
      rating: 4.5,
    },
    distance: 8.7,
    hourPrice: 350,
    dayPrice: 2800,
    mainImage: '/images/equipment/guindaste.svg',
    location: 'São Paulo, SP',
  },
  {
    id: '3',
    name: 'Empilhadeira Yale 2.5 Ton',
    category: 'empilhadeira',
    provider: {
      id: '103',
      name: 'Aluga Tudo',
      rating: 4.2,
    },
    distance: 3.1,
    hourPrice: 120,
    dayPrice: 900,
    mainImage: '/images/equipment/empilhadeira.svg',
    location: 'São Paulo, SP',
  },
  {
    id: '4',
    name: 'Caminhão Pipa 15.000L',
    category: 'pipa',
    provider: {
      id: '104',
      name: 'Água Rápida',
      rating: 4.7,
    },
    distance: 12.5,
    hourPrice: 150,
    dayPrice: 1100,
    mainImage: '/images/equipment/pipa.svg',
    location: 'Guarulhos, SP',
  },
  {
    id: '5',
    name: 'Guincho Plataforma Mercedes',
    category: 'guincho',
    provider: {
      id: '105',
      name: 'Reboque Express',
      rating: 4.9,
    },
    distance: 7.3,
    hourPrice: 130,
    dayPrice: 950,
    mainImage: '/images/equipment/guincho.svg',
    location: 'Osasco, SP',
  },
  {
    id: '6',
    name: 'Escavadeira Caterpillar 320',
    category: 'escavadeira',
    provider: {
      id: '106',
      name: 'Terra Plana',
      rating: 4.6,
    },
    distance: 15.8,
    hourPrice: 280,
    dayPrice: 2200,
    mainImage: '/images/equipment/escavadeira.svg',
    location: 'Campinas, SP',
  },
];

const Search: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number>(50);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [withOperator, setWithOperator] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>(mockEquipments);

  // Efeito para filtrar equipamentos com base nos critérios selecionados
  useEffect(() => {
    let filtered = [...equipments];

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(eq => eq.category === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        eq => eq.name.toLowerCase().includes(term) || 
              eq.provider.name.toLowerCase().includes(term) ||
              eq.location.toLowerCase().includes(term)
      );
    }

    // Filtrar por raio de distância
    filtered = filtered.filter(eq => eq.distance <= searchRadius);

    // Filtrar por faixa de preço (usando o preço por dia como referência)
    filtered = filtered.filter(
      eq => eq.dayPrice >= priceRange[0] && eq.dayPrice <= priceRange[1]
    );

    setFilteredEquipments(filtered);
  }, [equipments, selectedCategory, searchTerm, searchRadius, priceRange, withOperator, verifiedOnly, urgentOnly]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho de busca */}
      <div className="bg-primary-700 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Encontre o equipamento ideal para seu projeto</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white focus:border-white"
                placeholder="Buscar por equipamento, prestador ou localidade"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-800 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setShowFilters(!showFilters)}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filtros
            </button>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-md shadow p-4 text-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raio de busca</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-2 text-sm">{searchRadius} km</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faixa de preço (diária)</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{formatCurrency(priceRange[0])}</span>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm">{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={withOperator}
                      onChange={() => setWithOperator(!withOperator)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Apenas com operador</span>
                  </label>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={verifiedOnly}
                      onChange={() => setVerifiedOnly(!verifiedOnly)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Prestadores verificados</span>
                  </label>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={urgentOnly}
                      onChange={() => setUrgentOnly(!urgentOnly)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Disponível para urgência</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categorias */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {equipmentCategories.map((category) => (
            <button
              key={category.id}
              className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm transition-all ${selectedCategory === category.id ? 'bg-primary-100 border-2 border-primary-500' : 'bg-white hover:bg-gray-50 border border-gray-200'}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredEquipments.length} {filteredEquipments.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipments.map((equipment) => (
            <div key={equipment.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={equipment.mainImage}
                alt={equipment.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-700">{equipment.provider.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{equipment.provider.name}</p>
                
                <div className="flex items-center mt-2">
                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                  <span className="ml-1 text-sm text-gray-500">{equipment.distance} km - {equipment.location}</span>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                      <span className="ml-1 text-sm text-gray-500">Hora: {formatCurrency(equipment.hourPrice)}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                      <span className="ml-1 text-sm text-gray-500">Dia: {formatCurrency(equipment.dayPrice)}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/equipment/${equipment.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEquipments.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum resultado encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros ou buscar por outro termo.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                  setSearchRadius(50);
                  setPriceRange([0, 5000]);
                  setWithOperator(false);
                  setVerifiedOnly(false);
                  setUrgentOnly(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;