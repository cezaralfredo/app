import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface StaticContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
  isActive: boolean;
}

const StaticContentManagement: React.FC = () => {
  const [contents, setContents] = useState<StaticContent[]>([
    {
      id: '1',
      title: 'Termos de Uso',
      slug: 'terms',
      content: 'Conteúdo atual dos termos de uso...',
      lastUpdated: '2024-01-15',
      isActive: true
    },
    {
      id: '2',
      title: 'Política de Privacidade',
      slug: 'privacy',
      content: 'Conteúdo atual da política de privacidade...',
      lastUpdated: '2024-01-15',
      isActive: true
    },
    {
      id: '3',
      title: 'FAQ - Perguntas Frequentes',
      slug: 'faq',
      content: 'Conteúdo atual do FAQ...',
      lastUpdated: '2024-01-15',
      isActive: true
    }
  ]);

  const [editingContent, setEditingContent] = useState<StaticContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (content: StaticContent) => {
    setEditingContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingContent) return;
    
    setContents(prev => prev.map(item => 
      item.id === editingContent.id ? editingContent : item
    ));
    
    setEditingContent(null);
    setIsEditing(false);
    
    // Aqui você implementaria a chamada para salvar no banco de dados
    console.log('Salvando conteúdo:', editingContent);
  };

  const handleCancel = () => {
    setEditingContent(null);
    setIsEditing(false);
  };

  const handleContentChange = (field: keyof StaticContent, value: string) => {
    if (!editingContent) return;
    
    setEditingContent(prev => prev ? {
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0]
    } : null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Gerenciamento de Conteúdo Estático
        </h2>
        <p className="text-gray-600 mt-2">
          Gerencie os conteúdos estáticos do site como Termos de Uso, Política de Privacidade e FAQ
        </p>
      </div>

      <div className="grid gap-6">
        {contents.map((content) => (
          <div key={content.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {content.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Slug: {content.slug} • Última atualização: {content.lastUpdated}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {isEditing && editingContent?.id === content.id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Salvar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(content)}
                    className="btn-primary flex items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                )}
              </div>
            </div>

            {isEditing && editingContent?.id === content.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingContent.title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo
                  </label>
                  <textarea
                    value={editingContent.content}
                    onChange={(e) => handleContentChange('content', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                  />
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-md p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {content.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          💡 Dicas de Formatação
        </h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Use Markdown para formatação básica</li>
          <li>• **Negrito** para texto importante</li>
          <li>• *Itálico* para ênfase</li>
          <li>• - Listas com traços</li>
          <li>• 1. Listas numeradas</li>
        </ul>
      </div>
    </div>
  );
};

export default StaticContentManagement;