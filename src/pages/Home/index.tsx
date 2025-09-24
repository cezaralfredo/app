import React from 'react';
import { Link } from 'react-router-dom';

// Ícones para categorias
import { TruckIcon, CubeIcon, WrenchScrewdriverIcon, BeakerIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  // Categorias de equipamentos
  const categories = [
    { id: 'munck', name: 'Munck', icon: <TruckIcon className="h-12 w-12" /> },
    { id: 'guindaste', name: 'Guindaste', icon: <TruckIcon className="h-12 w-12" /> },
    { id: 'empilhadeira', name: 'Empilhadeira', icon: <CubeIcon className="h-12 w-12" /> },
    { id: 'pipa', name: 'Pipa', icon: <BeakerIcon className="h-12 w-12" /> },
    { id: 'guincho', name: 'Guincho/Reboque', icon: <TruckIcon className="h-12 w-12" /> },
    { id: 'escavadeira', name: 'Escavadeira', icon: <WrenchScrewdriverIcon className="h-12 w-12" /> },
    { id: 'trator', name: 'Trator', icon: <TruckIcon className="h-12 w-12" /> },
    { id: 'betoneira', name: 'Betoneira', icon: <CubeIcon className="h-12 w-12" /> },
  ];

  // Benefícios
  const benefits = [
    {
      title: 'Encontre equipamentos próximos',
      description: 'Localize equipamentos disponíveis perto de você com nossa busca por geolocalização.',
      icon: <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    },
    {
      title: 'Compare preços e condições',
      description: 'Receba múltiplos orçamentos e escolha a melhor opção para o seu projeto.',
      icon: <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    },
    {
      title: 'Prestadores verificados',
      description: 'Todos os prestadores passam por um processo de verificação para garantir segurança.',
      icon: <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    },
    {
      title: 'Atendimento de urgência',
      description: 'Opção de atendimento emergencial para quando você precisar com urgência.',
      icon: <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Equipamentos pesados, solução leve!
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl">
              Encontre e alugue equipamentos pesados para sua obra ou projeto em todo o Brasil.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/search"
                className="btn-primary text-lg px-8 py-3"
              >
                Buscar Equipamentos
              </Link>
              <Link
                to="/provider/register"
                className="ml-4 btn-outline bg-white text-lg px-8 py-3"
              >
                Seja um Prestador
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Categorias de Equipamentos
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Encontre o equipamento ideal para o seu projeto
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${category.id}`}
                className="col-span-1 flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all"
              >
                <div className="text-primary-600">
                  {category.icon}
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Como Funciona
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Simples, rápido e seguro
            </p>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">Para Clientes</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white mx-auto">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Busque equipamentos</h3>
                <p className="mt-2 text-base text-gray-500">Encontre o equipamento ideal por categoria, localização ou especificações.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white mx-auto">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Solicite orçamentos</h3>
                <p className="mt-2 text-base text-gray-500">Envie solicitações para múltiplos prestadores e compare preços.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white mx-auto">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Negocie detalhes</h3>
                <p className="mt-2 text-base text-gray-500">Converse com o prestador pelo chat ou WhatsApp para acertar detalhes.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white mx-auto">
                  <span className="text-lg font-bold">4</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Contrate e avalie</h3>
                <p className="mt-2 text-base text-gray-500">Feche o negócio e depois avalie o serviço prestado.</p>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">Para Prestadores</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white mx-auto">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Cadastre-se</h3>
                <p className="mt-2 text-base text-gray-500">Crie sua conta e passe pelo processo de verificação.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white mx-auto">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Cadastre equipamentos</h3>
                <p className="mt-2 text-base text-gray-500">Adicione seus equipamentos com fotos e especificações detalhadas.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white mx-auto">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Receba solicitações</h3>
                <p className="mt-2 text-base text-gray-500">Seja notificado quando clientes solicitarem seus equipamentos.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white mx-auto">
                  <span className="text-lg font-bold">4</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Feche negócios</h3>
                <p className="mt-2 text-base text-gray-500">Envie orçamentos, negocie e aumente sua carteira de clientes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefícios */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Por que usar o EQUIPAMAX?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Vantagens para clientes e prestadores
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-primary-300">Cadastre-se gratuitamente hoje.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3"
              >
                Cadastrar como Cliente
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/provider/register"
                className="btn-outline bg-white text-lg px-8 py-3"
              >
                Cadastrar como Prestador
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;