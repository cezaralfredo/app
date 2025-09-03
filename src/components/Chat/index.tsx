import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';

type Message = {
  id: string;
  sender: 'user' | 'provider';
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
};

type ChatProps = {
  requestId: string;
  otherPartyName: string;
  otherPartyAvatar?: string;
  isProvider?: boolean;
};

const Chat: React.FC<ChatProps> = ({ requestId, otherPartyName, otherPartyAvatar, isProvider = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'provider',
      content: 'Olá! Estou disponível para atender sua solicitação de aluguel do Guindaste XYZ.',
      timestamp: new Date(Date.now() - 3600000 * 24),
      read: true
    },
    {
      id: '2',
      sender: 'user',
      content: 'Oi! Preciso do equipamento para o dia 15/07. Vocês têm disponibilidade?',
      timestamp: new Date(Date.now() - 3600000 * 23),
      read: true
    },
    {
      id: '3',
      sender: 'provider',
      content: 'Sim, temos disponibilidade para essa data. Você precisa com operador?',
      timestamp: new Date(Date.now() - 3600000 * 22),
      read: true
    },
    {
      id: '4',
      sender: 'user',
      content: 'Sim, preciso com operador. Qual seria o valor total para um dia de serviço?',
      timestamp: new Date(Date.now() - 3600000 * 21),
      read: true
    },
    {
      id: '5',
      sender: 'provider',
      content: 'O valor para um dia com operador é de R$ 2.500,00, incluindo mobilização. Posso enviar uma proposta formal?',
      timestamp: new Date(Date.now() - 3600000 * 20),
      read: true
    },
    {
      id: '6',
      sender: 'user',
      content: 'Perfeito! Por favor, envie a proposta. Preciso também saber se vocês emitem nota fiscal.',
      timestamp: new Date(Date.now() - 3600000 * 10),
      read: true
    },
    {
      id: '7',
      sender: 'provider',
      content: 'Sim, emitimos nota fiscal. Estou enviando a proposta em anexo.',
      timestamp: new Date(Date.now() - 3600000 * 5),
      read: true,
      attachments: [
        {
          type: 'document',
          url: '#',
          name: 'proposta_servico_123.pdf'
        }
      ]
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      sender: isProvider ? 'provider' : 'user',
      content: newMessage,
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      {/* Chat header */}
      <div className="px-4 py-3 bg-primary-600 text-white flex items-center">
        <div className="flex-shrink-0">
          {otherPartyAvatar ? (
            <img
              className="h-10 w-10 rounded-full"
              src={otherPartyAvatar}
              alt={otherPartyName}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-300 flex items-center justify-center text-white font-medium text-lg">
              {otherPartyName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{otherPartyName}</p>
          <p className="text-xs">ID da Solicitação: {requestId}</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === (isProvider ? 'provider' : 'user') ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === (isProvider ? 'provider' : 'user') ? 'bg-primary-100 text-gray-800' : 'bg-white border border-gray-200 text-gray-800'}`}
            >
              <div className="text-sm">{message.content}</div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                      {attachment.type === 'image' ? (
                        <PhotoIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <PaperClipIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <a
                        href={attachment.url}
                        className="ml-2 text-xs text-primary-600 hover:text-primary-800 truncate"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        <div className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <PhotoIcon className="h-5 w-5" />
          </button>
          <div className="relative flex-grow ml-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="focus:ring-primary-500 focus:border-primary-500 w-full focus:outline-none text-gray-600 placeholder-gray-400 pl-4 pr-10 py-2 border border-gray-300 rounded-full"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>
          <button
            type="button"
            onClick={handleSendMessage}
            className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-white bg-primary-600 hover:bg-primary-700 ml-2 focus:outline-none"
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;