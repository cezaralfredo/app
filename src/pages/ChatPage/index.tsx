import React, { useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Chat from '../../components/Chat';

type ChatRequest = {
  id: string;
  equipmentName: string;
  providerName: string;
  providerAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
};

const ChatPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  
  // Mock data for chat requests
  const [chatRequests] = useState<ChatRequest[]>([
    {
      id: 'req-001',
      equipmentName: 'Guindaste XYZ 50 ton',
      providerName: 'Construtora Silva Ltda',
      lastMessage: 'Sim, emitimos nota fiscal. Estou enviando a proposta em anexo.',
      lastMessageTime: new Date(Date.now() - 3600000 * 5),
      unreadCount: 0
    },
    {
      id: 'req-002',
      equipmentName: 'Retroescavadeira JCB',
      providerName: 'Terraplanagem Express',
      providerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastMessage: 'Podemos agendar uma visita técnica antes?',
      lastMessageTime: new Date(Date.now() - 3600000 * 2),
      unreadCount: 2
    },
    {
      id: 'req-003',
      equipmentName: 'Empilhadeira Elétrica 2.5 ton',
      providerName: 'LogTech Equipamentos',
      lastMessage: 'Você: Preciso para o próximo mês inteiro',
      lastMessageTime: new Date(Date.now() - 3600000 * 24),
      unreadCount: 0
    },
    {
      id: 'req-004',
      equipmentName: 'Caminhão Munck 12 ton',
      providerName: 'TransCarga Brasil',
      lastMessage: 'Temos disponibilidade para a data solicitada.',
      lastMessageTime: new Date(Date.now() - 3600000 * 48),
      unreadCount: 0
    }
  ]);

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row h-[80vh] bg-white rounded-lg shadow overflow-hidden">
        {/* Chat list sidebar */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 ${activeChat && 'hidden md:block'}`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Mensagens</h2>
            <p className="text-sm text-gray-500">Gerencie suas conversas com prestadores</p>
          </div>
          
          <div className="overflow-y-auto h-[calc(80vh-80px)]">
            {chatRequests.map((request) => (
              <div 
                key={request.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${activeChat === request.id ? 'bg-primary-50' : ''}`}
                onClick={() => setActiveChat(request.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 relative">
                    {request.providerAvatar ? (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={request.providerAvatar}
                        alt={request.providerName}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-lg">
                        {request.providerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {request.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {request.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{request.providerName}</h3>
                      <span className="text-xs text-gray-500">{formatLastMessageTime(request.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-1 truncate">{request.equipmentName}</p>
                    <p className="text-sm text-gray-600 mt-1 truncate">{request.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className={`w-full md:w-2/3 ${!activeChat ? 'hidden md:flex' : 'flex'} flex-col`}>
          {activeChat ? (
            <>
              <div className="md:hidden p-2 border-b border-gray-200">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-1" />
                  <span>Voltar</span>
                </button>
              </div>
              <div className="flex-1">
                {chatRequests.find(req => req.id === activeChat) && (
                  <Chat 
                    requestId={activeChat}
                    otherPartyName={chatRequests.find(req => req.id === activeChat)?.providerName || ''}
                    otherPartyAvatar={chatRequests.find(req => req.id === activeChat)?.providerAvatar}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Suas mensagens</h3>
                <p className="text-gray-500 mb-6">Selecione uma conversa para visualizar as mensagens ou inicie uma nova solicitação.</p>
                <Link
                  to="/search"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Buscar equipamentos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;