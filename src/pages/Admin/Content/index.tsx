import React, { useState } from 'react';
import { 
  TagIcon, 
  DocumentTextIcon,
  MegaphoneIcon,
  Squares2X2Icon 
} from '@heroicons/react/24/outline';
import CategoriesManagement from './Categories';
import StaticContentManagement from './StaticContent';
import AdModeration from './AdModeration';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    {
      id: 'categories',
      name: 'Categorias',
      icon: TagIcon,
      component: CategoriesManagement
    },
    {
      id: 'static',
      name: 'Conteúdo Estático',
      icon: DocumentTextIcon,
      component: StaticContentManagement
    },
    {
      id: 'ads',
      name: 'Moderação de Anúncios',
      icon: MegaphoneIcon,
      component: AdModeration
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CategoriesManagement;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Squares2X2Icon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gerenciamento de Conteúdo
            </h2>
            <p className="text-gray-600">
              Gerencie categorias, conteúdo estático e moderação de anúncios
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon
                    className={`-ml-0.5 mr-2 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Tab Content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default ContentManagement;