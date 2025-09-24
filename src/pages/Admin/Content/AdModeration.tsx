import React, { useState, useEffect } from 'react';
import {
  EyeIcon, 
  EyeSlashIcon, 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface EquipmentAd {
  id: string;
  title: string;
  providerName: string;
  category: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  createdAt: string;
  imageUrl?: string;
  rejectionReason?: string;
}

const AdModeration: React.FC = () => {
  const [ads, setAds] = useState<EquipmentAd[]>([
    {
      id: '1',
      title: 'Trator John Deere 2023',
      providerName: 'Fazenda Santa Maria',
      category: 'Tratores',
      price: 150000,
      status: 'pending',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Colheitadeira New Holland',
      providerName: 'Agro Silva',
      category: 'Colheitadeiras',
      price: 280000,
      status: 'approved',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Pulverizador 2000L',
      providerName: 'Fazenda Modelo',
      category: 'Pulverizadores',
      price: 45000,
      status: 'rejected',
      createdAt: '2024-01-13',
      rejectionReason: 'Fotos de baixa qualidade'
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAd, setSelectedAd] = useState<EquipmentAd | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredAds = ads.filter(ad => 
    selectedStatus === 'all' || ad.status === selectedStatus
  );

  const getStatusIcon = (status: EquipmentAd['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckIcon className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XMarkIcon className="h-4 w-4 text-red-600" />;
      case 'active':
        return <EyeIcon className="h-4 w-4 text-blue-600" />;
      case 'inactive':
        return <EyeSlashIcon className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: EquipmentAd['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  const getStatusColor = (status: EquipmentAd['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (ad: EquipmentAd) => {
    setAds(prev => prev.map(item => 
      item.id === ad.id ? { ...item, status: 'approved' } : item
    ));
    // Implementar chamada API para aprovar
    console.log('Aprovando anúncio:', ad.id);
  };

  const handleReject = (ad: EquipmentAd) => {
    if (!rejectionReason.trim()) {
      alert('Por favor, informe o motivo da rejeição');
      return;
    }
    
    setAds(prev => prev.map(item => 
      item.id === ad.id ? { 
        ...item, 
        status: 'rejected',
        rejectionReason 
      } : item
    ));
    
    setSelectedAd(null);
    setRejectionReason('');
    // Implementar chamada API para rejeitar
    console.log('Rejeitando anúncio:', ad.id, 'Motivo:', rejectionReason);
  };

  const handleToggleStatus = (ad: EquipmentAd) => {
    const newStatus = ad.status === 'active' ? 'inactive' : 'active';
    setAds(prev => prev.map(item => 
      item.id === ad.id ? { ...item, status: newStatus } : item
    ));
    // Implementar chamada API para alterar status
    console.log('Alterando status do anúncio:', ad.id, '->', newStatus);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Moderação de Anúncios</h2>
          <p className="text-gray-600 mt-2">
            Gerencie e modere os anúncios de equipamentos agrícolas
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovados</option>
            <option value="rejected">Rejeitados</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
          
          <div className="text-sm text-gray-500">
            {filteredAds.length} anúncio(s) encontrado(s)
          </div>
        </div>
      </div>

      {selectedAd && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Rejeitar Anúncio</h3>
            <p className="text-gray-600 mb-4">
              Informe o motivo da rejeição para <strong>{selectedAd.title}</strong>
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Motivo da rejeição..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            
            <div className="flex space-x-4">
              <button
                onClick={() => handleReject(selectedAd)}
                className="btn-danger flex-1"
              >
                Confirmar Rejeição
              </button>
              <button
                onClick={() => setSelectedAd(null)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anúncio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fornecedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAds.map((ad) => (
              <tr key={ad.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {ad.imageUrl && (
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="h-10 w-10 rounded-md object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ad.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{ad.providerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{ad.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    R$ {ad.price.toLocaleString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                    {getStatusIcon(ad.status)}
                    <span className="ml-1">{getStatusText(ad.status)}</span>
                  </span>
                  {ad.rejectionReason && (
                    <div className="text-xs text-red-600 mt-1">
                      <ExclamationTriangleIcon className="h-3 w-3 inline mr-1" />
                      {ad.rejectionReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {ad.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(ad)}
                          className="text-green-600 hover:text-green-900"
                          title="Aprovar"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setSelectedAd(ad)}
                          className="text-red-600 hover:text-red-900"
                          title="Rejeitar"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    
                    {(ad.status === 'approved' || ad.status === 'active' || ad.status === 'inactive') && (
                      <button
                        onClick={() => handleToggleStatus(ad)}
                        className={ad.status === 'active' 
                          ? "text-gray-600 hover:text-gray-900" 
                          : "text-blue-600 hover:text-blue-900"
                        }
                        title={ad.status === 'active' ? "Desativar" : "Ativar"}
                      >
                        {ad.status === 'active' ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Nenhum anúncio encontrado com o filtro selecionado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdModeration;